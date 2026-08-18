const bigquery = require("./config/bigquery");

async function testBigQuery() {
    try {
        const query = `
            SELECT
                COUNT(DISTINCT user_pseudo_id) AS total_users
            FROM
                \`bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*\`
        `;

        const [rows] = await bigquery.query({
            query: query,
            location: "US"
        });

        console.log("=================================");
        console.log("BigQuery connected successfully");
        console.log("Total users:", rows[0].total_users);
        console.log("=================================");

    } catch (error) {
        console.error("BigQuery connection failed:");
        console.error(error.message);
    }
}

testBigQuery();