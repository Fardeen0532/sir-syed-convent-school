const express = require('express');
const router = express.Router();
const { dbAll, dbGet, dbRun } = require('../models/db_helper');
const upload = require('../middleware/upload');

// Helper to fetch page and its SEO settings combined
async function getPageWithSeo(slug) {
  const page = await dbGet('SELECT * FROM pages WHERE slug = ?', [slug]);
  const seo = await dbGet('SELECT meta_title, meta_description, keywords FROM seo_settings WHERE slug = ?', [slug]);
  return {
    content: page ? JSON.parse(page.content) : null,
    title: page ? page.title : '',
    seo: seo || { meta_title: '', meta_description: '', keywords: '' }
  };
}

/**
 * @route GET /api/home
 */
router.get('/home', async (req, res) => {
  try {
    const pageData = await getPageWithSeo('home');
    const latestNotices = await dbAll('SELECT * FROM notices WHERE status = 1 ORDER BY publish_date DESC LIMIT 3');
    const galleryPreview = await dbAll('SELECT * FROM gallery ORDER BY id DESC LIMIT 4');
    
    res.json({
      ...pageData,
      latestNotices,
      galleryPreview
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving homepage data' });
  }
});

/**
 * @route GET /api/about
 */
router.get('/about', async (req, res) => {
  try {
    const pageData = await getPageWithSeo('about');
    res.json(pageData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving about page data' });
  }
});

/**
 * @route GET /api/academics
 */
router.get('/academics', async (req, res) => {
  try {
    const pageData = await getPageWithSeo('academics');
    res.json(pageData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving academics page data' });
  }
});

/**
 * @route GET /api/admissions
 */
router.get('/admissions', async (req, res) => {
  try {
    const pageData = await getPageWithSeo('admissions');
    res.json(pageData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving admissions page data' });
  }
});

/**
 * @route GET /api/notices
 */
router.get('/notices', async (req, res) => {
  try {
    const notices = await dbAll('SELECT * FROM notices WHERE status = 1 ORDER BY publish_date DESC');
    const seo = await dbGet('SELECT meta_title, meta_description, keywords FROM seo_settings WHERE slug = ?', ['notices']);
    res.json({
      notices,
      seo: seo || { meta_title: 'Notice Board', meta_description: '', keywords: '' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving notices' });
  }
});

/**
 * @route GET /api/gallery
 */
router.get('/gallery', async (req, res) => {
  try {
    const images = await dbAll('SELECT * FROM gallery ORDER BY id DESC');
    const seo = await dbGet('SELECT meta_title, meta_description, keywords FROM seo_settings WHERE slug = ?', ['gallery']);
    res.json({
      images,
      seo: seo || { meta_title: 'Gallery', meta_description: '', keywords: '' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving gallery' });
  }
});

/**
 * @route GET /api/contact
 */
router.get('/contact', async (req, res) => {
  try {
    const seo = await dbGet('SELECT meta_title, meta_description, keywords FROM seo_settings WHERE slug = ?', ['contact']);
    res.json({
      seo: seo || { meta_title: 'Contact Us', meta_description: '', keywords: '' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving contact SEO' });
  }
});

/**
 * @route POST /api/admission
 * @desc Parents apply online with files (birth_certificate, marksheet)
 */
router.post(
  '/admission',
  upload.fields([
    { name: 'birth_certificate', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 }
  ]),
  async (req, res) => {
    const { student_name, class_applied, parent_name, phone, email } = req.body;

    if (!student_name || !class_applied || !parent_name || !phone || !email) {
      return res.status(400).json({ message: 'Please fill in all required parent and student fields.' });
    }

    try {
      // Map document filenames to database paths
      const documents = {};
      if (req.files) {
        if (req.files.birth_certificate && req.files.birth_certificate[0]) {
          documents.birth_certificate = `/uploads/${req.files.birth_certificate[0].filename}`;
        }
        if (req.files.marksheet && req.files.marksheet[0]) {
          documents.marksheet = `/uploads/${req.files.marksheet[0].filename}`;
        }
      }

      const result = await dbRun(
        `INSERT INTO admissions (student_name, class_applied, parent_name, phone, email, documents, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          student_name,
          class_applied,
          parent_name,
          phone,
          email,
          JSON.stringify(documents),
          'pending'
        ]
      );

      res.status(201).json({
        message: 'Your admission application has been submitted successfully! The admin team has been notified.',
        applicationId: result.lastID
      });
    } catch (err) {
      console.error('Admission submit error:', err);
      res.status(500).json({ message: 'Failed to process admission application. Please try again.' });
    }
  }
);

/**
 * @route POST /api/enquiry
 * @desc General visitors submit contact/enquiry forms
 */
router.post('/enquiry', async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all enquiry fields.' });
  }

  try {
    const result = await dbRun(
      'INSERT INTO enquiries (name, phone, email, message) VALUES (?, ?, ?, ?)',
      [name, phone, email, message]
    );

    res.status(201).json({
      message: 'Enquiry submitted successfully. We will get back to you shortly!',
      enquiryId: result.lastID
    });
  } catch (err) {
    console.error('Enquiry submit error:', err);
    res.status(500).json({ message: 'Failed to save enquiry.' });
  }
});

module.exports = router;
