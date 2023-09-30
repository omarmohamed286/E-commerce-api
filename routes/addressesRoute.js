const express = require("express");
const authService = require("../services/authService");

const {
    addAddress,
  removeAddress,
  getAddresses,
} = require("../services/addressesService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addAddress).get(getAddresses);

router.delete("/:addressId", removeAddress);

module.exports = router;
