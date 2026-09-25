
import React, { useState } from "react";

function DisputeForm({
    onCreated
}) {

    const [subject, setSubject] =
        useState("");

    const [gradeDate, setGradeDate] =
        useState("");

    const [reason, setReason] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [dateError, setDateError] =
        useState("");


    /*
        Get today's date
    */
    const getToday = () => {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    /*
        Check whether grade date
        is within 30 days
    */
    const validateGradeDate = (selectedDate) => {

        if (!selectedDate) {

            setDateError("");

            return true;
        }


        const gradeDateObject =
            new Date(
                selectedDate + "T00:00:00"
            );

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        /*
            Difference between today
            and grade received date
        */
        const differenceInTime =
            today.getTime() -
            gradeDateObject.getTime();


        const differenceInDays =
            Math.floor(
                differenceInTime /
                (1000 * 60 * 60 * 24)
            );


        /*
            Future date
        */
        if (differenceInDays < 0) {

            setDateError(
                "Grade Received Date cannot be a future date."
            );

            return false;
        }


        /*
            More than 30 days old
        */
        if (differenceInDays > 30) {

            alert(
                "Disputes must be raised within 30 days of receiving the grade."
            );

            return false;
        }


        /*
            Valid date
        */
        setDateError("");

        return true;
    };


    /*
        Handle Grade Date change
    */
    const handleGradeDateChange = (
        event
    ) => {

        const selectedDate =
            event.target.value;

        setGradeDate(
            selectedDate
        );

        validateGradeDate(
            selectedDate
        );
    };


    /*
        Submit form
    */
    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        /*
            Frontend validation
        */
        if (
            !subject ||
            !gradeDate ||
            !reason.trim()
        ) {

            return;
        }


        /*
            Validate 30-day rule
        */
        const isDateValid =
            validateGradeDate(
                gradeDate
            );


        if (!isDateValid) {

            return;
        }


        try {

            setSubmitting(true);


            /*
                Send data to parent
            */
            await onCreated({

                subject:
                    subject,

                grade_date:
                    gradeDate,

                reason:
                    reason.trim()

            });


            /*
                Clear form
            */
            setSubject("");

            setGradeDate("");

            setReason("");

            setDateError("");


        } catch (error) {

            console.error(error);

        } finally {

            setSubmitting(false);
        }
    };


    return (

        <div className="form-card">


            {/* Header */}

            <div className="card-header">

                <div>

                    <h3>
                        Raise a Dispute
                    </h3>

                    <p>
                        Provide the details of your grade concern.
                    </p>

                </div>


                <div className="form-icon">

                    📝

                </div>

            </div>


            {/* Form */}

            <form
                onSubmit={handleSubmit}
            >


                {/* Subject */}

                <div className="form-group">

                    <label htmlFor="subject">

                        Subject

                    </label>


                    <select
                        id="subject"
                        value={subject}
                        onChange={
                            event =>
                                setSubject(
                                    event.target.value
                                )
                        }
                        required
                    >

                        <option value="">

                            Select a subject

                        </option>


                        <option value="Java Programming">

                            Java Programming

                        </option>


                        <option value="Database Management Systems">

                            Database Management Systems

                        </option>


                        <option value="Computer Networks">

                            Computer Networks

                        </option>


                        <option value="Operating Systems">

                            Operating Systems

                        </option>


                        <option value="Web Development">

                            Web Development

                        </option>

                    </select>

                </div>


                {/* Grade Date */}

                <div className="form-group">

                    <label htmlFor="gradeDate">

                        Grade Received Date

                    </label>


                    <input
                        id="gradeDate"
                        type="date"
                        value={gradeDate}
                        max={getToday()}
                        onChange={
                            handleGradeDateChange
                        }
                        required
                    />


                    <small>

                        Disputes must be raised within
                        30 days of receiving the grade.

                    </small>


                    {/* Date Error */}

                    {dateError && (

                        <div className="date-error">

                            ⚠️ {dateError}

                        </div>

                    )}

                </div>


                {/* Reason */}

                <div className="form-group">

                    <div className="label-row">

                        <label htmlFor="reason">

                            Reason for Dispute

                        </label>


                        <span>

                            {reason.length} / 1000

                        </span>

                    </div>


                    <textarea
                        id="reason"
                        rows="7"
                        maxLength="1000"
                        value={reason}
                        placeholder="Explain why you believe the grade should be reviewed..."
                        onChange={
                            event =>
                                setReason(
                                    event.target.value
                                )
                        }
                        required
                    />

                </div>


                {/* Warning */}

                <div className="warning-box">

                    <span>
                        ⚠️
                    </span>


                    <div>

                        <strong>
                            Important
                        </strong>


                        <p>
                            Only one open dispute is allowed
                            for the same subject at a time.
                        </p>

                    </div>

                </div>


                {/* Submit */}

                <button
                    type="submit"
                    className="submit-button"
                    disabled={
                        submitting ||
                        !!dateError
                    }
                >

                    {submitting
                        ? "Submitting..."
                        : "Submit Dispute"
                    }

                </button>


            </form>

        </div>

    );
}


export default DisputeForm;
