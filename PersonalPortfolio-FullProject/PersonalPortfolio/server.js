require('dotenv').config();

const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(500).json({ status: 'ERROR', database: 'Disconnected' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const [projects] = await pool.query(
      'SELECT id, title, description, technologies, project_link, created_at FROM projects ORDER BY created_at DESC, id DESC'
    );
    res.json(projects);
  } catch (error) {
    console.error('Could not load projects:', error.message);
    res.status(500).json({ error: 'Unable to load projects right now.' });
  }
});

app.post('/api/contacts', async (req, res) => {
  const { name, email, message } = req.body || {};

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string'
  ) {
    return res.status(400).json({ error: 'Please complete all fields.' });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({ error: 'Please complete all fields.' });
  }
  if (cleanName.length > 100 || cleanEmail.length > 150 || cleanMessage.length > 5000) {
    return res.status(400).json({ error: 'One or more fields are too long.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    await pool.execute(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [cleanName, cleanEmail, cleanMessage]
    );
    res.status(201).json({ message: 'Thank you! Your message has been saved.' });
  } catch (error) {
    console.error('Could not save contact:', error.message);
    res.status(500).json({ error: 'Unable to save your message. Please try again.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

const server = app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});

async function shutdown() {
  console.log('\\nShutting down portfolio server...');
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
