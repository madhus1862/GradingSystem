const pool = require("../db/database");
const bcrypt = require("bcrypt");

// LOGIN
const loginStudent = async (req, res) => {
    try {
        const { student_id, password } = req.body;

        if (!student_id || !password) {
            return res.status(400).json({
                message: "Student ID and password are required."
            });
        }

        const result = await pool.query(
            `SELECT student_id, name, email, password
             FROM students
             WHERE student_id = $1`,
            [student_id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid Student ID or password."
            });
        }

        const student = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid Student ID or password."
            });
        }

        res.status(200).json({
            message: "Login successful.",
            student: {
                student_id: student.student_id,
                name: student.name,
                email: student.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error during login."
        });
    }
};


// REGISTER
const registerStudent = async (req, res) => {
    try {
        const {
            student_id,
            name,
            email,
            password
        } = req.body;

        // Check empty fields
        if (
            !student_id ||
            !name ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        // Check whether Student ID already exists
        const studentCheck = await pool.query(
            `SELECT student_id
             FROM students
             WHERE student_id = $1`,
            [student_id]
        );

        if (studentCheck.rows.length > 0) {
            return res.status(409).json({
                message: "Student ID already exists."
            });
        }

        // Check whether email already exists
        const emailCheck = await pool.query(
            `SELECT email
             FROM students
             WHERE email = $1`,
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                message: "Email already exists."
            });
        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Insert student
        await pool.query(
            `INSERT INTO students
            (student_id, name, email, password)
            VALUES ($1, $2, $3, $4)`,
            [
                student_id,
                name,
                email,
                hashedPassword
            ]
        );

        res.status(201).json({
            message: "Registration successful. You can now login."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error during registration."
        });
    }
};


module.exports = {
    loginStudent,
    registerStudent
};