// SGAEM Archive Status Monitor Frontend
let history = [];
let checkInProgress = false;
let countdownInterval = null;
let secondsRemaining = 30;
let refreshIntervalSeconds = 30;

// DOM Elements
const heroCard = document.getElementById('heroCard');
const statusTag = document.getElementById('statusTag');
const statusTitle = document.getElementById('statusTitle');
const statusDesc = document.getElementById('statusDesc');
const lastCheckedText = document.getElementById('lastCheckedText');

const httpMetric = document.getElementById('httpMetric');
const httpSub = document.getElementById('httpSub');
const tcpMetric = document.getElementById('tcpMetric');
const tcpSub = document.getElementById('tcpSub');
const latencyMetric = document.getElementById('latencyMetric');
const latencySub = document.getElementById('latencySub');
const uptimeMetric = document.getElementById('uptimeMetric');
const uptimeSub = document.getElementById('uptimeSub');

const refreshBtn = document.getElementById('refreshBtn');
const btnText = document.getElementById('btnText');
const intervalSelect = document.getElementById('intervalSelect');
const countdownBar = document.getElementById('countdownBar');
const countdownLabel = document.getElementById('countdownLabel');

const timelineBar = document.getElementById('timelineBar');
const historyCount = document.getElementById('historyCount');
const logTableBody = document.getElementById('logTableBody');
const clearLogBtn = document.getElementById('clearLogBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  performCheck();
  startCountdown();
});

function setupEventListeners() {
  refreshBtn.addEventListener('click', () => {
    if (!checkInProgress) {
      performCheck();
      resetCountdown();
    }
  });

  intervalSelect.addEventListener('change', (e) => {
    refreshIntervalSeconds = parseInt(e.target.value, 10);
    resetCountdown();
  });

  clearLogBtn.addEventListener('click', () => {
    history = [];
    updateHistoryUI();
  });
}

