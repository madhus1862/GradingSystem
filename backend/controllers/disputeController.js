const pool = require("../db/database");


/*
    Validate date in YYYY-MM-DD format
*/
function parseDateOnly(dateString) {

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return null;
    }

    const [year, month, day] = dateString
        .split("-")
        .map(Number);

    const date = new Date(
        Date.UTC(year, month - 1, day)
    );

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return null;
    }

    return date;
}


/*
    Get today's date in UTC
*/
function getTodayUTC() {

    const today = new Date();

    return new Date(
        Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate()
        )
    );
}


/*
    Calculate number of days between two dates
*/
function calculateAgeInDays(gradeDate, today) {

    const difference =
        today.getTime() - gradeDate.getTime();

    return Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );
}


/*
    GET all disputes for a student
*/
async function getDisputes(req, res, next) {

    try {

        const studentId = req.params.studentId;

        if (!studentId) {

            return res.status(400).json({
                message: "Student ID is required."
            });
        }

        const result = await pool.query(
            `
            SELECT
                id,
                student_id,
                subject,
                grade_date,
                reason,
                status,
                created_at
            FROM disputes
            WHERE student_id = $1
            ORDER BY
                CASE
                    WHEN status = 'Open' THEN 0
                    ELSE 1
                END,
                created_at DESC
            `,
            [studentId]
        );

        return res.status(200).json(result.rows);

    } catch (error) {

        next(error);
    }
}


/*
    CREATE a new dispute
*/
async function createDispute(req, res, next) {

    try {

        const {
            student_id,
            subject,
            grade_date,
            reason
        } = req.body;


        /*
            Validate required fields
        */
        if (
            !student_id ||
            !subject ||
            !grade_date ||
            !reason
        ) {

            return res.status(400).json({
                message:
                    "Student ID, subject, grade date and reason are required."
            });
        }


        /*
            Clean input
        */
        const cleanStudentId = String(student_id).trim();
        const cleanSubject = String(subject).trim();
        const cleanReason = String(reason).trim();


        if (
            cleanStudentId.length === 0 ||
            cleanSubject.length === 0 ||
            cleanReason.length === 0
        ) {

            return res.status(400).json({
                message:
                    "Student ID, subject and reason cannot be empty."
            });
        }


        /*
            Validate grade date
        */
        const gradeDateObject =
            parseDateOnly(grade_date);

        if (!gradeDateObject) {

            return res.status(400).json({
                message:
                    "Invalid grade date. Use YYYY-MM-DD format."
            });
        }


        /*
            Get current date
        */
        const today = getTodayUTC();


        /*
            Calculate age
        */
        const ageInDays =
            calculateAgeInDays(
                gradeDateObject,
                today
            );


        /*
            Future date validation
        */
        if (ageInDays < 0) {

            return res.status(400).json({
                message:
                    "Grade date cannot be in the future."
            });
        }


        /*
            30-day validation
        */
        if (ageInDays > 30) {

            return res.status(400).json({
                message:
                    "Dispute cannot be raised because the grade date is more than 30 days old."
            });
        }


        /*
            Check duplicate OPEN dispute
            for same student and subject
        */
        const duplicateResult =
            await pool.query(
                `
                SELECT id
                FROM disputes
                WHERE student_id = $1
                AND subject = $2
                AND status = 'Open'
                LIMIT 1
                `,
                [
                    cleanStudentId,
                    cleanSubject
                ]
            );


        if (duplicateResult.rows.length > 0) {

            return res.status(409).json({
                message:
                    "You already have an open dispute for this subject."
            });
        }


        /*
            Create dispute
        */
        const result =
            await pool.query(
                `
                INSERT INTO disputes
                (
                    student_id,
                    subject,
                    grade_date,
                    reason,
                    status
                )
                VALUES
                ($1, $2, $3, $4, 'Open')
                RETURNING
                    id,
                    student_id,
                    subject,
                    grade_date,
                    reason,
                    status,
                    created_at
                `,
                [
                    cleanStudentId,
                    cleanSubject,
                    grade_date,
                    cleanReason
                ]
            );


        return res.status(201).json({
            message: "Dispute created successfully.",
            dispute: result.rows[0]
        });

    } catch (error) {

        next(error);
    }
}


/*
    RESOLVE dispute
*/
async function resolveDispute(req, res, next) {

    try {

        const disputeId =
            Number(req.params.id);


        if (
            !Number.isInteger(disputeId) ||
            disputeId <= 0
        ) {

            return res.status(400).json({
                message: "Invalid dispute ID."
            });
        }


        const result =
            await pool.query(
                `
                UPDATE disputes
                SET status = 'Resolved'
                WHERE id = $1
                AND status = 'Open'
                RETURNING
                    id,
                    student_id,
                    subject,
                    grade_date,
                    reason,
                    status,
                    created_at
                `,
                [disputeId]
            );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message:
                    "Open dispute not found."
            });
        }


        return res.status(200).json({
            message:
                "Dispute resolved successfully.",
            dispute: result.rows[0]
        });

    } catch (error) {

        next(error);
    }
}


module.exports = {
    getDisputes,
    createDispute,
    resolveDispute
};