// SGAEM Archive Status Monitor - Focused Status Checker
const translations = {
  'ko-kr': {
    brandBadge: '실시간 상태',
    pageTitle: '163.239.88.115 상태',
    docTitle: '163.239.88.115 상태 모니터',
    targetLabel: '대상:',
    intervalLabel: '주기:',
    intervalManual: '수동',
    checkNow: '지금 확인',
    checking: '확인 중...',
    nextCheckIn: '다음 확인까지 {s}초',
    autoPaused: '자동 갱신 일시정지',
    lastCheckedPrefix: '마지막 확인: ',
    justNow: '방금 전',
    heroTagChecking: '확인 중...',
    heroInitialTitle: '서버 상태 확인 중',
    heroInitialDesc: '163.239.88.115:3536 연결을 확인하고 있습니다...',
    heroTagOnline: '정상 작동',
    heroTitleOnline: '정상 작동 중 (Online)',
    heroDescOnline: '163.239.88.115:3536 이 현재 정상적으로 응답하고 있습니다.',
    heroTagDegraded: '불안정',
    heroTitleDegraded: '포트 열림 / HTTP 오류',
    heroDescDegraded: '포트는 열려 있으나 HTTP 응답에 이상이 있습니다.',
    heroTagOffline: '작동 안 함',
    heroTitleOffline: '작동하지 않음 (Offline)',
    heroDescOffline: '163.239.88.115:3536 으로부터 응답이 없습니다. (연결 시간 초과)',
    metricServer: '서버 작동 상태',
    metricHttp: 'HTTP 응답',
    metricTcp: 'TCP 3536 포트',
    metricLatency: '지연 시간',
    metricHttpWait: '응답 대기 중',
    metricTcpSub: '소켓 연결',
    metricLatencySub: '왕복 응답 속도',
    footerText: 'SGAEM Archive (163.239.88.115:3536) Status Monitor',
    statusWorking: '작동 중',
    statusNotWorking: '작동 안 함',
    statusDegraded: '불안정',
    openText: '열림',
    closedText: '닫힘/초과',
    timeoutText: '시간 초과'
  },
  'en': {
    brandBadge: 'LIVE STATUS',
    pageTitle: '163.239.88.115 Status',
    docTitle: '163.239.88.115 Status Monitor',
    targetLabel: 'Target:',
    intervalLabel: 'Interval:',
    intervalManual: 'Manual',
    checkNow: 'Check Now',
    checking: 'Checking...',
    nextCheckIn: 'Next check in {s}s',
    autoPaused: 'Auto-refresh paused',
    lastCheckedPrefix: 'Last checked: ',
    justNow: 'Just now',
    heroTagChecking: 'CHECKING...',
    heroInitialTitle: 'Checking Server Status',
    heroInitialDesc: 'Connecting to 163.239.88.115:3536...',
    heroTagOnline: 'WORKING',
    heroTitleOnline: 'Working Normally (Online)',
    heroDescOnline: '163.239.88.115:3536 is currently up and responding.',
    heroTagDegraded: 'DEGRADED',
    heroTitleDegraded: 'Port Open, HTTP Error',
    heroDescOnline: 'Socket connected, but HTTP returned an error.',
    heroTagOffline: 'NOT WORKING',
    heroTitleOffline: 'Not Working (Offline)',
    heroDescOffline: '163.239.88.115:3536 is not responding. (Connection timed out)',
    metricServer: 'Server Status',
    metricHttp: 'HTTP Status',
    metricTcp: 'TCP Port 3536',
    metricLatency: 'Latency (RTT)',
    metricHttpWait: 'Waiting for response',
    metricTcpSub: 'Socket test',
    metricLatencySub: 'Round-trip time',
    footerText: 'SGAEM Archive (163.239.88.115:3536) Status Monitor',
    statusWorking: 'Working',
    statusNotWorking: 'Not Working',
    statusDegraded: 'Degraded',
    openText: 'OPEN',
    closedText: 'CLOSED',
    timeoutText: 'TIMEOUT'
  },
  'cn': {
    brandBadge: '实时状态',
    pageTitle: '163.239.88.115 状态',
    docTitle: '163.239.88.115 状态监控',
    targetLabel: '目标:',
    intervalLabel: '周期:',
    intervalManual: '手动',
    checkNow: '立即检测',
    checking: '检测中...',
    nextCheckIn: '距离下次检测还有 {s} 秒',
    autoPaused: '自动刷新已暂停',
    lastCheckedPrefix: '上次检测: ',
    justNow: '刚刚',
    heroTagChecking: '检测中...',
    heroInitialTitle: '正在检测服务器状态',
    heroInitialDesc: '正在连接 163.239.88.115:3536...',
    heroTagOnline: '运行正常',
    heroTitleOnline: '正常运行中 (Online)',
    heroDescOnline: '163.239.88.115:3536 当前正常响应。',
    heroTagDegraded: '降级',
    heroTitleDegraded: '端口开放 / HTTP 异常',
    heroDescDegraded: '端口已连接，但 HTTP 请求异常。',
    heroTagOffline: '未运行',
    heroTitleOffline: '未正常运行 (Offline)',
    heroDescOffline: '163.239.88.115:3536 当前无响应（连接超时）。',
    metricServer: '服务器运行状态',
    metricHttp: 'HTTP 响应',
    metricTcp: 'TCP 3536 端口',
    metricLatency: '延迟 (RTT)',
    metricHttpWait: '等待响应',
    metricTcpSub: '套接字测试',
    metricLatencySub: '往返时间',
    footerText: 'SGAEM Archive (163.239.88.115:3536) Status Monitor',
    statusWorking: '正常运行',
    statusNotWorking: '未运行',
    statusDegraded: '运行异常',
    openText: '开放',
    closedText: '关闭/超时',
    timeoutText: '超时'
  }
};

