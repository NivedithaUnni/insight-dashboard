const { BigQuery } = require("@google-cloud/bigquery");

const bigquery = new BigQuery({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// =========================
// DASHBOARD STATS
// =========================

const getDashboardStats = async (req, res, next) => {
    try {
        const query = `
            SELECT
                COUNT(DISTINCT user_pseudo_id) AS totalUsers,

                COUNT(*) AS totalEvents,

                COUNT(
                    DISTINCT CASE
                        WHEN event_name = 'purchase'
                        THEN user_pseudo_id
                    END
                ) AS purchasers,

                SUM(
                    CASE
                        WHEN event_name = 'purchase'
                        THEN ecommerce.purchase_revenue_in_usd
                        ELSE 0
                    END
                ) AS revenue

            FROM
                \`bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*\`
        `;

        const [rows] = await bigquery.query({
            query,
            location: "US",
        });

        const data = rows[0];

        res.status(200).json({
            success: true,

            data: {
                totalUsers: Number(data.totalUsers || 0),

                totalEvents: Number(data.totalEvents || 0),

                purchasers: Number(data.purchasers || 0),

                revenue: Number(data.revenue || 0),
            },
        });

    } catch (error) {
        console.error(
            "Dashboard stats error:",
            error
        );

        next(error);
    }
};

// =========================
// DASHBOARD ANALYTICS
// =========================

const getDashboardAnalytics = async (req, res, next) => {
    try {

        // Get requested number of days
        let days = Number(req.query.days) || 30;

        // Only allow 7, 30 or 90
        if (![7, 30, 90].includes(days)) {
            days = 30;
        }

        console.log(
            `Fetching analytics for last ${days} days`
        );

        const query = `
            WITH latest_date AS (

                SELECT
                    MAX(
                        PARSE_DATE(
                            '%Y%m%d',
                            event_date
                        )
                    ) AS max_date

                FROM
                    \`bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*\`
            )

            SELECT

                FORMAT_DATE(
                    '%Y-%m-%d',
                    PARSE_DATE(
                        '%Y%m%d',
                        event_date
                    )
                ) AS date,

                COUNT(
                    DISTINCT user_pseudo_id
                ) AS users,

                COUNT(*) AS events

            FROM
                \`bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*\`,

                latest_date

            WHERE

                PARSE_DATE(
                    '%Y%m%d',
                    event_date
                ) >= DATE_SUB(
                    latest_date.max_date,
                    INTERVAL ${days} DAY
                )

            GROUP BY
                date

            ORDER BY
                date ASC
        `;

        const [rows] = await bigquery.query({
            query,
            location: "US",
        });

        const analytics = rows.map((row) => ({
            date: row.date,

            users: Number(row.users || 0),

            events: Number(row.events || 0),
        }));

        console.log(
            `Analytics records returned: ${analytics.length}`
        );

        res.status(200).json({
            success: true,
            data: analytics,
        });

    } catch (error) {

        console.error(
            "Dashboard analytics error:",
            error
        );

        next(error);
    }
};

// =========================
// EXPORT
// =========================

module.exports = {
    getDashboardStats,
    getDashboardAnalytics,
};