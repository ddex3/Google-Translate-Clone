import express from "express";
import cors from "cors";
import { PORT, CORS_ORIGIN } from "./config/env";
import translateRouter from "./routes/translate";

const app = express();
const startTime = Date.now();

app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "16kb" }));

app.get("/api/status", (_req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const mem = process.memoryUsage();
  res.json({
    uptime: uptimeSeconds,
    rss: (mem.rss / 1024 / 1024).toFixed(1),
    heapUsed: (mem.heapUsed / 1024 / 1024).toFixed(1),
    heapTotal: (mem.heapTotal / 1024 / 1024).toFixed(1),
  });
});

app.get("/", (_req, res) => {
  const pid = process.pid;
  const platform = process.platform;
  const nodeVersion = process.version;
  const startDate = new Date(startTime).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Translate API - Status</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285f4'><path d='M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z'/></svg>">
  <style>
    :root {
      --bg: #0d1117;
      --surface: #161b22;
      --border: #30363d;
      --text: #e6edf3;
      --text-muted: #7d8590;
      --accent: #58a6ff;
      --green: #3fb950;
      --green-dim: rgba(63,185,80,0.15);
      --orange: #d29922;
      --orange-dim: rgba(210,153,34,0.15);
      --mono: 'SFMono-Regular', 'Cascadia Code', 'Consolas', 'Liberation Mono', monospace;
      --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: var(--sans);
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .dashboard {
      width: 100%;
      max-width: 600px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .logo {
      width: 36px; height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      color: var(--bg);
      font-family: var(--mono);
    }
    .title {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.3px;
    }
    .version {
      font-size: 12px;
      color: var(--text-muted);
      font-family: var(--mono);
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 2px 8px;
      border-radius: 12px;
    }
    .status-bar {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .status-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .pulse-ring {
      position: relative;
      width: 10px; height: 10px;
    }
    .pulse-ring .dot {
      width: 10px; height: 10px;
      background: var(--green);
      border-radius: 50%;
      position: relative;
      z-index: 1;
    }
    .pulse-ring .ring {
      position: absolute;
      top: -3px; left: -3px;
      width: 16px; height: 16px;
      border: 2px solid var(--green);
      border-radius: 50%;
      animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      opacity: 0;
    }
    @keyframes ping {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(2); opacity: 0; }
    }
    .status-text {
      font-size: 14px;
      font-weight: 600;
      color: var(--green);
    }
    .uptime-chip {
      font-family: var(--mono);
      font-size: 13px;
      color: var(--text-muted);
      background: var(--bg);
      padding: 4px 12px;
      border-radius: 6px;
      border: 1px solid var(--border);
      letter-spacing: 0.5px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }
    .metric-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
    }
    .metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    .metric-value {
      font-family: var(--mono);
      font-size: 18px;
      font-weight: 600;
    }
    .metric-unit {
      font-size: 12px;
      color: var(--text-muted);
    }
    .section {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .section-header {
      padding: 12px 20px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
      font-weight: 600;
    }
    .sys-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .sys-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      border-bottom: 1px solid var(--border);
    }
    .sys-row:nth-child(odd) {
      border-right: 1px solid var(--border);
    }
    .sys-row:nth-last-child(-n+2) { border-bottom: none; }
    .sys-key {
      font-size: 12px;
      color: var(--text-muted);
    }
    .sys-val {
      font-family: var(--mono);
      font-size: 12px;
      color: var(--text);
    }
    .footer {
      padding: 24px 0 0;
      margin-top: 8px;
      font-size: 13px;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
    }
    .footer-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .footer-brand svg { flex-shrink: 0; }
    .footer-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .footer-link {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 13px;
      transition: color 0.15s;
    }
    .footer-link:hover { color: var(--accent); }
    .footer-bottom {
      text-align: center;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
    .footer-sub {
      margin-top: 4px;
      font-size: 12px;
      color: var(--text-muted);
      opacity: 0.6;
    }
  </style>
</head>
<body>
  <div class="dashboard">
    <div class="header">
      <div class="header-left">
        <div class="logo"><svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg></div>
        <span class="title">Translate API</span>
      </div>
      <span class="version">v1.0.0</span>
    </div>

    <div class="status-bar">
      <div class="status-left">
        <div class="pulse-ring">
          <div class="dot"></div>
        </div>
        <span class="status-text">Operational</span>
      </div>
      <span class="uptime-chip" id="uptime">uptime 00:00:00</span>
    </div>

    <div class="metrics">
      <div class="metric-card">
        <div class="metric-label">RSS Memory</div>
        <div class="metric-value"><span id="rss">0</span> <span class="metric-unit">MB</span></div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Heap Used</div>
        <div class="metric-value"><span id="heapUsed">0</span> <span class="metric-unit">MB</span></div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Heap Total</div>
        <div class="metric-value"><span id="heapTotal">0</span> <span class="metric-unit">MB</span></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">System</div>
      <div class="sys-grid">
        <div class="sys-row">
          <span class="sys-key">Node</span>
          <span class="sys-val">${nodeVersion}</span>
        </div>
        <div class="sys-row">
          <span class="sys-key">Platform</span>
          <span class="sys-val">${platform}</span>
        </div>
        <div class="sys-row">
          <span class="sys-key">PID</span>
          <span class="sys-val">${pid}</span>
        </div>
        <div class="sys-row">
          <span class="sys-key">Port</span>
          <span class="sys-val">${PORT}</span>
        </div>
        <div class="sys-row">
          <span class="sys-key">Started</span>
          <span class="sys-val">${startDate}</span>
        </div>
        <div class="sys-row">
          <span class="sys-key">CORS</span>
          <span class="sys-val">:5173</span>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
          </svg>
          <span>Translate by Shaked Angel</span>
        </div>
        <div class="footer-links">
          <a href="https://github.com/ddex3" target="_blank" rel="noopener noreferrer" class="footer-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a href="https://github.com/ddex3/Google-Translate-Clone" target="_blank" rel="noopener noreferrer" class="footer-link">
            Source Code
          </a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Shaked Angel. All rights reserved.</p>
      </div>
    </footer>
  </div>

  <script>
    function fmt(s) {
      const h = String(Math.floor(s / 3600)).padStart(2, '0');
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const sec = String(s % 60).padStart(2, '0');
      return 'uptime ' + h + ':' + m + ':' + sec;
    }

    async function poll() {
      try {
        const res = await fetch('/api/status');
        const d = await res.json();
        document.getElementById('uptime').textContent = fmt(d.uptime);
        document.getElementById('rss').textContent = d.rss;
        document.getElementById('heapUsed').textContent = d.heapUsed;
        document.getElementById('heapTotal').textContent = d.heapTotal;
      } catch {}
    }

    poll();
    setInterval(poll, 1000);
  </script>
</body>
</html>`);
});

app.use("/translate", translateRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
