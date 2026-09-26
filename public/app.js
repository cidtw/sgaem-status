// SGAEM Archive Status Monitor - Frontend Logic
const translations = {
  'ko-kr': {
    brandBadge: '실시간 모니터링',
    pageTitle: 'SGAEM 아카이브 상태',
    docTitle: 'SGAEM 아카이브 상태 모니터',
    targetLabel: '대상:',
    intervalLabel: '주기:',
    intervalManual: '수동',
    checkNow: '지금 확인',
    checking: '확인 중...',
    nextCheckIn: '다음 확인까지 {s}초',
    autoPaused: '자동 갱신 일시정지',
    lastCheckedPrefix: '마지막 확인: ',
    justNow: '방금 전',
    heroTagChecking: '연결 확인 중...',
    heroTitleChecking: '엔드포인트 연결 시도 중',
    heroDescChecking: 'TCP 소켓 핸드셰이크 및 HTTP 요청을 테스트하고 있습니다...',
    heroTagOnline: '시스템 정상 가동',
    heroTitleOnline: '온라인 및 정상 응답',
    heroDescOnline: '엔드포인트가 HTTP 및 TCP 요청에 원활하게 응답하고 있습니다.',
    heroTagDegraded: '성능 저하 감지',
    heroTitleDegraded: '포트 열림 / HTTP 오류',
    heroDescDegraded: 'TCP 포트는 열려 있으나 HTTP 서버 응답에 문제가 있습니다.',
    heroTagOffline: '오프라인 / 연결 불가',
    heroTitleOffline: '연결 실패',
    heroDescOffline: '연결 시간이 초과되었습니다. 패킷이 차단되었거나 서버가 오프라인입니다.',
    metricHttp: 'HTTP 상태',
    metricTcp: 'TCP 3536 포트',
    metricLatency: '지연 시간 (RTT)',
    metricUptime: '세션 가동률',
    metricHttpWait: '응답 대기 중',
    metricTcpSub: '소켓 연결 테스트',
    metricLatencySub: '왕복 응답 속도',
    metricUptimeSub: '{total}회 검사 완료',
    timelineTitle: '최근 검사 이력',
    timelineCount: '{count}회 기록됨',
    logTitle: '상세 로그',
    clearLog: '기록 삭제',
    colTimestamp: '타임스탬프',
    colStatus: '상태',
    colTcp: 'TCP (3536)',
    colHttp: 'HTTP 코드',
    colLatency: '지연시간',
    colDiagnostics: '진단 내용',
    emptyLog: '기록된 내역이 없습니다.',
    firstCheckWait: '기록된 내역이 없습니다. 첫 번째 검사를 시작합니다...',
    infoTitle: '네트워크 및 인프라 안내',
    info1: '<strong>검사 위치:</strong> Vercel 글로벌 엣지 / 서버리스 네트워크 (Node.js 런타임).',
    info2: '<strong>서강대학교 방화벽:</strong> <code>163.239.88.115</code>는 서강대학교 네트워크에 위치합니다. <code>3536</code>과 같은 비표준 포트에 대한 외부 인바운드 트래픽은 학내 보안 방화벽 정책에 의해 차단될 수 있으며, <strong>서강대학교 SSL-VPN</strong> 연결이 필요할 수 있습니다.',
    info3: '<strong>엔드포인트 검증:</strong> 매 주기마다 <code>3536</code> 포트 TCP 소켓 연결과 HTTP GET 요청을 함께 실행하여 서비스 가용성을 다각도로 검증합니다.',
    footerText: 'SGAEM 아카이브 상태 모니터 • Vercel 배포됨 • 30초 주기 확인',
    statusOnline: '온라인',
    statusDegraded: '성능 저하',
    statusOffline: '오프라인',
    openText: '열림',
    closedText: '닫힘/초과',
    timeoutText: '시간 초과',
    diagOffline: '엔드포인트에 연결할 수 없습니다. 패킷이 드롭되었거나 서강대 방화벽/VPN 정책에 의해 차단되었습니다.',
    diagOnline: '엔드포인트가 정상적으로 작동하며 HTTP 요청에 응답하고 있습니다.',
    diagDegraded: '3536 포트는 열려 있으나 HTTP 응답에 오류가 발생했습니다.'
  },
  'en': {
    brandBadge: 'LIVE MONITOR',
    pageTitle: 'SGAEM Archive Status',
    docTitle: 'SGAEM Archive Status Monitor',
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
    heroTitleChecking: 'Connecting to Endpoint',
    heroDescChecking: 'Performing TCP handshake and HTTP verification...',
    heroTagOnline: 'SYSTEM OPERATIONAL',
    heroTitleOnline: 'Online & Responding',
    heroDescOnline: 'Endpoint is responding normally to HTTP and TCP requests.',
    heroTagDegraded: 'DEGRADED PERFORMANCE',
    heroTitleDegraded: 'Port Open, HTTP Error',
    heroDescDegraded: 'Socket connected, but HTTP server returned an unexpected error.',
    heroTagOffline: 'OFFLINE / UNREACHABLE',
    heroTitleOffline: 'No Connection',
    heroDescOffline: 'Connection timed out. Target dropped packets or campus firewall blocked access.',
    metricHttp: 'HTTP Status',
    metricTcp: 'TCP Port 3536',
    metricLatency: 'Latency (RTT)',
    metricUptime: 'Session Uptime',
    metricHttpWait: 'Waiting for response',
    metricTcpSub: 'Socket test',
    metricLatencySub: 'Round-trip time',
    metricUptimeSub: '{total} checks recorded',
    timelineTitle: 'Recent Checks History',
    timelineCount: '{count} checks recorded',
    logTitle: 'Detailed Log',
    clearLog: 'Clear History',
    colTimestamp: 'Timestamp',
    colStatus: 'Status',
    colTcp: 'TCP (3536)',
    colHttp: 'HTTP Code',
    colLatency: 'Latency',
    colDiagnostics: 'Diagnostics',
    emptyLog: 'No checks recorded yet.',
    firstCheckWait: 'No checks recorded yet. Initiating first check...',
    infoTitle: 'Network & Architecture Notes',
    info1: '<strong>Checked From:</strong> Vercel Global Edge / Serverless Network via Node.js runtime.',
    info2: '<strong>Sogang University Firewall:</strong> <code>163.239.88.115</code> belongs to Sogang University. Inbound external requests to non-standard ports like <code>3536</code> are typically restricted by campus border firewalls unless explicitly white-listed or accessed via <strong>Sogang SSL-VPN</strong>.',
    info3: '<strong>Endpoint Verification:</strong> Each check attempts a low-level TCP socket connection to port <code>3536</code> and sends an HTTP GET request to verify application layer response.',
    footerText: 'SGAEM Archive Status Monitor • Deployed on Vercel • Checked every 30 seconds',
    statusOnline: 'ONLINE',
    statusDegraded: 'DEGRADED',
    statusOffline: 'OFFLINE',
    openText: 'OPEN',
    closedText: 'CLOSED',
    timeoutText: 'TIMEOUT',
    diagOffline: 'Endpoint unreachable. Packets dropped or blocked by firewall (e.g. Sogang campus network / VPN requirement).',
    diagOnline: 'Target endpoint is reachable and responding to HTTP requests.',
    diagDegraded: 'Port 3536 is open, but HTTP request failed.'
  },
  'cn': {
    brandBadge: '实时监控',
    pageTitle: 'SGAEM 档案库状态',
    docTitle: 'SGAEM 档案库状态监控',
    targetLabel: '目标:',
    intervalLabel: '周期:',
    intervalManual: '手动',
    checkNow: '立即检测',
    checking: '检测中...',
    nextCheckIn: '距离下次检测还有 {s} 秒',
    autoPaused: '自动刷新已暂停',
    lastCheckedPrefix: '上次检测时间: ',
    justNow: '刚刚',
    heroTagChecking: '检测中...',
    heroTitleChecking: '正在连接端点',
    heroDescChecking: '正在执行 TCP 握手与 HTTP 请求验证...',
    heroTagOnline: '系统运行正常',
    heroTitleOnline: '在线且响应正常',
    heroDescOnline: '端点对 HTTP 和 TCP 请求响应完全正常。',
    heroTagDegraded: '服务性能降低',
    heroTitleDegraded: '端口已开放，HTTP 异常',
    heroDescDegraded: 'TCP 套接字已连接，但 HTTP 服务器返回了异常状态。',
    heroTagOffline: '离线 / 无法连接',
    heroTitleOffline: '连接失败',
    heroDescOffline: '连接超时。数据包已丢失或被校园网防火墙拦截。',
    metricHttp: 'HTTP 状态',
    metricTcp: 'TCP 3536 端口',
    metricLatency: '延迟 (RTT)',
    metricUptime: '本次会话正常率',
    metricHttpWait: '等待响应',
    metricTcpSub: '套接字测试',
    metricLatencySub: '往返时间',
    metricUptimeSub: '已完成 {total} 次检测',
    timelineTitle: '最近检测历史',
    timelineCount: '已记录 {count} 条',
    logTitle: '详细日志',
    clearLog: '清除历史',
    colTimestamp: '时间戳',
    colStatus: '状态',
    colTcp: 'TCP (3536)',
    colHttp: 'HTTP 状态码',
    colLatency: '延迟',
    colDiagnostics: '诊断信息',
    emptyLog: '暂无检测记录。',
    firstCheckWait: '暂无检测记录。正在开始首次检测...',
    infoTitle: '网络与架构说明',
    info1: '<strong>检测来源:</strong> Vercel 全球边缘 / 无服务器网络 (Node.js 运行时)。',
    info2: '<strong>西江大学防火墙:</strong> <code>163.239.88.115</code> 属于韩国西江大学。对非标端口（如 <code>3536</code>）的外部入站请求通常受到校园边界防火墙的严格限制，可能需要通过<strong>西江大学 SSL-VPN</strong> 访问。',
    info3: '<strong>端点验证机制:</strong> 每次检测均会尝试建立到端口 <code>3536</code> 的底层 TCP 连接，并发起 HTTP GET 请求以验证应用层响应。',
    footerText: 'SGAEM 档案库状态监控 • 部署于 Vercel • 每 30 秒自动检测',
    statusOnline: '在线',
    statusDegraded: '降级',
    statusOffline: '离线',
    openText: '开放',
    closedText: '关闭/超时',
    timeoutText: '超时',
    diagOffline: '无法连接到端点。数据包丢失或被西江大学防火墙/VPN策略拦截。',
    diagOnline: '目标端点可访问且正常响应 HTTP 请求。',
    diagDegraded: '3536 端口已开放，但 HTTP 请求异常。'
  }
};

