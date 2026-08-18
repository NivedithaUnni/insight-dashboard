const express = require("express");

const {
    getDashboardStats,
    getDashboardAnalytics
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/stats",
    authMiddleware,
    getDashboardStats
);

router.get(
    "/analytics",
    authMiddleware,
    getDashboardAnalytics
);

module.exports = router;