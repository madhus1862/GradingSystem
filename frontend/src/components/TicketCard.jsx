import React from "react";

function TicketCard({
    dispute,
    onResolve
}) {

    const handleResolve = () => {

        const confirmed = window.confirm(
            "Are you sure you want to mark this dispute as resolved?"
        );

        if (!confirmed) {
            return;
        }

        if (typeof onResolve !== "function") {
            console.error(
                "onResolve function was not provided."
            );

            return;
        }

        onResolve(dispute.id);
    };


    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        const dateObject = new Date(date);

        return dateObject.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    return (

        <div className="ticket-card">

            <div className="ticket-top">

                <div className="ticket-id">
                    Ticket #{dispute.id}
                </div>

                <span
                    className={
                        dispute.status === "Open"
                            ? "status-badge open"
                            : "status-badge resolved"
                    }
                >
                    {dispute.status}
                </span>

            </div>


            <h4 className="ticket-subject">
                {dispute.subject}
            </h4>


            <div className="ticket-date">

                <span>
                    Grade Date:
                </span>

                <strong>
                    {formatDate(
                        dispute.grade_date
                    )}
                </strong>

            </div>


            <div className="ticket-reason">

                <span>
                    Reason:
                </span>

                <p>
                    {dispute.reason}
                </p>

            </div>


            <div className="ticket-created">

                Created:

                {" "}

                {formatDate(
                    dispute.created_at
                )}

            </div>


            {/* Resolve button only for Open tickets */}

            {dispute.status === "Open" && (

                <button
                    type="button"
                    className="resolve-button"
                    onClick={handleResolve}
                >
                    ✓ Mark as Resolved
                </button>

            )}

        </div>
    );
}

export default TicketCard;