async function performCheck() {
  if (checkInProgress) return;
  checkInProgress = true;

  refreshBtn.classList.add('spinning');
  btnText.textContent = 'Checking...';

  const startTime = Date.now();

  try {
    const res = await fetch('/api/status', {
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    handleCheckResult(data);
  } catch (err) {
    handleCheckResult({
      checkedAt: new Date().toISOString(),
      status: 'offline',
      tcp: { connected: false, latencyMs: null, error: err.message },
      http: { statusCode: null, statusText: null, latencyMs: null, error: err.message },
      diagnostics: `Error contacting monitoring API: ${err.message}`
    });
  } finally {
    checkInProgress = false;
    refreshBtn.classList.remove('spinning');
    btnText.textContent = 'Check Now';
  }
}

function handleCheckResult(data) {
  // Store into history
  history.unshift(data);
  if (history.length > 50) history.pop();

  // Update Hero Status
  heroCard.className = `hero-status card status-${data.status}`;
  
  if (data.status === 'online') {
    statusTag.textContent = 'SYSTEM OPERATIONAL';
    statusTitle.textContent = 'Online & Responding';
    statusDesc.textContent = data.diagnostics || 'Endpoint is responding normally to HTTP and TCP requests.';
  } else if (data.status === 'degraded') {
    statusTag.textContent = 'DEGRADED PERFORMANCE';
    statusTitle.textContent = 'Port Open, HTTP Error';
    statusDesc.textContent = data.diagnostics || 'Socket connected, but HTTP server returned an unexpected error.';
  } else {
    statusTag.textContent = 'OFFLINE / UNREACHABLE';
    statusTitle.textContent = 'No Connection';
    statusDesc.textContent = data.diagnostics || 'Connection timed out. Target dropped packets or campus firewall blocked access.';
  }

  const checkDate = new Date(data.checkedAt);
  lastCheckedText.textContent = `Last checked: ${checkDate.toLocaleTimeString()}`;

  // Update HTTP Metric
  if (data.http && data.http.statusCode) {
    httpMetric.textContent = `${data.http.statusCode}`;
    httpMetric.style.color = data.http.statusCode < 400 ? 'var(--color-online)' : 'var(--color-degraded)';
    httpSub.textContent = data.http.statusText || 'HTTP Response';
  } else {
    httpMetric.textContent = 'TIMEOUT';
    httpMetric.style.color = 'var(--color-offline)';
    httpSub.textContent = data.http ? (data.http.error || 'No response') : 'Timed out';
  }

  // Update TCP Metric
  if (data.tcp && data.tcp.connected) {
    tcpMetric.textContent = 'OPEN';
    tcpMetric.style.color = 'var(--color-online)';
    tcpSub.textContent = `Connected (${data.tcp.latencyMs}ms)`;
  } else {
    tcpMetric.textContent = 'CLOSED';
    tcpMetric.style.color = 'var(--color-offline)';
    tcpSub.textContent = data.tcp ? (data.tcp.error || 'Connection timed out') : 'Timeout';
  }

  // Update Latency Metric
  const effectiveLatency = (data.http && data.http.latencyMs) || (data.tcp && data.tcp.latencyMs);
  if (effectiveLatency) {
    latencyMetric.innerHTML = `${effectiveLatency} <span class="unit">ms</span>`;
    latencyMetric.style.color = 'var(--text-main)';
    latencySub.textContent = 'Measured RTT';
  } else {
    latencyMetric.innerHTML = `&infin; <span class="unit">ms</span>`;
    latencyMetric.style.color = 'var(--color-offline)';
    latencySub.textContent = 'Request timed out';
  }

  // Update Session Uptime
  const total = history.length;
  const onlineCount = history.filter(h => h.status === 'online').length;
  const uptimeRate = total > 0 ? ((onlineCount / total) * 100).toFixed(0) : '0';
  uptimeMetric.innerHTML = `${uptimeRate}<span class="unit">%</span>`;
  uptimeSub.textContent = `${total} check${total > 1 ? 's' : ''} in session`;

  // Update Timeline and Log Table
  updateHistoryUI();
}

function updateHistoryUI() {
  historyCount.textContent = `${history.length} check${history.length === 1 ? '' : 's'} recorded`;

  // Timeline pills
  if (history.length === 0) {
    timelineBar.innerHTML = '<span style="color:var(--text-dim);font-size:0.75rem;padding:4px;">No data recorded</span>';
  } else {
    // Show newest from left to right (reverse of history array for chronological order)
    const reversed = [...history].reverse();
    timelineBar.innerHTML = reversed.map(item => {
      const date = new Date(item.checkedAt).toLocaleTimeString();
      return `<div class="timeline-pill ${item.status}" title="[${date}] Status: ${item.status.toUpperCase()}"></div>`;
    }).join('');
  }

  // Log Table
  if (history.length === 0) {
    logTableBody.innerHTML = '<tr class="empty-row"><td colspan="6">No checks recorded yet.</td></tr>';
  } else {
    logTableBody.innerHTML = history.map(item => {
      const date = new Date(item.checkedAt).toLocaleTimeString();
      const statusBadge = `<span class="badge badge-${item.status}">${item.status.toUpperCase()}</span>`;
      const tcpCol = item.tcp && item.tcp.connected ? `<span style="color:var(--color-online)">OPEN (${item.tcp.latencyMs}ms)</span>` : `<span style="color:var(--color-offline)">CLOSED</span>`;
      const httpCol = item.http && item.http.statusCode ? `<code>${item.http.statusCode}</code>` : `<span style="color:var(--color-offline)">TIMEOUT</span>`;
      const latCol = ((item.http && item.http.latencyMs) || (item.tcp && item.tcp.latencyMs)) ? `${(item.http && item.http.latencyMs) || item.tcp.latencyMs} ms` : 'N/A';
      const diagCol = item.diagnostics || '-';

      return `
        <tr>
          <td><span style="font-family:var(--font-mono);font-size:0.8rem">${date}</span></td>
          <td>${statusBadge}</td>
          <td>${tcpCol}</td>
          <td>${httpCol}</td>
          <td>${latCol}</td>
          <td style="font-size:0.8rem;color:var(--text-dim);max-width:250px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${diagCol}">${diagCol}</td>
        </tr>
      `;
    }).join('');
  }
}

// Countdown management
function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    if (refreshIntervalSeconds === 0) {
      countdownBar.style.width = '0%';
      countdownLabel.textContent = 'Auto-refresh paused';
      return;
    }

    secondsRemaining--;

    if (secondsRemaining <= 0) {
      resetCountdown();
      performCheck();
    } else {
      const pct = (secondsRemaining / refreshIntervalSeconds) * 100;
      countdownBar.style.width = `${pct}%`;
      countdownLabel.textContent = `Next check in ${secondsRemaining}s`;
    }
  }, 1000);
}

function resetCountdown() {
  secondsRemaining = refreshIntervalSeconds;
  countdownBar.style.width = '100%';
  countdownLabel.textContent = `Next check in ${secondsRemaining}s`;
}
