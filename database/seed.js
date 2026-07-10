const path = require('path');
const fs = require('fs');
const sqlite3 = require(path.resolve(__dirname, '../backend/node_modules/sqlite3')).verbose();
const bcrypt = require(path.resolve(__dirname, '../backend/node_modules/bcryptjs'));

const dbPath = path.join(__dirname, 'school.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');

console.log('Initializing database at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');

db.serialize(() => {
  // Split schema file by semicolon to run statements
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    db.run(statement, (err) => {
      if (err) {
        console.error('Error executing statement:', statement);
        console.error(err);
        process.exit(1);
      }
    });
  }

  console.log('Tables created successfully.');

  // Seed default admin user
  const adminEmail = 'admin@sirsyedconvent.com';
  db.get('SELECT * FROM users WHERE email = ?', [adminEmail], (err, row) => {
    if (err) {
      console.error(err);
      return;
    }
    if (!row) {
      const passwordHash = bcrypt.hashSync('Admin123!', 10);
      db.run(
        'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
        ['Administrator', adminEmail, passwordHash, 'admin', 1],
        function(err) {
          if (err) console.error('Error seeding admin user:', err);
          else console.log('Admin user seeded successfully with ID:', this.lastID);
        }
      );
    } else {
      console.log('Admin user already exists.');
    }
  });

  // Seed default pages
  const defaultPages = [
    {
      title: 'Home Page',
      slug: 'home',
      content: JSON.stringify({
        hero: {
          title: 'Sir Syed Convent School',
          subtitle: 'Empowering Minds, Shaping Futures',
          cta_text: 'Admissions Open 2026-27',
          cta_link: '/admissions'
        },
        welcome: {
          title: 'Welcome to Sir Syed Convent School',
          body: 'Sir Syed Convent School is dedicated to fostering academic excellence, character development, and a lifelong passion for learning. Our curriculum is designed to prepare students for challenges of the modern world while keeping them rooted in core moral values.'
        },
        chairman_message: {
          name: 'Faizan khan',
          role: 'Chairman',
          message: 'Education is the ultimate tool for social and intellectual empowerment. At Sir Syed Convent School, we strive to build an inclusive and inspiring environment where every child has the opportunity to achieve their fullest potential.',
          image: '/assets/chairman.jpg'
        },
        principal_message: {
          name: 'vinay kumar',
          role: 'Principal',
          message: 'It is a privilege to lead Sir Syed Convent School, where academic success goes hand-in-hand with emotional growth. We believe in learning by doing, promoting critical thinking, and guiding students to be responsible global citizens.',
          image: '/assets/principal.jpg'
        },
        why_choose_us: [
          { title: 'AMU Graduates Faculty', description: 'Our core teaching staff consists of distinguished graduates from Aligarh Muslim University (AMU), ensuring top-tier academic guidance.' },
          { title: 'AC & Smart Classrooms', description: 'Comfortable, temperature-controlled classrooms equipped with digital smart boards to facilitate interactive learning.' },
          { title: 'Excellent Transport Network', description: 'Safe and secure school bus service covering Pahasu, Shikarpur, Khurja, and surrounding regions.' },
          { title: 'Modern Labs & Library', description: 'State-of-the-art computer and science labs alongside a library stocked with thousands of reference books.' }
        ]
      })
    },
    {
      title: 'About Us',
      slug: 'about',
      content: JSON.stringify({
        overview: 'Sir Syed Convent School, located in Pahasu (Bulandshahr), is a premier educational institution established with the vision of providing high-quality modern education to students in the region.',
        vision: 'To be a beacon of educational excellence that nurtures curiosity, integrity, and social responsibility in young minds.',
        mission: 'To deliver an inclusive, child-centered curriculum, integrate modern technology with traditional values, and prepare students to excel in higher education and life.',
        history: 'Founded in 2017 by a group of visionaries, the school was named in honor of Sir Syed Ahmad Khan, the pioneer of modern education in India. Starting with just 50 students, we have grown to become a leading secondary school in the district.',
        management: [
          { name: 'Faizan khan', role: 'Chairman' }
        ]
      })
    },
    {
      title: 'Academics',
      slug: 'academics',
      content: JSON.stringify({
        curriculum: 'We follow the CBSE (Central Board of Secondary Education) pattern, focusing on holistic development. The medium of instruction is English, with Hindi and Urdu offered as secondary languages.',
        subjects: [
          { stage: 'Primary (Classes I - V)', list: 'English, Hindi, Mathematics, Environmental Studies, Urdu, Computer Science, General Knowledge, Arts & Crafts' },
          { stage: 'Middle School (Classes VI - VIII)', list: 'English, Hindi, Mathematics, Science (Physics, Chemistry, Biology), Social Science, Urdu, Computer Application' },
          { stage: 'Secondary (Classes IX - X)', list: 'English Communicative, Mathematics, Science, Social Science, Hindi Course-A / Urdu Course-A, Information Technology' }
        ],
        examinations: 'Evaluation is based on continuous assessment, comprising Periodic Tests, Mid-Term Examinations, and Final Board Exams as per CBSE guidelines. Report cards include descriptive grades for both scholastic and co-scholastic domains.',
        timings: {
          summer: '07:30 AM - 01:30 PM',
          winter: '08:15 AM - 02:15 PM'
        }
      })
    },
    {
      title: 'Facilities',
      slug: 'facilities',
      content: JSON.stringify({
        list: [
          { name: 'Smart Classrooms', desc: 'Equipped with digital projectors and audio-visual setups for immersive learning.' },
          { name: 'AC Classrooms', desc: 'Air-conditioned rooms to maintain a comfortable study environment during peak summer.' },
          { name: 'Library', desc: 'A rich repository of books, encyclopedias, journals, and digital reading resources.' },
          { name: 'Computer Lab', desc: 'Equipped with 30+ high-speed modern computers with internet connectivity.' },
          { name: 'Science Labs', desc: 'Separate, well-stocked Physics, Chemistry, and Biology laboratory setups for practical training.' },
          { name: 'Sports Ground', desc: 'Spacious playground with facilities for football, cricket, volleyball, and athletics.' },
          { name: 'Transport System', desc: 'A fleet of GPS-enabled buses with verified drivers and conductors covering major routes.' }
        ]
      })
    }
  ];

  for (const page of defaultPages) {
    db.get('SELECT * FROM pages WHERE slug = ?', [page.slug], (err, row) => {
      if (err) console.error(err);
      if (!row) {
        db.run(
          'INSERT INTO pages (title, slug, content, updated_by) VALUES (?, ?, ?, ?)',
          [page.title, page.slug, page.content, 1],
          (err) => {
            if (err) console.error(`Error seeding page ${page.slug}:`, err);
            else console.log(`Page '${page.slug}' seeded successfully.`);
          }
        );
      } else {
        console.log(`Page '${page.slug}' already exists.`);
      }
    });
  }

  // Seed default SEO settings
  const defaultSeo = [
    { slug: 'home', title: 'Sir Syed Convent School - Pahasu, Bulandshahr', desc: 'Welcome to Sir Syed Convent School, Pahasu. We provide top-class academic excellence, smart classrooms, AMU graduate faculty, and secure transport in Bulandshahr, Khurja, and Dibai.', keywords: 'sir syed convent school, pahasu school, bulandshahr best school, khurja school, amu graduates school' },
    { slug: 'about', title: 'About Us | Sir Syed Convent School Pahasu', desc: 'Read about the overview, vision, mission, and management committee of Sir Syed Convent School, Bulandshahr.', keywords: 'about sir syed convent, school vision, school history, management committee' },
    { slug: 'academics', title: 'Academics & Curriculum | Sir Syed Convent School', desc: 'Explore CBSE curriculum, subjects offered, examination patterns, and timings at Sir Syed Convent School.', keywords: 'cbse curriculum, school subjects, exam pattern, school timing' },
    { slug: 'admissions', title: 'Online Admission | Sir Syed Convent School Pahasu', desc: 'Information on the admission process, eligibility criteria, required documents, and online application forms.', keywords: 'school admission, online admission form, admission criteria, admissions pahasu' },
    { slug: 'facilities', title: 'Campus Facilities | Sir Syed Convent School', desc: 'Discover our smart AC classrooms, science labs, computer lab, library, sports facilities, and transport services.', keywords: 'smart classes, school transport pahasu, computer lab, school library' },
    { slug: 'faculty', title: 'Our Faculty | Sir Syed Convent School Pahasu', desc: 'Meet our qualified and dedicated educators, including distinguished Aligarh Muslim University (AMU) graduates.', keywords: 'school faculty, teachers pahasu, amu graduate teachers' },
    { slug: 'gallery', title: 'School Gallery | Sir Syed Convent School', desc: 'Browse photos of our campus, annual events, sports meets, and co-curricular activities.', keywords: 'school gallery, campus photos, sports event gallery' },
    { slug: 'notices', title: 'Notice Board | Sir Syed Convent School Pahasu', desc: 'Stay updated with the latest circulars, notice boards, exam schedules, and downloads.', keywords: 'school notices, latest updates, download circulars' },
    { slug: 'contact', title: 'Contact Us | Sir Syed Convent School Pahasu', desc: 'Contact Sir Syed Convent School, Pahasu (Bulandshahr) via phone, email, contact form, or find us on Google Maps.', keywords: 'contact school, school phone number, school address, school map location' }
  ];

  for (const seo of defaultSeo) {
    db.get('SELECT * FROM seo_settings WHERE slug = ?', [seo.slug], (err, row) => {
      if (err) console.error(err);
      if (!row) {
        db.run(
          'INSERT INTO seo_settings (slug, meta_title, meta_description, keywords) VALUES (?, ?, ?, ?)',
          [seo.slug, seo.title, seo.desc, seo.keywords],
          (err) => {
            if (err) console.error(`Error seeding SEO for ${seo.slug}:`, err);
            else console.log(`SEO settings for '${seo.slug}' seeded successfully.`);
          }
        );
      } else {
        console.log(`SEO settings for '${seo.slug}' already exists.`);
      }
    });
  }

  // Seed sample notices
  const sampleNotices = [
    { title: 'Summer Vacation Circular 2026', description: 'The school will remain closed for summer holidays from June 1st to June 30th, 2026. Online homework tasks have been uploaded in the downloads section. Wish you all a happy holiday!', status: 1 },
    { title: 'Admissions Open for Session 2026-27', description: 'Admissions are open from Nursery to Class X. Parents can submit application forms online or collect physical copies from the administration desk. Limited seats available in classes VI to VIII.', status: 1 }
  ];

  db.get('SELECT COUNT(*) as count FROM notices', (err, row) => {
    if (err) console.error(err);
    if (row && row.count === 0) {
      for (const notice of sampleNotices) {
        db.run(
          'INSERT INTO notices (title, description, status) VALUES (?, ?, ?)',
          [notice.title, notice.description, notice.status],
          (err) => {
            if (err) console.error('Error seeding notice:', err);
            else console.log('Sample notice seeded.');
          }
        );
      }
    }
  });

  // Seed sample gallery images
  const sampleImages = [
    { title: 'Main Campus Building', url: '/assets/campus1.jpg', cat: 'Campus' },
    { title: 'Annual Science Exhibition', url: '/assets/science_exhibition.jpg', cat: 'Events' },
    { title: 'Inter-School Sports Meet', url: '/assets/sports_meet.jpg', cat: 'Sports' },
    { title: 'Smart Class Interactive Session', url: '/assets/smart_classroom.jpg', cat: 'Activities' }
  ];

  db.get('SELECT COUNT(*) as count FROM gallery', (err, row) => {
    if (err) console.error(err);
    if (row && row.count === 0) {
      for (const img of sampleImages) {
        db.run(
          'INSERT INTO gallery (title, image_url, category, uploaded_by) VALUES (?, ?, ?, ?)',
          [img.title, img.url, img.cat, 1],
          (err) => {
            if (err) console.error('Error seeding gallery image:', err);
            else console.log('Sample gallery image seeded.');
          }
        );
      }
    }
  });
});

// Close connection after a short delay to allow queries to finish
setTimeout(() => {
  db.close((err) => {
    if (err) console.error('Error closing database:', err);
    else console.log('Database connection closed.');
  });
}, 2000);
