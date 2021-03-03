module.exports = {
        ServerPort: process.env["PORT"] || 2345,
        DatabaseUrl: process.env["DATABASE_URL"] || 'mongodb://localhost:27017/lab5db',
        cloud_name: process.env["CLOUD_NAME"] || 'sch2hpcloud',
        api_secret: process.env["API_SECRET"] || 'TF7fAN1kXTxJd9qHNDRrhIkbUt8',
        api_key: process.env["API_KEY"] || '374631992754542',
};
