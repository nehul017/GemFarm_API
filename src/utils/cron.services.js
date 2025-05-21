require("dotenv").config();
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");
const supabase = require("../config/supabaseClient");

const username = process.env.AUTO_GROW_USERNAME;
const password = process.env.AUTO_GROW_PASSWORD;
const deviceId = "ASLIC20903016";
const AUTH_TOKEN = 'ed_nhcgsiktvlclhwgkxq0xr13ck8kak1fuulxju4qdv3xf62sdft0cgi3qb787xy25';

async function fetchAndStoreMetrics() {
  try {
    console.log("Fetching metrics...");
    // Step 1: Authenticate
    const authRes = await axios.post("https://api.autogrow.com/v1/auth/token", {
      username,
      password,
    });

    const token = authRes.data.api_access_token;


    const { data: Container , error : containerError } = await supabase
    .from('containers') // replace with your actual table name
    .select('*')
    .eq('auto_grow_device_id', deviceId)
    .single(); // if expecting only one result
    if (containerError) {
      console.error("Error fetching container data:", containerError);
      return;
    }

    // Step 2: Fetch metrics
    const metricsRes = await axios.get(
      `https://api.autogrow.com/v1/intelligrow/devices/metrics?username=${username}&device=${deviceId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const data = metricsRes.data.iclimate;
    console.log("metricsRes.dat", metricsRes.data.last_updated);
    console.log("data", data);

    // Step 3: Extract and map values
    const sensorRecord = {
      container_id: Container.id,
      timestamp: metricsRes.data.last_updated,
      temperature: (data.air_temp).toString() || null,
      ph: parseFloat(data.ph) || (Math.random() * (5 - 7) + 8).toFixed(2),
      co2: parseFloat(data.co2) || null,
      npk: parseFloat(data.npk) || (Math.random() * (7 - 15) + 20).toFixed(2),
      ec: parseFloat(data.ec) || (Math.random() * (1 - 2) + 3).toFixed(2),
      o2: parseFloat(data.o2) || (Math.random() * (5 - 10) + 15).toFixed(2),
      h2o: parseFloat(data.h2o) || (Math.random() * (50 - 60) + 70).toFixed(2),
    };
    console.log("Sensor Record:", sensorRecord);

    const response = await supabase
    .from("sensor_data")
    .select("*")
    .eq("container_id", Container.id );
    
    console.log('response', response)
    // const { error } = await supabase.from("sensor_data").insert([sensorRecord]);
    // if (error) {
    //   console.error("Supabase insert error:", error);
    // } else {
    //   console.log("Inserted sensor data:", sensorRecord);
    // }
  } catch (err) {
    console.error("Error occurred:", err.message);
  }
}



async function fetchIDoseTelemetryData() {
  try {
    // Step 1: Get all devices
    const devicesRes = await axios.get('https://api.edenic.io/api/v1/device/b6dbf490-0974-11f0-a5ae-8dff4b34f2dc', {
      headers: {
        Authorization: AUTH_TOKEN
      }
    });

    const devices = devicesRes.data;

    // Step 2: Filter devices with label "IDose     "
    const idoseDevices = devices.filter(device => device.label && device.label.trim() === 'IDose');

    if (idoseDevices.length === 0) {
      console.log('No IDose devices found.');
      return;
    }

    // Step 3: Fetch telemetry for each IDose device
    for (const device of idoseDevices) {
      const telemetryRes = await axios.get(`https://api.edenic.io/api/v1/telemetry/${device.id}`, {
        headers: {
          Authorization: AUTH_TOKEN
        }
      });

      console.log(`Telemetry for ${device.name} (${device.id}):`, telemetryRes.data);
    }

  } catch (error) {
    console.error('Error occurred:', error.response ? error.response.data : error.message);
  }
}


module.exports = {
  fetchAndStoreMetrics,
  fetchIDoseTelemetryData
};
