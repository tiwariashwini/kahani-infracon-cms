import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from 'pg';

const { Pool } = pkg;
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

app.use(cors());
app.use(express.json());

const ROLE_PERMISSIONS = {
  'Super Admin': ['*'],
  Admin: ['*'],
  'Project Manager': [
    'projects.read',
    'dpr.read',
    'dashboard.read',
    'inventory.read',
    'quality.read',
    'safety.read',
  ],
  'Site Engineer': [
    'projects.read',
    'dpr.read',
    'dpr.write',
    'inventory.read',
    'quality.read',
  ],
  'Billing Engineer': [
    'billing.read',
    'billing.write',
    'dashboard.read',
    'expenses.read',
  ],
  'Store Keeper': [
    'inventory.read',
    'inventory.write',
    'dashboard.read',
  ],
  HR: [
    'hr.read',
    'attendance.read',
    'dashboard.read',
  ],
  Accountant: [
    'billing.read',
    'expenses.read',
    'dashboard.read',
  ],
  'Quality Engineer': [
    'quality.read',
    'quality.write',
    'dpr.read',
  ],
  'Safety Officer': [
    'safety.read',
    'safety.write',
    'dpr.read',
  ],
};

const demoUsers = [
  {
    id: 'u-superadmin',
    name: 'Ashwini Tiwari',
    email: 'superadmin@kahani.infracon',
    role: 'Super Admin',
    password: 'Admin@123',
  },
  {
    id: 'u-manager',
    name: 'Ravindra Singh',
    email: 'manager@kahani.infracon',
    role: 'Project Manager',
    password: 'Admin@123',
  },
  {
    id: 'u-engineer',
    name: 'Neha Verma',
    email: 'siteengineer@kahani.infracon',
    role: 'Site Engineer',
    password: 'Admin@123',
  },
  {
    id: 'u-billing',
    name: 'Karan Mehta',
    email: 'billing@kahani.infracon',
    role: 'Billing Engineer',
    password: 'Admin@123',
  },
  {
    id: 'u-store',
    name: 'Jitendra Kumar',
    email: 'storekeeper@kahani.infracon',
    role: 'Store Keeper',
    password: 'Admin@123',
  },
  {
    id: 'u-hr',
    name: 'Priya Shah',
    email: 'hr@kahani.infracon',
    role: 'HR',
    password: 'Admin@123',
  },
  {
    id: 'u-accountant',
    name: 'Amit Roy',
    email: 'accountant@kahani.infracon',
    role: 'Accountant',
    password: 'Admin@123',
  },
  {
    id: 'u-quality',
    name: 'Sonal Pawar',
    email: 'quality@kahani.infracon',
    role: 'Quality Engineer',
    password: 'Admin@123',
  },
  {
    id: 'u-safety',
    name: 'Vikas Jain',
    email: 'safety@kahani.infracon',
    role: 'Safety Officer',
    password: 'Admin@123',
  },
];

const createHashPassword = async (password) => bcrypt.hash(password, 10);

const initDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_code VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        client VARCHAR(255),
        location VARCHAR(255),
        progress INTEGER DEFAULT 0,
        status VARCHAR(100) DEFAULT 'On Track',
        budget NUMERIC(16,2) DEFAULT 0,
        spent NUMERIC(16,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS dpr_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_code VARCHAR(100) REFERENCES projects(project_code),
        report_date DATE NOT NULL,
        weather VARCHAR(100),
        manpower INTEGER DEFAULT 0,
        progress_summary TEXT,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        item_name VARCHAR(255) NOT NULL,
        stock INTEGER DEFAULT 0,
        unit VARCHAR(50),
        location VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Healthy',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS billing_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bill_no VARCHAR(120) NOT NULL UNIQUE,
        project_name VARCHAR(255),
        period VARCHAR(120),
        amount NUMERIC(16,2) DEFAULT 0,
        status VARCHAR(100) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const existingResult = await client.query('SELECT COUNT(*)::int AS count FROM users');

    if (existingResult.rows[0].count === 0) {
      for (const user of demoUsers) {
        const passwordHash = await createHashPassword(user.password);
        await client.query(
          'INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)',
          [user.id, user.name, user.email, passwordHash, user.role]
        );
      }
    }

    const projectCount = await client.query('SELECT COUNT(*)::int AS count FROM projects');

    if (projectCount.rows[0].count === 0) {
      await client.query(
        `INSERT INTO projects (project_code, name, client, location, progress, status, budget, spent)
         VALUES
         ('PRJ-101', 'Corporate HQ Tower', 'Apex Infra', 'Bengaluru', 78, 'On Track', 4800000, 3740000),
         ('PRJ-204', 'Industrial Utility Complex', 'Westbridge', 'Pune', 62, 'In Review', 6200000, 3840000),
         ('PRJ-316', 'Water Treatment Plant', 'Nirmal Utility', 'Nagpur', 49, 'Delayed', 5300000, 2610000),
         ('PRJ-440', 'Metro Station Expansion', 'Metro Build', 'Delhi', 86, 'On Track', 9100000, 7810000);`
      );
    }

    const dprCount = await client.query('SELECT COUNT(*)::int AS count FROM dpr_records');

    if (dprCount.rows[0].count === 0) {
      await client.query(
        `INSERT INTO dpr_records (project_code, report_date, weather, manpower, progress_summary, remarks)
         VALUES
         ('PRJ-101', '2026-10-09', 'Clear', 142, 'RCC slab casting 86% complete', 'No major delays reported. Safety checklist verified.'),
         ('PRJ-204', '2026-10-08', 'Sunny', 117, 'Block work 64% complete', 'Steel fixing on schedule'),
         ('PRJ-316', '2026-10-07', 'Humid', 96, 'Pipe trenching 52% complete', 'Safety briefing completed');`
      );
    }

    const inventoryCount = await client.query('SELECT COUNT(*)::int AS count FROM inventory_items');

    if (inventoryCount.rows[0].count === 0) {
      await client.query(
        `INSERT INTO inventory_items (item_name, stock, unit, location, status)
         VALUES
         ('Cement OPC 53 Grade', 420, 'bags', 'Warehouse-A', 'Healthy'),
         ('TMT Steel', 184, 'tons', 'Yard-B', 'Low'),
         ('River Sand', 520, 'cum', 'Stock Yard 1', 'Healthy'),
         ('PVC Pipes', 95, 'pieces', 'Store-G', 'Review');`
      );
    }

    const billingCount = await client.query('SELECT COUNT(*)::int AS count FROM billing_records');

    if (billingCount.rows[0].count === 0) {
      await client.query(
        `INSERT INTO billing_records (bill_no, project_name, period, amount, status)
         VALUES
         ('RA-2048', 'Metro Station Expansion', 'Sep 2026', 2486000, 'Submitted'),
         ('RA-2043', 'Corporate HQ Tower', 'Sep 2026', 1825000, 'Approved'),
         ('RA-2039', 'Industrial Utility Complex', 'Aug 2026', 1432000, 'Pending');`
      );
    }
  } finally {
    client.release();
  }
};

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const requirePermission = (permission) => (req, res, next) => {
  const userRole = req.user?.role;
  const permissions = ROLE_PERMISSIONS[userRole] || [];

  if (permissions.includes('*') || permissions.includes(permission)) {
    return next();
  }

  return res.status(403).json({ message: 'You do not have permission to access this module.' });
};

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, message: 'KAHANI INFRACON API healthy' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Database connection failed.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, password_hash FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );

    const userRecord = result.rows[0];
    if (!userRecord) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, userRecord.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      {
        userId: userRecord.id,
        email: userRecord.email,
        role: userRecord.role,
        name: userRecord.name,
      },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.json({
      token,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        role: userRecord.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Authentication failed due to server error.' });
  }
});

app.get('/api/dashboard', requireAuth, requirePermission('dashboard.read'), async (req, res) => {
  try {
    const projectsResult = await pool.query(
      'SELECT project_code, name, client, location, progress, status, budget, spent FROM projects ORDER BY created_at DESC LIMIT 10'
    );

    const dprResult = await pool.query(
      `SELECT p.name AS project, d.report_date AS date, d.progress_summary AS progress, d.manpower
       FROM dpr_records d
       LEFT JOIN projects p ON p.project_code = d.project_code
       ORDER BY d.report_date DESC LIMIT 10`
    );

    const inventoryResult = await pool.query(
      'SELECT item_name AS item, stock, unit, location, status FROM inventory_items ORDER BY created_at DESC LIMIT 10'
    );

    const billingResult = await pool.query(
      'SELECT bill_no, project_name AS project, period, amount, status FROM billing_records ORDER BY created_at DESC LIMIT 10'
    );

    const avgProgress = projectsResult.rows.length
      ? Math.round(projectsResult.rows.reduce((sum, project) => sum + Number(project.progress), 0) / projectsResult.rows.length)
      : 72;

    const outstandingBills = billingResult.rows.reduce((sum, row) => {
      return ['Pending', 'Submitted', 'Under Review'].includes(row.status) ? sum + Number(row.amount) : sum;
    }, 0);

    return res.json({
      projectCount: projectsResult.rows.length || 18,
      progressAverage: avgProgress,
      safetyIndex: 96.4,
      outstandingBills,
      projects: projectsResult.rows,
      dpr: dprResult.rows,
      inventory: inventoryResult.rows,
      billing: billingResult.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load dashboard data.' });
  }
});

app.get('/api/projects', requireAuth, requirePermission('projects.read'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch projects.' });
  }
});

app.get('/api/inventory', requireAuth, requirePermission('inventory.read'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory_items ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch inventory.' });
  }
});

app.get('/api/billing', requireAuth, requirePermission('billing.read'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM billing_records ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch billing records.' });
  }
});

app.get('/api/dpr', requireAuth, requirePermission('dpr.read'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, p.name AS project_name
       FROM dpr_records d
       LEFT JOIN projects p ON p.project_code = d.project_code
       ORDER BY d.report_date DESC`
    );
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch DPR records.' });
  }
});

if (process.argv.includes('--init-only')) {
  initDatabase()
    .then(() => {
      console.log('Database initialized successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
} else {
  initDatabase()
    .then(() => {
      app.listen(port, () => {
        console.log(`KAHANI INFRACON server running on http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    });
}
