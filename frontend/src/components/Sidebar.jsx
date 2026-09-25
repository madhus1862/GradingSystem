import React from "react";
import TicketCard from "./TicketCard";

function Sidebar({
    disputes,
    onResolve
}) {

    const openDisputes = disputes.filter(
        dispute => dispute.status === "Open"
    );

    const resolvedDisputes = disputes.filter(
        dispute => dispute.status === "Resolved"
    );

    return (
        <aside className="sidebar">

            <div className="sidebar-header">
                <h3>My Disputes</h3>

                <span className="ticket-count">
                    {disputes.length}
                </span>
            </div>


            {/* OPEN DISPUTES */}

            <div className="ticket-section">

                <div className="section-title">
                    <span>Active Tickets</span>

                    <span className="active-count">
                        {openDisputes.length}
                    </span>
                </div>


                {openDisputes.length === 0 ? (

                    <div className="empty-state">
                        <div className="empty-icon">
                            📂
                        </div>

                        <p>
                            No active disputes
                        </p>
                    </div>

                ) : (

                    openDisputes.map(dispute => (

                        <TicketCard
                            key={dispute.id}
                            dispute={dispute}
                            onResolve={onResolve}
                        />

                    ))

                )}

            </div>


            {/* RESOLVED DISPUTES */}

            <div className="ticket-section">

                <div className="section-title">
                    <span>Resolved Tickets</span>

                    <span className="resolved-count">
                        {resolvedDisputes.length}
                    </span>
                </div>


                {resolvedDisputes.length === 0 ? (

                    <div className="empty-state">
                        <div className="empty-icon">
                            ✓
                        </div>

                        <p>
                            No resolved disputes
                        </p>
                    </div>

                ) : (

                    resolvedDisputes.map(dispute => (

                        <TicketCard
                            key={dispute.id}
                            dispute={dispute}
                        />

                    ))

                )}

            </div>

        </aside>
    );
}

export default Sidebar;