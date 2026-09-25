const express = require("express");

const router = express.Router();

const {
    loginStudent,
    registerStudent
} = require("../controllers/authController");


// Login
router.post("/login", loginStudent);


// Register
router.post("/register", registerStudent);


module.exports = router;