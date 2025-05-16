const express = require("express");
const router = express.Router();
const controller = require("../controllers/manager.controller");
const validate = require("../middlewares/validate");
const { createManagerSchema } = require("../validations/manager.validation");
const authenticate = require("../middlewares/roleBaseAuthentication");

router.post(
  "/create",
  authenticate(["SuperAdmin", "FarmOwner"]),
  validate({ body: createManagerSchema }),
  controller.create
);
router.get(
  "/get",
  authenticate(["SuperAdmin", "FarmOwner"]),
  controller.getAll
);
router.put(
  "/update/:id",
  authenticate(["SuperAdmin", "FarmOwner"]),
  controller.update
);
router.delete(
  "/delete/:id",
  authenticate(["SuperAdmin", "FarmOwner"]),
  controller.remove
);

module.exports = router;
