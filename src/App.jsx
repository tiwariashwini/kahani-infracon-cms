import { useEffect, useState } from 'react';

const MODULES = [
  'Admin Dashboard',
  'Project Management',
  'Planning and Scheduling',
  'Site Execution and RCC Work',
  'Daily Progress Report (DPR)',
  'Daily Labour Report (DLR)',
  'Billing, BOQ, and RA Bills',
  'Material Inventory',
  'Manpower and Attendance',
  'Quality Control',
  'Safety Management',
  'Engineering, Drawings, and BBS',
  'HR Management',
  'Accounts and Expenses',
  'Document Register',
  'Construction Calculators',
  'Excel and PDF Report Export',
];

const ROLE_ACCESS = {
  'Super Admin': MODULES,
  Admin: MODULES,
  'Project Manager': [
    'Admin Dashboard',
    'Project Management',
    'Planning and Scheduling',
    'Site Execution and RCC Work',
    'Daily Progress Report (DPR)',
    'Quality Control',
    'Safety Management',
    'Document Register',
  ],
  'Site Engineer': [
    'Admin Dashboard',
    'Project Management',
    'Planning and Scheduling',
    'Site Execution and RCC Work',
    'Daily Progress Report (DPR)',
    'Daily Labour Report (DLR)',
    'Quality Control',
    'Engineering, Drawings, and BBS',
  ],
  'Billing Engineer': [
    'Admin Dashboard',
    'Billing, BOQ, and RA Bills',
    'Accounts and Expenses',
    'Excel and PDF Report Export',
  ],
  'Store Keeper': [
    'Admin Dashboard',
    'Material Inventory',
    'Document Register',
    'Excel and PDF Report Export',
  ],
  HR: [
    'Admin Dashboard',
    'Manpower and Attendance',
    'HR Management',
    'Accounts and Expenses',
  ],
  Accountant: [
    'Admin Dashboard',
    'Billing, BOQ, and RA Bills',
    'Accounts and Expenses',
    'Excel and PDF Report Export',
  ],
  'Quality Engineer': [
    'Admin Dashboard',
    'Quality Control',
    'Site Execution and RCC Work',
    'Engineering, Drawings, and BBS',
  ],
  'Safety Officer': [
    'Admin Dashboard',
    'Safety Management',
    'Daily Progress Report (DPR)',
    'Site Execution and RCC Work',
  ],
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

function App() {
  const [token, setToken] = useState(localStorage.getItem('kahani_token') || '');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('kahani_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loginForm, setLoginForm] = useState({ email: 'superadmin@kahani.infracon', password: 'Admin@123' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Admin Dashboard');
  const [dashboardData, setDashboardData] = useState({
    projectCount: 0,
    progressAverage: 0,
    safetyIndex: 0,
    outstandingBills: 0,
    projects: [],
    dpr: [],
    inventory: [],
    billing: [],
  });

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Dashboard request failed');
        }

        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Unable to load dashboard data', error);
      }
    };

    fetchData();
  }, [token]);

  const allowedModules = user ? ROLE_ACCESS[user.role] || MODULES : MODULES;

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('kahani_token', data.token);
      localStorage.setItem('kahani_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setActiveTab('Admin Dashboard');
    } catch (error) {
      setLoginError(error.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kahani_token');
    localStorage.removeItem('kahani_user');
    setToken('');
    setUser(null);
    setActiveTab('Admin Dashboard');
  };

  if (!user || !token) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="brand-box auth-brand">
            <div className="brand-mark">K</div>
            <div>
              <strong>KAHANI</strong>
              <span>INFRACON</span>
            </div>
          </div>

          <div className="auth-header">
            <p className="eyebrow">Secure Access Portal</p>
            <h1>Construction Management Login</h1>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <label>
              Email address
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                placeholder="you@kahani.infracon"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                placeholder="Enter password"
              />
            </label>

            {loginError ? <div className="error-box">{loginError}</div> : null}

            <button type="submit" className="primary-btn auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="demo-box">
            <strong>Demo accounts</strong>
            <p>Super Admin: superadmin@kahani.infracon / Admin@123</p>
            <p>Project Manager: manager@kahani.infracon / Admin@123</p>
          </div>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    const stats = [
      { label: 'Active Projects', value: dashboardData.projectCount || '18', change: '+3 this month', tone: 'navy' },
      { label: 'Progress Completion', value: `${dashboardData.progressAverage || 72}%`, change: '+8.5% vs last week', tone: 'green' },
      { label: 'Site Safety Index', value: `${dashboardData.safetyIndex || 96.4}%`, change: 'Excellent compliance', tone: 'mint' },
      { label: 'Outstanding Bills', value: formatCurrency(dashboardData.outstandingBills || 48000000), change: '4 pending approvals', tone: 'orange' },
    ];

    const progressBars = [
      { name: 'RCC Works', value: 82 },
      { name: 'Finishes', value: 68 },
      { name: 'MEP', value: 57 },
      { name: 'Earthworks', value: 74 },
    ];

    return (
      <>
        <header className="page-header">
          <div>
            <p className="eyebrow">Construction Command Center</p>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="header-badge">Demo Data</div>
        </header>

        <div className="stats-grid">
          {stats.map((item) => (
            <div key={item.label} className={`stat-card ${item.tone}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.change}</small>
            </div>
          ))}
        </div>

        <div className="content-grid two-up">
          <div className="panel">
            <div className="panel-head">
              <h3>Project Progress</h3>
              <button className="ghost-btn">View all</button>
            </div>
            <div className="progress-list">
              {progressBars.map((bar) => (
                <div key={bar.name} className="progress-row">
                  <div className="progress-meta">
                    <span>{bar.name}</span>
                    <strong>{bar.value}%</strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${bar.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Site Efficiency</h3>
              <button className="ghost-btn">Export</button>
            </div>
            <div className="mini-chart">
              {[46, 54, 52, 72, 66, 86, 78].map((value, index) => (
                <div key={`${value}-${index}`} className="bar-col">
                  <span style={{ height: `${value}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Project Portfolio</h3>
            <button className="ghost-btn">Download report</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project Code</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Budget</th>
                </tr>
              </thead>
              <tbody>
                {(dashboardData.projects?.length ? dashboardData.projects : [
                  { projectCode: 'PRJ-101', name: 'Corporate HQ Tower', location: 'Bengaluru', progress: 78, status: 'On Track', budget: 4800000 },
                  { projectCode: 'PRJ-204', name: 'Industrial Utility Complex', location: 'Pune', progress: 62, status: 'In Review', budget: 6200000 },
                  { projectCode: 'PRJ-316', name: 'Water Treatment Plant', location: 'Nagpur', progress: 49, status: 'Delayed', budget: 5300000 },
                ]).map((project) => (
                  <tr key={project.projectCode || project.name}>
                    <td>{project.projectCode}</td>
                    <td>{project.name}</td>
                    <td>{project.location}</td>
                    <td>
                      <div className="table-progress">
                        <span>{project.progress}%</span>
                        <div className="mini-track"><i style={{ width: `${project.progress}%` }} /></div>
                      </div>
                    </td>
                    <td><span className={`pill ${String(project.status).toLowerCase().replace(/\s+/g, '-')}`}>{project.status}</span></td>
                    <td>{formatCurrency(project.budget)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderProjectManagement = () => (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Portfolio Control</p>
          <h1>Project Management</h1>
        </div>
        <button className="primary-btn">New Project</button>
      </header>

      <div className="panel">
        <div className="panel-head">
          <h3>Current Projects</h3>
          <span className="soft-label">Demo Data</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Project</th>
                <th>Client</th>
                <th>Location</th>
                <th>Progress</th>
                <th>Budget</th>
                <th>Spent</th>
              </tr>
            </thead>
            <tbody>
              {(dashboardData.projects?.length ? dashboardData.projects : [
                { projectCode: 'PRJ-101', name: 'Corporate HQ Tower', client: 'Apex Infra', location: 'Bengaluru', progress: 78, budget: 4800000, spent: 3740000 },
                { projectCode: 'PRJ-204', name: 'Industrial Utility Complex', client: 'Westbridge', location: 'Pune', progress: 62, budget: 6200000, spent: 3840000 },
                { projectCode: 'PRJ-316', name: 'Water Treatment Plant', client: 'Nirmal Utility', location: 'Nagpur', progress: 49, budget: 5300000, spent: 2610000 },
              ]).map((project) => (
                <tr key={project.projectCode || project.name}>
                  <td>{project.projectCode}</td>
                  <td>{project.name}</td>
                  <td>{project.client || 'Apex Infra'}</td>
                  <td>{project.location}</td>
                  <td>{project.progress}%</td>
                  <td>{formatCurrency(project.budget)}</td>
                  <td>{formatCurrency(project.spent || project.budget * 0.67)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderDpr = () => (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Field Reporting</p>
          <h1>Daily Progress Report</h1>
        </div>
        <button className="primary-btn">Submit DPR</button>
      </header>

      <div className="content-grid two-up">
        <div className="panel">
          <div className="panel-head">
            <h3>DPR Submission</h3>
          </div>
          <form className="form-grid">
            <label>
              Project
              <select defaultValue="Corporate HQ Tower">
                <option>Corporate HQ Tower</option>
                <option>Industrial Utility Complex</option>
                <option>Water Treatment Plant</option>
              </select>
            </label>
            <label>
              Date
              <input type="date" defaultValue="2026-10-09" />
            </label>
            <label>
              Weather
              <input type="text" defaultValue="Clear" />
            </label>
            <label>
              Manpower Count
              <input type="number" defaultValue="142" />
            </label>
            <label className="full-width">
              Progress Description
              <textarea defaultValue="RCC slab casting completed for level 14 and 15. Curing scheduled for night shift. Fabrication and installation of formwork in progress." />
            </label>
            <label className="full-width">
              Remarks
              <textarea defaultValue="No major delays reported. Safety checklist verified." />
            </label>
            <button type="button" className="primary-btn">Save daily entry</button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Recent DPR Entries</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Project</th>
                  <th>Progress</th>
                  <th>Manpower</th>
                </tr>
              </thead>
              <tbody>
                {(dashboardData.dpr?.length ? dashboardData.dpr : [
                  { date: '2026-10-09', project: 'Corporate HQ Tower', progress: 'RCC slab casting 86%', manpower: 142 },
                  { date: '2026-10-08', project: 'Industrial Utility Complex', progress: 'Block work 64%', manpower: 117 },
                  { date: '2026-10-07', project: 'Water Treatment Plant', progress: 'Pipe trenching 52%', manpower: 96 },
                ]).map((record) => (
                  <tr key={`${record.project}-${record.date}`}>
                    <td>{record.date}</td>
                    <td>{record.project}</td>
                    <td>{record.progress}</td>
                    <td>{record.manpower}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderInventory = () => (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Warehouse Monitoring</p>
          <h1>Material Inventory</h1>
        </div>
        <button className="primary-btn">Add Material</button>
      </header>

      <div className="panel">
        <div className="panel-head">
          <h3>Stock Overview</h3>
          <span className="soft-label">Demo Data</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Stock</th>
                <th>Unit</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(dashboardData.inventory?.length ? dashboardData.inventory : [
                { item: 'Cement OPC 53 Grade', stock: 420, unit: 'bags', location: 'Warehouse-A', status: 'Healthy' },
                { item: 'TMT Steel', stock: 184, unit: 'tons', location: 'Yard-B', status: 'Low' },
                { item: 'River Sand', stock: 520, unit: 'cum', location: 'Stock Yard 1', status: 'Healthy' },
              ]).map((item) => (
                <tr key={item.item}>
                  <td>{item.item}</td>
                  <td>{item.stock}</td>
                  <td>{item.unit}</td>
                  <td>{item.location}</td>
                  <td><span className={`pill ${String(item.status).toLowerCase()}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderBilling = () => (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Financial Control</p>
          <h1>Billing and RA Bills</h1>
        </div>
        <button className="primary-btn">Create BOQ</button>
      </header>

      <div className="panel">
        <div className="panel-head">
          <h3>Current RA Bill Register</h3>
          <span className="soft-label">Demo Data</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Project</th>
                <th>Period</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(dashboardData.billing?.length ? dashboardData.billing : [
                { billNo: 'RA-2048', project: 'Metro Station Expansion', period: 'Sep 2026', amount: 2486000, status: 'Submitted' },
                { billNo: 'RA-2043', project: 'Corporate HQ Tower', period: 'Sep 2026', amount: 1825000, status: 'Approved' },
                { billNo: 'RA-2039', project: 'Industrial Utility Complex', period: 'Aug 2026', amount: 1432000, status: 'Pending' },
              ]).map((bill) => (
                <tr key={bill.billNo}>
                  <td>{bill.billNo}</td>
                  <td>{bill.project}</td>
                  <td>{bill.period}</td>
                  <td>{formatCurrency(bill.amount)}</td>
                  <td><span className={`pill ${String(bill.status).toLowerCase().replace(/\s+/g, '-')}`}>{bill.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const contentMap = {
    'Admin Dashboard': renderDashboard,
    'Project Management': renderProjectManagement,
    'Daily Progress Report (DPR)': renderDpr,
    'Material Inventory': renderInventory,
    'Billing, BOQ, and RA Bills': renderBilling,
  };

  const renderModule = () => contentMap[activeTab] ? contentMap[activeTab]() : (
    <div className="panel empty-state">
      <div>
        <h3>{activeTab}</h3>
        <p>This module is included in the product roadmap and ready for future implementation.</p>
      </div>
    </div>
  );

  const visibleModules = allowedModules.filter((module) => MODULES.includes(module));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-mark">K</div>
          <div>
            <strong>KAHANI</strong>
            <span>INFRACON</span>
          </div>
        </div>

        <nav className="nav-menu">
          {visibleModules.map((item) => (
            <button
              key={item}
              className={item === activeTab ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-title">
            <span className="mobile-tag">Menu</span>
            <h2>Integrated Construction Management System</h2>
          </div>
          <div className="topbar-actions">
            <button className="ghost-btn">Notifications</button>
            <div className="user-pill">
              <span className="user-avatar">{(user.name || 'AS').slice(0, 2).toUpperCase()}</span>
              <div>
                <strong>{user.name}</strong>
                <small>{user.role}</small>
              </div>
            </div>
            <button className="ghost-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {renderModule()}
      </main>
    </div>
  );
}

export default App;
