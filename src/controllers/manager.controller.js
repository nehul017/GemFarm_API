const managerService = require("../services/manager.service");
const { generateStrongPassword } = require("../utils/utils");

exports.create = async (req, res) => {
  try {
    const { email, name, farmIds } = req.body;
    const password = await generateStrongPassword();
    const data = await managerService.createManager({
      email,
      password,
      name,
      farmIds,
    });
    res.status(201).json({ message: "Manager created", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await managerService.getManagers();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await managerService.updateManager(req.params.id, req.body);
    res.status(200).json({ message: "Manager updated", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await managerService.deleteManager(req.params.id);
    res.status(200).json({ message: "Manager deleted", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
