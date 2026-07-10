const path = require('path');
const sqlite3 = require(path.resolve(__dirname, '../backend/node_modules/sqlite3')).verbose();

const dbPath = path.join(__dirname, 'school.sqlite');

console.log('Connecting to database for year update at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

db.serialize(() => {
  db.get('SELECT content FROM pages WHERE slug = ?', ['about'], (err, row) => {
    if (err) {
      console.error('Error fetching about page:', err);
      return;
    }
    if (row) {
      try {
        const content = JSON.parse(row.content);
        
        // Update history year
        if (content.history) {
          content.history = content.history.replace('2012', '2017');
        }

        const updatedContent = JSON.stringify(content);
        db.run(
          'UPDATE pages SET content = ? WHERE slug = ?',
          [updatedContent, 'about'],
          function(err) {
            if (err) console.error('Error updating about page content:', err);
            else console.log('About page content year updated successfully.');
          }
        );
      } catch (parseErr) {
        console.error('Error parsing about page content JSON:', parseErr);
      }
    } else {
      console.log('About page not found in database.');
    }
  });
});

// Close database connection
setTimeout(() => {
  db.close((err) => {
    if (err) console.error('Error closing database:', err);
    else console.log('Database connection closed successfully.');
  });
}, 2000);
