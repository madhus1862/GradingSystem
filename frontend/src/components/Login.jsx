import React, { useState } from "react";

function Login({
    onLogin,
    onRegister
}) {

    const [studentId, setStudentId] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!studentId || !password) {

            setError(
                "Please enter Student ID and password."
            );

            return;
        }


        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        student_id: studentId,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(data.message);

                return;
            }


            onLogin(data.student);


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

                    

                    <h1>
                        Grade Dispute System
                    </h1>

                    <p>
                        Student Login
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


                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>


                    <div className="register-section">

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            className="register-link"
                            onClick={onRegister}
                        >
                            Create Account
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default Login;