const express = require('express');
const router = express.Router();
const { dbAll, dbGet, dbRun } = require('../models/db_helper');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const bcrypt = require("bcrypt");
const fs = require('fs');

// Apply auth token validation to all admin endpoints
router.use(authenticateToken);

/**
 * @route GET /api/admin/dashboard
 * @desc Get card summaries (KPIs) and recent updates
 */
router.get('/dashboard', async (req, res) => {
  try {
    const totalAdmissions = await dbGet('SELECT COUNT(*) as count FROM admissions');
    const totalEnquiries = await dbGet('SELECT COUNT(*) as count FROM enquiries');
    const totalNotices = await dbGet('SELECT COUNT(*) as count FROM notices');
    const totalGallery = await dbGet('SELECT COUNT(*) as count FROM gallery');

    const recentAdmissions = await dbAll('SELECT * FROM admissions ORDER BY id DESC LIMIT 5');
    const recentEnquiries = await dbAll('SELECT * FROM enquiries ORDER BY id DESC LIMIT 5');
    const recentNotices = await dbAll('SELECT * FROM notices ORDER BY id DESC LIMIT 5');

    res.json({
      summary: {
        admissions: totalAdmissions ? totalAdmissions.count : 0,
        enquiries: totalEnquiries ? totalEnquiries.count : 0,
        notices: totalNotices ? totalNotices.count : 0,
        gallery: totalGallery ? totalGallery.count : 0
      },
      recent: {
        admissions: recentAdmissions,
        enquiries: recentEnquiries,
        notices: recentNotices
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Dashboard stats fetch failed' });
  }
});

/**
 * @route GET /api/admin/admissions
 * @desc Fetch all admissions with search/filters
 */
router.get('/admissions', async (req, res) => {
  const { search, status } = req.query;
  let query = 'SELECT * FROM admissions WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (student_name LIKE ? OR parent_name LIKE ? OR phone LIKE ? OR email LIKE ?)';
    const searchVal = `%${search}%`;
    params.push(searchVal, searchVal, searchVal, searchVal);
  }

  query += ' ORDER BY id DESC';

  try {
    const data = await dbAll(query, params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Admissions fetch failed' });
  }
});

/**
 * @route GET /api/admin/admissions/export
 * @desc Export admissions database to CSV format
 */
router.get('/admissions/export', async (req, res) => {
  try {
    const data = await dbAll('SELECT * FROM admissions ORDER BY id DESC');
    
    // Build CSV manually
    let csv = 'Application ID,Student Name,Class Applied,Parent Name,Phone,Email,Status,Submission Date\n';
    
    for (const app of data) {
      const escapedStudent = (app.student_name || '').replace(/"/g, '""');
      const escapedClass = (app.class_applied || '').replace(/"/g, '""');
      const escapedParent = (app.parent_name || '').replace(/"/g, '""');
      const escapedPhone = (app.phone || '').replace(/"/g, '""');
      const escapedEmail = (app.email || '').replace(/"/g, '""');
      csv += `${app.id},"${escapedStudent}","${escapedClass}","${escapedParent}","${escapedPhone}","${escapedEmail}","${app.status}","${app.created_at}"\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=admissions_report.csv');
    res.status(200).send(csv);
  } catch (err) {
    console.error('CSV Export failure:', err);
    res.status(500).json({ message: 'Failed to build CSV file' });
  }
});

/**
 * @route PUT /api/admin/admissions/:id
 * @desc Update status of admission application
 */
router.put('/admissions/:id', async (req, res) => {
  const { status } = req.body;
  if (!status || !['pending', 'approved', 'rejected', 'contacted'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const result = await dbRun('UPDATE admissions SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Admission status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
});

/**
 * @route GET /api/admin/enquiries
 */
router.get('/enquiries', async (req, res) => {
  try {
    const data = await dbAll('SELECT * FROM enquiries ORDER BY id DESC');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Enquiries fetch failed' });
  }
});

/**
 * @route DELETE /api/admin/enquiries/:id
 */
router.delete('/enquiries/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM enquiries WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Enquiry deletion failed' });
  }
});

/**
 * @route POST /api/admin/notices
 * @desc Post new notice with attachment handling
 */
router.post('/notices', upload.single('attachment'), async (req, res) => {
  const { title, description, status } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await dbRun(
      'INSERT INTO notices (title, description, attachment, status) VALUES (?, ?, ?, ?)',
      [title, description, fileUrl, status === 'true' || status === '1' || status === 1 ? 1 : 0]
    );

    res.status(201).json({ message: 'Notice posted successfully', noticeId: result.lastID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Notice creation failed' });
  }
});

/**
 * @route PUT /api/admin/notices/:id
 */
router.put('/notices/:id', upload.single('attachment'), async (req, res) => {
  const { title, description, status } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    let query = 'UPDATE notices SET title = ?, description = ?, status = ?';
    const params = [title, description, status === 'true' || status === '1' || status === 1 ? 1 : 0];

    if (req.file) {
      // Fetch old notice to delete attachment if exists
      const oldNotice = await dbGet('SELECT attachment FROM notices WHERE id = ?', [req.params.id]);
      if (oldNotice && oldNotice.attachment) {
        const oldPath = path.resolve(__dirname, '..', '..', oldNotice.attachment.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      query += ', attachment = ?';
      params.push(`/uploads/${req.file.filename}`);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    const result = await dbRun(query, params);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json({ message: 'Notice updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Notice update failed' });
  }
});

/**
 * @route DELETE /api/admin/notices/:id
 */
router.delete('/notices/:id', async (req, res) => {
  try {
    const notice = await dbGet('SELECT attachment FROM notices WHERE id = ?', [req.params.id]);
    if (notice && notice.attachment) {
      const filepath = path.resolve(__dirname, '..', '..', notice.attachment.replace(/^\//, ''));
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    const result = await dbRun('DELETE FROM notices WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Notice deletion failed' });
  }
});

/**
 * @route POST /api/admin/gallery
 * @desc Upload picture to gallery
 */
router.post('/gallery', upload.single('image'), async (req, res) => {
  const { title, category } = req.body;
  if (!title || !category || !req.file) {
    return res.status(400).json({ message: 'Title, category, and image file are required' });
  }

  if (!['Campus', 'Events', 'Sports', 'Activities'].includes(category)) {
    return res.status(400).json({ message: 'Invalid gallery category' });
  }

  try {
    const fileUrl = `/uploads/${req.file.filename}`;
    const result = await dbRun(
      'INSERT INTO gallery (title, image_url, category, uploaded_by) VALUES (?, ?, ?, ?)',
      [title, fileUrl, category, req.user.id]
    );

    res.status(201).json({ message: 'Image uploaded successfully', imageId: result.lastID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gallery upload failed' });
  }
});

/**
 * @route DELETE /api/admin/gallery/:id
 */
router.delete('/gallery/:id', async (req, res) => {
  try {
    const image = await dbGet('SELECT image_url FROM gallery WHERE id = ?', [req.params.id]);
    if (image && image.image_url) {
      const filepath = path.resolve(__dirname, '..', '..', image.image_url.replace(/^\//, ''));
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    const result = await dbRun('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Image deletion failed' });
  }
});

/**
 * @route POST /api/admin/pages
 * @desc Update page content (CMS editor)
 */
router.post('/pages', async (req, res) => {
  const { slug, content, title } = req.body;
  if (!slug || !content) {
    return res.status(400).json({ message: 'Slug and content JSON are required' });
  }

  try {
    // Check if page exists
    const page = await dbGet('SELECT id FROM pages WHERE slug = ?', [slug]);
    
    // Validate JSON structure
    let contentStr = '';
    if (typeof content === 'string') {
      JSON.parse(content); // Validate JSON format
      contentStr = content;
    } else {
      contentStr = JSON.stringify(content);
    }

    if (page) {
      await dbRun(
        'UPDATE pages SET content = ?, title = ?, updated_by = ? WHERE slug = ?',
        [contentStr, title || 'Dynamic Page', req.user.id, slug]
      );
      res.json({ message: `Page '${slug}' updated successfully` });
    } else {
      await dbRun(
        'INSERT INTO pages (title, slug, content, updated_by) VALUES (?, ?, ?, ?)',
        [title || 'Dynamic Page', slug, contentStr, req.user.id]
      );
      res.status(201).json({ message: `Page '${slug}' created successfully` });
    }
  } catch (err) {
    console.error('CMS update failure:', err);
    res.status(500).json({ message: 'Failed to save page contents (JSON format error or DB failure)' });
  }
});

/**
 * @route GET /api/admin/settings
 * @desc Fetch general SEO configurations
 */
router.get('/settings', async (req, res) => {
  try {
    const seo = await dbAll('SELECT * FROM seo_settings');
    res.json({ seo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Settings fetch failed' });
  }
});

/**
 * @route POST /api/admin/settings
 * @desc Save page SEO settings
 */
router.post('/settings', async (req, res) => {
  const { slug, meta_title, meta_description, keywords } = req.body;
  if (!slug || !meta_title || !meta_description) {
    return res.status(400).json({ message: 'Slug, Meta Title and Meta Description are required' });
  }

  try {
    const seo = await dbGet('SELECT id FROM seo_settings WHERE slug = ?', [slug]);
    if (seo) {
      await dbRun(
        'UPDATE seo_settings SET meta_title = ?, meta_description = ?, keywords = ? WHERE slug = ?',
        [meta_title, meta_description, keywords || '', slug]
      );
      res.json({ message: `SEO settings for '${slug}' updated` });
    } else {
      await dbRun(
        'INSERT INTO seo_settings (slug, meta_title, meta_description, keywords) VALUES (?, ?, ?, ?)',
        [slug, meta_title, meta_description, keywords || '']
      );
      res.status(201).json({ message: `SEO settings for '${slug}' created` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'SEO settings save failed' });
  }
});

/**
 * @route GET /api/admin/users
 * @desc Fetch administrative user list
 */
router.get('/users', requireRole(['admin']), async (req, res) => {
  try {
    const data = await dbAll('SELECT id, name, email, role, status, created_at FROM users');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Users fetch failed' });
  }
});

/**
 * @route POST /api/admin/users
 * @desc Add new administrator or staff account
 */
router.post('/users', requireRole(['admin']), async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill in all user profile details' });
  }

  try {
    // Check if email already exists
    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ message: 'Email address already registered' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, 1)',
      [name, email, hashed, role]
    );

    res.status(201).json({ message: `Account for '${name}' created successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'User registration failed' });
  }
});

/**
 * @route DELETE /api/admin/users/:id
 * @desc Delete a user account (prevents deleting the primary admin with id=1)
 */
router.delete('/users/:id', requireRole(['admin']), async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  // Prevent deletion of the primary admin account (id=1)
  if (userId === 1) {
    return res.status(403).json({ message: 'Cannot delete the primary administrator account.' });
  }

  // Prevent user from deleting themselves
  if (userId === req.user.id) {
    return res.status(403).json({ message: 'You cannot delete your own account.' });
  }

  try {
    const result = await dbRun('DELETE FROM users WHERE id = ?', [userId]);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User account deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'User deletion failed.' });
  }
});

module.exports = router;