// State variables
let currentLang = localStorage.getItem('status_lang') || 'ko-kr';
let currentTheme = localStorage.getItem('status_theme') || 'system';
let history = [];
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

const langSelect = document.getElementById('langSelect');
const themeButtons = document.querySelectorAll('.theme-btn');

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

  // Listen to OS theme changes if on 'system' mode
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

  // Update page title
  document.title = t('docTitle');

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update all data-i18n-html elements
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });

  // Update interval select manual option
  const manualOpt = intervalSelect.querySelector('option[value="0"]');
  if (manualOpt) manualOpt.textContent = t('intervalManual');

  // Re-render UI with new language
  if (latestData) {
    renderStatusData(latestData);
  }
  updateHistoryUI();
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

  clearLogBtn.addEventListener('click', () => {
    history = [];
    updateHistoryUI();
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
    handleCheckResult(data);
  } catch (err) {
    const fallbackData = {
      checkedAt: new Date().toISOString(),
      status: 'offline',
      tcp: { connected: false, latencyMs: null, error: err.message },
      http: { statusCode: null, statusText: null, latencyMs: null, error: err.message },
      diagnostics: err.message
    };
    latestData = fallbackData;
    handleCheckResult(fallbackData);
  } finally {
    checkInProgress = false;
    refreshBtn.classList.remove('spinning');
    btnText.textContent = t('checkNow');
  }
}

