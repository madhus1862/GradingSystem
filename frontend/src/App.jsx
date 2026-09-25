
import React, { useEffect, useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DisputeForm from "./components/DisputeForm";

import "./App.css";

function App() {
    const [student, setStudent] = useState(null);
    const [showRegister, setShowRegister] = useState(false);
    const [disputes, setDisputes] = useState([]);

    // Check if student is already logged in
    useEffect(() => {
        const savedStudent = localStorage.getItem("student");

        if (savedStudent) {
            setStudent(JSON.parse(savedStudent));
        }
    }, []);

    // Load disputes after login
    useEffect(() => {
        if (student) {
            loadDisputes();
        }
    }, [student]);

    // Get disputes from backend
    const loadDisputes = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/disputes/${student.student_id}`
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            setDisputes(data);

        } catch (error) {
            console.error(
                "Error loading disputes:",
                error
            );
        }
    };

    // Login
    const handleLogin = (studentData) => {
        setStudent(studentData);

        localStorage.setItem(
            "student",
            JSON.stringify(studentData)
        );

        setShowRegister(false);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("student");

        setStudent(null);
        setDisputes([]);
    };

    // Create new dispute
    const handleCreateDispute = async (disputeData) => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/disputes",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        student_id: student.student_id,
                        subject: disputeData.subject,
                        grade_date: disputeData.grade_date,
                        reason: disputeData.reason
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to create dispute.");
                throw new Error(data.message);
            }

            await loadDisputes();

            alert("Dispute submitted successfully.");

        } catch (error) {
            console.error(
                "Error creating dispute:",
                error
            );

            throw error;
        }
    };

    // Resolve dispute
    const handleResolveDispute = async (disputeId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/disputes/${disputeId}/resolve`,
                {
                    method: "PATCH"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to resolve dispute."
                );

                return;
            }

            // Refresh the list after resolving
            await loadDisputes();

            alert("Dispute marked as resolved.");

        } catch (error) {
            console.error(
                "Error resolving dispute:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        }
    };

    // Login / Register screen
    if (!student) {

        if (showRegister) {
            return (
                <Register
                    onBackToLogin={() =>
                        setShowRegister(false)
                    }
                />
            );
        }

        return (
            <Login
                onLogin={handleLogin}
                onRegister={() =>
                    setShowRegister(true)
                }
            />
        );
    }

    // Dashboard
    return (
        <div className="app">

            <Header
                student={student}
                onLogout={handleLogout}
            />

            <div className="dashboard-layout">

                <Sidebar
                    disputes={disputes}
                    onResolve={handleResolveDispute}
                />

                <main className="main-content">

                    <DisputeForm
                        onCreated={handleCreateDispute}
                    />

                </main>

            </div>

        </div>
    );
}

export default App;
