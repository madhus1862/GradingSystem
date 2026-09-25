const express = require("express");

const {
    getDisputes,
    createDispute,
    resolveDispute
} = require("../controllers/disputeController");

const router = express.Router();


/*
    Get disputes for student
    GET /api/disputes/STU001
*/
router.get(
    "/:studentId",
    getDisputes
);


/*
    Create dispute
    POST /api/disputes
*/
router.post(
    "/",
    createDispute
);


/*
    Resolve dispute
    PATCH /api/disputes/:id/resolve
*/
router.patch(
    "/:id/resolve",
    resolveDispute
);


module.exports = router;