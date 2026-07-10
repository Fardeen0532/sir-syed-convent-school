const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./app/routes/auth');
const publicRoutes = require('./app/routes/public');
const adminRoutes = require('./app/routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

console.log(`[boot] Environment: ${NODE_ENV}`);

// ─── Security Middlewares ────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      frameSrc: ["'self'", "https://www.google.com"],
      connectSrc: ["'self'"],
    }
  } : false, // Disable CSP in dev for hot-reload compatibility
}));

// CORS: In production the frontend is served from the same origin,
// so we restrict to same-origin only. In dev, allow the Vite dev server.
if (isProduction) {
  app.use(cors({ origin: false }));
} else {
  app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Rate Limiting (protect public form endpoints) ───────────────────
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                   // 50 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many submissions from this IP. Please try again after 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,                   // 20 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' }
});

// ─── Serve uploaded files statically ─────────────────────────────────
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir, {
  maxAge: isProduction ? '7d' : 0, // Cache uploads for 7 days in production
}));

// ─── API Routes ──────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Apply form rate limiter to public submission endpoints
app.post('/api/admission', formLimiter);
app.post('/api/enquiry', formLimiter);
app.use('/api', publicRoutes);

// ─── Production: Serve React Frontend ────────────────────────────────
const frontendDistPath = path.resolve(__dirname, '..', 'frontend', 'dist');

if (isProduction) {
  // Verify frontend build exists
  if (!fs.existsSync(frontendDistPath)) {
    console.error('[ERROR] Frontend build not found at:', frontendDistPath);
    console.error('[ERROR] Run "npm run build" in the frontend directory first.');
    process.exit(1);
  }

  // Serve all static assets from the React build with aggressive caching
  app.use(express.static(frontendDistPath, {
    maxAge: '30d',
    immutable: true,
    index: false, // Don't auto-serve index.html for root, we handle SPA fallback below
  }));

  // SPA fallback: any non-API, non-upload, non-static-asset request gets index.html
  // This enables React Router to handle client-side routing (e.g. /about, /admin/dashboard)
  app.get('*', (req, res) => {
    // Skip API and upload routes (already handled above)
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }

    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });

  console.log('[boot] Serving production frontend from:', frontendDistPath);
} else {
  // Dev mode: simple root response (frontend is served by Vite dev server)
  app.get('/', (req, res) => {
    res.json({
      message: 'Sir Syed Convent School API (development mode)',
      hint: 'Run the Vite dev server on port 5173 for the frontend.'
    });
  });
}

// ─── Centralized Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  // Handle multer file size / type errors gracefully
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File too large. Maximum upload size is 5MB.' });
  }
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(415).json({ message: err.message });
  }

  console.error('API Error:', err.message);
  res.status(err.status || 500).json({
    message: isProduction ? 'Internal Server Error' : err.message || 'Internal Server Error'
  });
});

// ─── Start Server ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[boot] Server listening on http://localhost:${PORT}`);
  if (isProduction) {
    console.log(`[boot] Open http://localhost:${PORT} in your browser to view the website.`);
  }
});