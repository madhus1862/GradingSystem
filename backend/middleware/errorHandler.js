function errorHandler(error, req, res, next) {
    console.error(error);

    // PostgreSQL duplicate violation
    if (error.code === "23505") {
        return res.status(409).json({
            message:
                "You already have an open dispute for this subject."
        });
    }

    return res.status(500).json({
        message: "Internal server error."
    });
}

module.exports = errorHandler;