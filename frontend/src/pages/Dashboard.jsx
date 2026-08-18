import { useEffect, useState } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState([]);

    // Selected graph period
    const [days, setDays] = useState(30);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // FETCH DASHBOARD DATA
    // =========================

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "Authentication required. Please login again."
                    );
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };

                // =========================
                // FETCH STATISTICS
                // =========================

                const statsResponse = await fetch(
                    "http://localhost:5000/api/dashboard/stats",
                    {
                        method: "GET",
                        headers,
                    }
                );

                const statsResult = await statsResponse.json();

                if (!statsResponse.ok) {
                    throw new Error(
                        statsResult.message ||
                            "Failed to load dashboard statistics."
                    );
                }

                if (!statsResult.success) {
                    throw new Error(
                        statsResult.message ||
                            "Unable to load dashboard statistics."
                    );
                }

                setStats(statsResult.data);

                // =========================
                // FETCH ANALYTICS
                // =========================

                const analyticsResponse = await fetch(
                    `http://localhost:5000/api/dashboard/analytics?days=${days}`,
                    {
                        method: "GET",
                        headers,
                    }
                );

                const analyticsResult =
                    await analyticsResponse.json();

                if (!analyticsResponse.ok) {
                    throw new Error(
                        analyticsResult.message ||
                            "Failed to load analytics."
                    );
                }

                if (!analyticsResult.success) {
                    throw new Error(
                        analyticsResult.message ||
                            "Unable to load analytics."
                    );
                }

                setAnalytics(analyticsResult.data);

                setError("");
            } catch (err) {
                console.error("Dashboard error:", err);

                setError(
                    err.message ||
                        "Something went wrong while loading the dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [days]);

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("token");

        window.location.href = "/login";
    };

    // =========================
    // LOADING
    // =========================

    if (loading && !stats) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>

                <p>Loading dashboard...</p>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error && !stats) {
        return (
            <div className="dashboard-error-page">
                <div className="error-box">
                    <h2>Unable to Load Dashboard</h2>

                    <p>{error}</p>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Login Again
                    </button>
                </div>
            </div>
        );
    }

    // =========================
    // FORMAT REVENUE
    // =========================

    const formattedRevenue =
        Number(stats?.revenue || 0).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );

    return (
        <div className="dashboard">

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="sidebar">

                <div className="sidebar-logo">
                    <h2>Insight</h2>
                </div>

                <nav className="sidebar-nav">

                    <a
                        href="/dashboard"
                        className="active"
                    >
                        <span>▣</span>
                        Overview
                    </a>

                    <a href="#analytics">
                        <span>◒</span>
                        Analytics
                    </a>

                    <a href="#reports">
                        <span>▤</span>
                        Reports
                    </a>

                    <a href="#activity">
                        <span>◷</span>
                        Activity
                    </a>

                </nav>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </aside>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="dashboard-main">

                {/* =========================
                    HEADER
                ========================= */}

                <header className="dashboard-header">

                    <div>

                        <h1>
                            Dashboard Overview
                        </h1>

                        <p>
                            Monitor your analytics and performance
                        </p>

                    </div>

                    <div className="profile">

                        <div className="profile-avatar">
                            N
                        </div>

                        <div>

                            <strong>
                                Administrator
                            </strong>

                            <small>
                                Dashboard User
                            </small>

                        </div>

                    </div>

                </header>

                {/* =========================
                    ERROR MESSAGE
                ========================= */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* =========================
                    STATISTICS
                ========================= */}

                <section className="stats-grid">

                    {/* TOTAL USERS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            👥
                        </div>

                        <div>

                            <p>
                                Total Users
                            </p>

                            <h2>
                                {Number(
                                    stats?.totalUsers || 0
                                ).toLocaleString()}
                            </h2>

                            <small>
                                Unique users
                            </small>

                        </div>

                    </div>

                    {/* TOTAL EVENTS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            📊
                        </div>

                        <div>

                            <p>
                                Total Events
                            </p>

                            <h2>
                                {Number(
                                    stats?.totalEvents || 0
                                ).toLocaleString()}
                            </h2>

                            <small>
                                Recorded events
                            </small>

                        </div>

                    </div>

                    {/* PURCHASERS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🛒
                        </div>

                        <div>

                            <p>
                                Purchasers
                            </p>

                            <h2>
                                {Number(
                                    stats?.purchasers || 0
                                ).toLocaleString()}
                            </h2>

                            <small>
                                Customers who purchased
                            </small>

                        </div>

                    </div>

                    {/* REVENUE */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            $
                        </div>

                        <div>

                            <p>
                                Revenue
                            </p>

                            <h2>
                                ${formattedRevenue}
                            </h2>

                            <small>
                                Total revenue
                            </small>

                        </div>

                    </div>

                </section>

                {/* =========================
                    DASHBOARD GRID
                ========================= */}

                <section className="dashboard-grid">

                    {/* =========================
                        ANALYTICS GRAPH
                    ========================= */}

                    <div
                        className="dashboard-card"
                        id="analytics"
                    >

                        <div className="card-header">

                            <div>

                                <h3>
                                    User & Event Analytics
                                </h3>

                                <p>
                                    Analytics data from Google BigQuery
                                </p>

                            </div>

                            {/* PERIOD SELECTOR */}

                            <select
                                value={days}
                                onChange={(e) =>
                                    setDays(
                                        Number(e.target.value)
                                    )
                                }
                            >

                                <option value={7}>
                                    Last 7 days
                                </option>

                                <option value={30}>
                                    Last 30 days
                                </option>

                                <option value={90}>
                                    Last 90 days
                                </option>

                            </select>

                        </div>

                        {/* =========================
                            GRAPH
                        ========================= */}

                        <div className="chart-placeholder">

                            {analytics.length === 0 ? (

                                <div className="chart-empty">
                                    <p>
                                        No analytics data available
                                    </p>
                                </div>

                            ) : (

                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >

                                    <LineChart
                                        data={analytics}
                                        margin={{
                                            top: 10,
                                            right: 20,
                                            left: 0,
                                            bottom: 10,
                                        }}
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            dataKey="date"
                                            tick={{
                                                fontSize: 11,
                                            }}
                                        />

                                        <YAxis
                                            tick={{
                                                fontSize: 11,
                                            }}
                                        />

                                        <Tooltip />

                                        <Legend />

                                        <Line
                                            type="monotone"
                                            dataKey="users"
                                            name="Users"
                                            stroke="#4f46e5"
                                            strokeWidth={2}
                                            dot={false}
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="events"
                                            name="Events"
                                            stroke="#16a34a"
                                            strokeWidth={2}
                                            dot={false}
                                        />

                                    </LineChart>

                                </ResponsiveContainer>

                            )}

                        </div>

                    </div>

                    {/* =========================
                        RECENT ACTIVITY
                    ========================= */}

                    <div
                        className="dashboard-card"
                        id="activity"
                    >

                        <div className="card-header">

                            <div>

                                <h3>
                                    Recent Activity
                                </h3>

                                <p>
                                    Latest dashboard activity
                                </p>

                            </div>

                        </div>

                        <div className="activity-list">

                            {/* ACTIVITY 1 */}

                            <div className="activity-item">

                                <div className="activity-dot success-dot">
                                    ✓
                                </div>

                                <div>

                                    <strong>
                                        BigQuery connected
                                    </strong>

                                    <p>
                                        Analytics data loaded successfully
                                    </p>

                                    <small>
                                        Just now
                                    </small>

                                </div>

                            </div>

                            {/* ACTIVITY 2 */}

                            <div className="activity-item">

                                <div className="activity-dot">
                                    👥
                                </div>

                                <div>

                                    <strong>
                                        Users analyzed
                                    </strong>

                                    <p>
                                        {Number(
                                            stats?.totalUsers || 0
                                        ).toLocaleString()}{" "}
                                        users found
                                    </p>

                                    <small>
                                        Dashboard statistics
                                    </small>

                                </div>

                            </div>

                            {/* ACTIVITY 3 */}

                            <div className="activity-item">

                                <div className="activity-dot">
                                    📊
                                </div>

                                <div>

                                    <strong>
                                        Events processed
                                    </strong>

                                    <p>
                                        {Number(
                                            stats?.totalEvents || 0
                                        ).toLocaleString()}{" "}
                                        events
                                    </p>

                                    <small>
                                        Google Analytics data
                                    </small>

                                </div>

                            </div>

                            {/* ACTIVITY 4 */}

                            <div className="activity-item">

                                <div className="activity-dot success-dot">
                                    $
                                </div>

                                <div>

                                    <strong>
                                        Revenue tracked
                                    </strong>

                                    <p>
                                        ${formattedRevenue}
                                    </p>

                                    <small>
                                        Purchase analytics
                                    </small>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* =========================
                    FOOTER
                ========================= */}

                <footer className="dashboard-footer">

                    <p>
                        Insight Dashboard • Powered by Google BigQuery
                    </p>

                </footer>

            </main>

        </div>
    );
}

export default Dashboard;