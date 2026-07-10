-- Database schema for Sir Syed Convent School

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'staff')) NOT NULL DEFAULT 'staff',
  status INTEGER CHECK(status IN (0, 1)) NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pages Table (Dynamic CMS pages like home, about, academics)
CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL, -- JSON string storing dynamic page sections/data
  updated_by INTEGER,
  FOREIGN KEY(updated_by) REFERENCES users(id)
);

-- Notices Table
CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  attachment TEXT, -- Filename or path of download file
  publish_date DATE NOT NULL DEFAULT (date('now')),
  status INTEGER CHECK(status IN (0, 1)) NOT NULL DEFAULT 1
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT CHECK(category IN ('Campus', 'Events', 'Sports', 'Activities')) NOT NULL,
  uploaded_by INTEGER,
  FOREIGN KEY(uploaded_by) REFERENCES users(id)
);

-- Admissions Table
CREATE TABLE IF NOT EXISTS admissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_name TEXT NOT NULL,
  class_applied TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  documents TEXT NOT NULL, -- JSON object: {"birth_certificate": "path", "marksheet": "path"}
  status TEXT CHECK(status IN ('pending', 'approved', 'rejected', 'contacted')) NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SEO Settings Table
CREATE TABLE IF NOT EXISTS seo_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL, -- e.g., 'home', 'about', 'academics', etc.
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  keywords TEXT NOT NULL
);
