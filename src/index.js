const express = require("express");
require("dotenv").config();
const logger = require("./config/logger");
const routes = require("./routes");
const message = require("./contants/message.json");
const cors = require("cors");
const { default: helmet } = require("helmet");
const morgan = require("./config/morgan");
const apiResponse = require("./middlewares/api.response");
const { transport } = require("./utils/email-sending");
const { fetchAndStoreMetrics, fetchIDoseTelemetryData } = require("./utils/cron.services");
require("./models/index");
require("./config/supabaseClient");
``;

const app = express();

app.use(express.json());

app.options("*", cors());
app.use(cors({ origin: "*" }));
app.use(helmet());

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use("/api/v1", routes);

app.use((req, res, next) => {
  return apiResponse.NOT_FOUND({ res, message: message.route_not_found });
});

app.listen(process.env.PORT, () => {
  logger.info(`Listening to port ${process.env.PORT}`);
  transport
    .verify()
    .then(() => logger.info("📧 Connected to email server 📧"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
});

// Call every 60,000 ms (1 minute)
// setInterval(fetchIDoseTelemetryData,  65 * 1000);
// // Call every 60,000 ms (1 minute)
// setInterval(fetchAndStoreMetrics,  60 * 1000);
