CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS disputes (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    subject VARCHAR(150) NOT NULL,
    grade_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    CONSTRAINT valid_status
        CHECK (status IN ('Open', 'Resolved'))
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_open_student_subject
ON disputes(student_id, subject)
WHERE status = 'Open';