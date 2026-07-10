const path = require('path');
const sqlite3 = require(path.resolve(__dirname, '../backend/node_modules/sqlite3')).verbose();

const dbPath = path.join(__dirname, 'school.sqlite');

console.log('Connecting to database for management update at:', dbPath);

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
        
        // Update management committee list to only have Faizan khan
        content.management = [
          { name: 'Faizan khan', role: 'Chairman' }
        ];

        const updatedContent = JSON.stringify(content);
        db.run(
          'UPDATE pages SET content = ? WHERE slug = ?',
          [updatedContent, 'about'],
          function(err) {
            if (err) console.error('Error updating about page content:', err);
            else console.log('About page committee updated to only contain Faizan khan.');
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
