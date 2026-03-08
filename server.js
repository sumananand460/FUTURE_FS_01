/**
 * ─────────────────────────────────────────────────────────────
 *  server.js  —  Suman Anand Portfolio Backend
 *  Node.js + Express + Nodemailer (Gmail SMTP)
 * ─────────────────────────────────────────────────────────────
 */

const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');
const path       = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Rate-limit (simple in-memory: max 5 submissions / IP / 10 min) ──────────
const rateMap = new Map();
function rateLimit(req, res, next) {
  const ip     = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now    = Date.now();
  const window = 10 * 60 * 1000;
  const max    = 5;
  if (!rateMap.has(ip)) rateMap.set(ip, []);
  const hits = rateMap.get(ip).filter(t => now - t < window);
  hits.push(now);
  rateMap.set(ip, hits);
  if (hits.length > max) return res.status(429).json({ error: 'Too many requests. Please wait a few minutes.' });
  next();
}

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ── Helpers ──────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// ── Contact API ──────────────────────────────────────────────────────────────
app.post('/api/contact', rateLimit, async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message)
    return res.status(400).json({ error: 'All fields are required.' });
  if (name.trim().length < 2 || name.trim().length > 100)
    return res.status(400).json({ error: 'Name must be 2–100 characters.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (subject.trim().length < 3 || subject.trim().length > 200)
    return res.status(400).json({ error: 'Subject must be 3–200 characters.' });
  if (message.trim().length < 10 || message.trim().length > 5000)
    return res.status(400).json({ error: 'Message must be 10–5000 characters.' });

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('WARNING: EMAIL_USER or EMAIL_PASS not set in .env');
    return res.status(500).json({ error: 'Server email is not configured yet.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.verify();

    const firstName = escapeHtml(name.trim().split(' ')[0]);
    const safeName  = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email);
    const safeSubj  = escapeHtml(subject.trim());
    const safeMsg   = escapeHtml(message.trim());
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // --- Notification to Suman ---
    await transporter.sendMail({
      from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to:      'sumananand470@gmail.com',
      replyTo: email,
      subject: `[Portfolio] ${subject.trim()}`,
      html: `
<div style="font-family:'Courier New',monospace;background:#060608;color:#e8e8f0;padding:2.5rem;border-radius:10px;border:1px solid #1e1e30;max-width:600px;">
  <h2 style="color:#00d9ff;margin:0 0 1.5rem;letter-spacing:2px;font-size:1.3rem;border-bottom:1px solid #1e1e30;padding-bottom:1rem;">📬 New Portfolio Message</h2>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="color:#00d9ff;padding:.5rem 1rem .5rem 0;width:80px;font-size:.82rem;">FROM</td><td style="color:#f0f0f5;">${safeName}</td></tr>
    <tr><td style="color:#00d9ff;padding:.5rem 1rem .5rem 0;font-size:.82rem;">EMAIL</td><td><a href="mailto:${safeEmail}" style="color:#00d9ff;">${safeEmail}</a></td></tr>
    <tr><td style="color:#00d9ff;padding:.5rem 1rem .5rem 0;font-size:.82rem;">SUBJECT</td><td style="color:#f0f0f5;">${safeSubj}</td></tr>
  </table>
  <hr style="border:none;border-top:1px solid #1e1e30;margin:1.5rem 0;"/>
  <p style="color:#00d9ff;font-size:.82rem;margin-bottom:.8rem;">MESSAGE</p>
  <p style="color:#aaaacc;line-height:1.8;white-space:pre-wrap;background:#0d0d12;padding:1.2rem;border-radius:6px;border-left:3px solid #00d9ff;">${safeMsg}</p>
  <p style="color:#444466;font-size:.72rem;margin-top:1.5rem;">Sent via portfolio contact form · ${timestamp} IST</p>
</div>`,
    });

    // --- Auto-reply to sender ---
    await transporter.sendMail({
      from:    `"Suman Anand" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: `Thanks for reaching out, ${firstName}! — Suman Anand`,
      html: `
<div style="font-family:'Courier New',monospace;background:#060608;color:#e8e8f0;padding:2.5rem;border-radius:10px;max-width:600px;">
  <h2 style="color:#00d9ff;margin:0 0 .5rem;letter-spacing:2px;">Hey ${firstName}! 👋</h2>
  <p style="color:#aaaacc;line-height:1.8;margin:1.2rem 0;">Thanks for reaching out! I've received your message about <strong style="color:#f0f0f5;">"${safeSubj}"</strong> and will reply within <strong style="color:#00d9ff;">24–48 hours</strong>.</p>
  <p style="color:#aaaacc;line-height:1.8;">In the meantime, feel free to check out my work:</p>
  <div style="margin:1.5rem 0;">
    <a href="https://github.com/sumananand460" style="display:inline-block;background:#00d9ff;color:#000;padding:.6rem 1.4rem;border-radius:4px;text-decoration:none;font-weight:700;font-size:.85rem;margin-right:.8rem;">GitHub ↗</a>
    <a href="https://www.linkedin.com/in/suman-anand-104b55313/" style="display:inline-block;color:#00d9ff;padding:.6rem 1.4rem;border-radius:4px;text-decoration:none;font-weight:700;font-size:.85rem;border:1px solid #00d9ff;">LinkedIn ↗</a>
  </div>
  <hr style="border:none;border-top:1px solid #1e1e30;margin:1.5rem 0;"/>
  <p style="color:#444466;font-size:.78rem;margin:0;">— Suman Anand · CS Engineering Student · Full Stack Developer<br/><a href="mailto:sumananand470@gmail.com" style="color:#00d9ff;">sumananand470@gmail.com</a></p>
</div>`,
    });

    console.log(`✅  Mail delivered — From: ${name} <${email}>`);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('❌  Email error:', err.message);
    res.status(500).json({ error: 'Failed to send. Please email me directly at sumananand470@gmail.com' });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  email_configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
  timestamp: new Date().toISOString(),
}));

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => {
  console.log(`\n🚀  Server running → http://localhost:${PORT}`);
  console.log(`📧  Email configured: ${!!(process.env.EMAIL_USER && process.env.EMAIL_PASS) ? 'YES ✓' : 'NO ✗  — set EMAIL_USER + EMAIL_PASS in .env'}\n`);
});

module.exports = app;
