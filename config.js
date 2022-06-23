exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.DB_URL || 'postgresql://localhost:5433/test';
exports.secret = process.env.JWT_SECRET || 'BURGUERA12022LABORATORIA';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admiDefault@gmail.com';
exports.access_token_life_in_seconds = 10080; // 7 dias
exports.adminPassword = process.env.ADMIN_PASSWORD || '123456789';
