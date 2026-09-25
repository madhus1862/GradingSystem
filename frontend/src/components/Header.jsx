import React from "react";

function Header({ student, onLogout }) {

    return (

        <header className="header">

            <div className="header-left">

                <div className="logo">
                    🎓
                </div>

                <div>

                    <h1>
                        Grade Dispute System
                    </h1>

                    <p>
                        Student academic support
                    </p>

                </div>

            </div>

            <div className="header-right">

                <div className="secure-badge">
                    🔒 Secure Workflow
                </div>

                {student && (

                    <button
                        className="logout-button"
                        onClick={onLogout}
                    >
                        Logout
                    </button>

                )}

            </div>

        </header>
    );
}

export default Header;