function handleCheckResult(data) {
  history.unshift(data);
  if (history.length > 50) history.pop();

  renderStatusData(data);
  updateHistoryUI();
}

function renderStatusData(data) {
  heroCard.className = `hero-status card status-${data.status}`;

  if (data.status === 'online') {
    statusTag.textContent = t('heroTagOnline');
    statusTitle.textContent = t('heroTitleOnline');
    statusDesc.textContent = t('diagOnline');
  } else if (data.status === 'degraded') {
    statusTag.textContent = t('heroTagDegraded');
    statusTitle.textContent = t('heroTitleDegraded');
    statusDesc.textContent = t('diagDegraded');
  } else {
    statusTag.textContent = t('heroTagOffline');
    statusTitle.textContent = t('heroTitleOffline');
    statusDesc.textContent = t('diagOffline');
  }

  const checkDate = new Date(data.checkedAt);
  lastCheckedText.textContent = `${t('lastCheckedPrefix')}${checkDate.toLocaleTimeString()}`;

  // HTTP Metric
  if (data.http && data.http.statusCode) {
    httpMetric.textContent = `${data.http.statusCode}`;
    httpMetric.style.color = data.http.statusCode < 400 ? 'var(--color-online)' : 'var(--color-degraded)';
    httpSub.textContent = data.http.statusText || 'HTTP OK';
  } else {
    httpMetric.textContent = t('timeoutText');
    httpMetric.style.color = 'var(--color-offline)';
    httpSub.textContent = t('metricHttpWait');
  }

  // TCP Metric
  if (data.tcp && data.tcp.connected) {
    tcpMetric.textContent = t('openText');
    tcpMetric.style.color = 'var(--color-online)';
    tcpSub.textContent = `${data.tcp.latencyMs} ms`;
  } else {
    tcpMetric.textContent = t('closedText');
    tcpMetric.style.color = 'var(--color-offline)';
    tcpSub.textContent = t('metricTcpSub');
  }

  // Latency Metric
  const effectiveLatency = (data.http && data.http.latencyMs) || (data.tcp && data.tcp.latencyMs);
  if (effectiveLatency) {
    latencyMetric.innerHTML = `${effectiveLatency} <span class="unit">ms</span>`;
    latencyMetric.style.color = 'var(--text-main)';
    latencySub.textContent = t('metricLatencySub');
  } else {
    latencyMetric.innerHTML = `&infin; <span class="unit">ms</span>`;
    latencyMetric.style.color = 'var(--color-offline)';
    latencySub.textContent = t('timeoutText');
  }

  // Session Uptime
  const total = history.length;
  const onlineCount = history.filter(h => h.status === 'online').length;
  const uptimeRate = total > 0 ? ((onlineCount / total) * 100).toFixed(0) : '0';
  uptimeMetric.innerHTML = `${uptimeRate}<span class="unit">%</span>`;
  uptimeSub.textContent = t('metricUptimeSub', { total });
}

