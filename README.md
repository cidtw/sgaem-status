# SGAEM 아카이브 상태 모니터

SGAEM 아카이브 서버(`sgaemarchive.sogang.ac.kr`)가 살아 있는지 TCP 연결과 HTTP 응답으로 확인해 보여 주는 작은 상태 페이지입니다.

## 구성

| 경로 | 역할 |
| --- | --- |
| `api/status.js` | 상태 확인 API (Vercel 서버리스 함수). TCP 연결(2.5초)과 HTTP GET(3초)을 동시에 시도해 `online` / `degraded` / `offline`을 판정합니다. |
| `public/` | 상태 페이지 UI (`index.html`, `app.js`, `styles.css`). `/api/status`를 주기적으로 호출합니다. |
| `server.js` | 로컬 실행용 HTTP 서버. `/api/status`와 `public/` 정적 파일을 제공합니다(`public/` 밖 경로는 403). |
| `test/` | `node:test` 단위 테스트 |

## 실행

```bash
npm start          # http://localhost:3000 (PORT로 변경 가능)
npm test
```

외부 의존성은 없습니다(Node.js 표준 라이브러리만 사용).

## 환경 변수 (선택)

설정하지 않으면 `api/status.js`의 `DEFAULT_TARGET` 값을 사용합니다.

| 변수 | 의미 |
| --- | --- |
| `STATUS_TARGET_IP` | 확인할 서버 IP |
| `STATUS_TARGET_PORT` | 확인할 포트 (1–65535) |
| `STATUS_TARGET_HOSTNAME` | HTTP 요청의 `Host` 헤더에 쓸 호스트명 |

> 참고: 상태 페이지 UI(`public/index.html`, `public/app.js`)에도 대상 주소가 표시용으로 적혀 있습니다. 대상 주소를 바꾸면 UI 문구도 함께 바꿔야 합니다.

## 배포

Vercel에 그대로 배포합니다. `public/`은 정적 파일로, `api/status.js`는 서버리스 함수로 서빙되며, `vercel.json`이 `/api/*`에 no-cache 헤더를 붙입니다.

## 라이선스

MIT — [LICENSE](LICENSE)
