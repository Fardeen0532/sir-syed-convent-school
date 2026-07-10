const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '..', '..', '..', 'database', 'school.sqlite');

console.log('Connecting to database at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Successfully connected to SQLite database.');
  }
});

module.exports = db;