function updateHistoryUI() {
  historyCount.textContent = t('timelineCount', { count: history.length });

  // Timeline pills
  if (history.length === 0) {
    timelineBar.innerHTML = `<span style="color:var(--text-dim);font-size:0.75rem;padding:4px;">${t('emptyLog')}</span>`;
  } else {
    const reversed = [...history].reverse();
    timelineBar.innerHTML = reversed.map(item => {
      const date = new Date(item.checkedAt).toLocaleTimeString();
      const statusLabel = item.status === 'online' ? t('statusOnline') : (item.status === 'degraded' ? t('statusDegraded') : t('statusOffline'));
      return `<div class="timeline-pill ${item.status}" title="[${date}] ${statusLabel}"></div>`;
    }).join('');
  }

  // Detailed Log Table
  if (history.length === 0) {
    logTableBody.innerHTML = `<tr class="empty-row"><td colspan="6">${t('emptyLog')}</td></tr>`;
  } else {
    logTableBody.innerHTML = history.map(item => {
      const date = new Date(item.checkedAt).toLocaleTimeString();
      const statusLabel = item.status === 'online' ? t('statusOnline') : (item.status === 'degraded' ? t('statusDegraded') : t('statusOffline'));
      const statusBadge = `<span class="badge badge-${item.status}">${statusLabel}</span>`;
      const tcpCol = item.tcp && item.tcp.connected ? `<span style="color:var(--color-online)">${t('openText')} (${item.tcp.latencyMs}ms)</span>` : `<span style="color:var(--color-offline)">${t('closedText')}</span>`;
      const httpCol = item.http && item.http.statusCode ? `<code>${item.http.statusCode}</code>` : `<span style="color:var(--color-offline)">${t('timeoutText')}</span>`;
      const latCol = ((item.http && item.http.latencyMs) || (item.tcp && item.tcp.latencyMs)) ? `${(item.http && item.http.latencyMs) || item.tcp.latencyMs} ms` : 'N/A';
      const diagCol = item.status === 'online' ? t('diagOnline') : (item.status === 'degraded' ? t('diagDegraded') : t('diagOffline'));

      return `
        <tr>
          <td><span style="font-family:var(--font-mono);font-size:0.8rem">${date}</span></td>
          <td>${statusBadge}</td>
          <td>${tcpCol}</td>
          <td>${httpCol}</td>
          <td>${latCol}</td>
          <td style="font-size:0.8rem;color:var(--text-dim);max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${diagCol}">${diagCol}</td>
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
