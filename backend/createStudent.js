const bcrypt = require("bcrypt");
const pool = require("./db/database");

const createStudent = async () => {
    try {
        const password = "student123";

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO students
            (student_id, name, email, password)
            VALUES ($1, $2, $3, $4)`,
            [
                "STU1001",
                "Madhumitha S",
                "madhumitha@gmail.com",
                hashedPassword
            ]
        );

        console.log("Student created successfully.");

    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
};

createStudent();