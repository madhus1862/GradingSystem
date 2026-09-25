import React, { useState } from "react";

function Register({ onBackToLogin }) {

    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        if (
            !studentId ||
            !name ||
            !email ||
            !password
        ) {
            setError("Please fill all fields.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        student_id: studentId,
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setMessage(data.message);

            // Clear form
            setStudentId("");
            setName("");
            setEmail("");
            setPassword("");

        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <div className="login-icon">
                        🎓
                    </div>

                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Register as a student
                    </p>

                </div>


                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Student ID
                        </label>

                        <input
                            type="text"
                            placeholder="Enter Student ID"
                            value={studentId}
                            onChange={
                                (event) =>
                                    setStudentId(
                                        event.target.value
                                    )
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={
                                (event) =>
                                    setName(
                                        event.target.value
                                    )
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={
                                (event) =>
                                    setEmail(
                                        event.target.value
                                    )
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={
                                (event) =>
                                    setPassword(
                                        event.target.value
                                    )
                            }
                        />

                    </div>


                    {error && (
                        <div className="login-error">
                            ⚠️ {error}
                        </div>
                    )}


                    {message && (
                        <div className="success-message">
                            ✅ {message}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>


                    <button
                        type="button"
                        className="back-button"
                        onClick={onBackToLogin}
                    >
                        ← Back to Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Register;