// State variables
let currentLang = localStorage.getItem('status_lang') || 'ko-kr';
let currentTheme = localStorage.getItem('status_theme') || 'system';
let latestData = null;
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

const overallMetric = document.getElementById('overallMetric');
const overallSub = document.getElementById('overallSub');
const httpMetric = document.getElementById('httpMetric');
const httpSub = document.getElementById('httpSub');
const tcpMetric = document.getElementById('tcpMetric');
const tcpSub = document.getElementById('tcpSub');
const latencyMetric = document.getElementById('latencyMetric');
const latencySub = document.getElementById('latencySub');

const refreshBtn = document.getElementById('refreshBtn');
const btnText = document.getElementById('btnText');
const intervalSelect = document.getElementById('intervalSelect');
const countdownBar = document.getElementById('countdownBar');
const countdownLabel = document.getElementById('countdownLabel');

const langSelect = document.getElementById('langSelect');
const themeButtons = document.querySelectorAll('.rocker-btn, .theme-btn');

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  setupEventListeners();
  performCheck();
  startCountdown();
});

// Theme Management
function initTheme() {
  applyTheme(currentTheme);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'system') {
      applyTheme('system');
    }
  });

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-theme-val');
      applyTheme(val);
    });
  });
}

function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('status_theme', theme);

  themeButtons.forEach(btn => {
    if (btn.getAttribute('data-theme-val') === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

// Language (i18n) Management
function initLanguage() {
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }
  setLanguage(currentLang);
}

function t(key, params = {}) {
  const dict = translations[currentLang] || translations['ko-kr'];
  let str = dict[key] || translations['ko-kr'][key] || key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(`{${k}}`, v);
  }
  return str;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('status_lang', lang);
  document.documentElement.lang = lang;

  document.title = t('docTitle');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  const manualOpt = intervalSelect.querySelector('option[value="0"]');
  if (manualOpt) manualOpt.textContent = t('intervalManual');

  if (latestData) {
    renderStatusData(latestData);
  }
  updateCountdownUI();
}

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
}

