const { BigQuery } = require("@google-cloud/bigquery");
const path = require("path");

const keyFilename = path.join(
    __dirname,
    "..",
    "credentials",
    "google-credentials.json"
);

const bigquery = new BigQuery({
    projectId: "insight-dashboard-505815",
    keyFilename: keyFilename
});

module.exports = bigquery;