// Network Check
async function performCheck() {
  if (checkInProgress) return;
  checkInProgress = true;

  refreshBtn.classList.add('spinning');
  btnText.textContent = t('checking');

  try {
    const res = await fetch('/api/status', {
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    latestData = data;
    renderStatusData(data);
  } catch (err) {
    const fallbackData = {
      checkedAt: new Date().toISOString(),
      status: 'offline',
      tcp: { connected: false, latencyMs: null, error: err.message },
      http: { statusCode: null, statusText: null, latencyMs: null, error: err.message }
    };
    latestData = fallbackData;
    renderStatusData(fallbackData);
  } finally {
    checkInProgress = false;
    refreshBtn.classList.remove('spinning');
    btnText.textContent = t('checkNow');
  }
}

function renderStatusData(data) {
  heroCard.className = `liquid-glass-card hero-liquid status-${data.status}`;

  if (data.status === 'online') {
    statusTag.textContent = t('heroTagOnline');
    statusTitle.textContent = t('heroTitleOnline');
    statusDesc.textContent = t('heroDescOnline');

    overallMetric.textContent = t('statusWorking');
    overallMetric.style.color = 'var(--status-online)';
    overallSub.textContent = '163.239.88.115';
  } else if (data.status === 'degraded') {
    statusTag.textContent = t('heroTagDegraded');
    statusTitle.textContent = t('heroTitleDegraded');
    statusDesc.textContent = t('heroDescDegraded');

    overallMetric.textContent = t('statusDegraded');
    overallMetric.style.color = 'var(--status-degraded)';
    overallSub.textContent = '163.239.88.115';
  } else {
    statusTag.textContent = t('heroTagOffline');
    statusTitle.textContent = t('heroTitleOffline');
    statusDesc.textContent = t('heroDescOffline');

    overallMetric.textContent = t('statusNotWorking');
    overallMetric.style.color = 'var(--status-offline)';
    overallSub.textContent = '163.239.88.115';
  }

  const checkDate = new Date(data.checkedAt);
  lastCheckedText.textContent = `${t('lastCheckedPrefix')}${checkDate.toLocaleTimeString()}`;

  // HTTP Metric
  if (data.http && data.http.statusCode) {
    httpMetric.textContent = `${data.http.statusCode}`;
    httpMetric.style.color = data.http.statusCode < 400 ? 'var(--status-online)' : 'var(--status-degraded)';
    httpSub.textContent = data.http.statusText || 'HTTP OK';
  } else {
    httpMetric.textContent = t('timeoutText');
    httpMetric.style.color = 'var(--status-offline)';
    httpSub.textContent = t('metricHttpWait');
  }

  // TCP Metric
  if (data.tcp && data.tcp.connected) {
    tcpMetric.textContent = t('openText');
    tcpMetric.style.color = 'var(--status-online)';
    tcpSub.textContent = `${data.tcp.latencyMs} ms`;
  } else {
    tcpMetric.textContent = t('closedText');
    tcpMetric.style.color = 'var(--status-offline)';
    tcpSub.textContent = t('metricTcpSub');
  }

  // Latency Metric
  const effectiveLatency = (data.http && data.http.latencyMs) || (data.tcp && data.tcp.latencyMs);
  if (effectiveLatency) {
    latencyMetric.innerHTML = `${effectiveLatency} <span class="unit">ms</span>`;
    latencyMetric.style.color = 'var(--liquid-cyan)';
    latencySub.textContent = t('metricLatencySub');
  } else {
    latencyMetric.innerHTML = `&infin; <span class="unit">ms</span>`;
    latencyMetric.style.color = 'var(--status-offline)';
    latencySub.textContent = t('timeoutText');
  }
}

// Countdown management
function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    if (refreshIntervalSeconds === 0) {
      countdownBar.style.width = '0%';
      countdownLabel.textContent = t('autoPaused');
      return;
    }

    secondsRemaining--;

    if (secondsRemaining <= 0) {
      resetCountdown();
      performCheck();
    } else {
      updateCountdownUI();
    }
  }, 1000);
}

function updateCountdownUI() {
  if (refreshIntervalSeconds === 0) {
    countdownBar.style.width = '0%';
    countdownLabel.textContent = t('autoPaused');
    return;
  }
  const pct = (secondsRemaining / refreshIntervalSeconds) * 100;
  countdownBar.style.width = `${pct}%`;
  countdownLabel.textContent = t('nextCheckIn', { s: secondsRemaining });
}

function resetCountdown() {
  secondsRemaining = refreshIntervalSeconds;
  countdownBar.style.width = '100%';
  updateCountdownUI();
}
