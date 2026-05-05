# 📅 일정 관리 앱 — 설정 가이드

## 파일 구성

```
calendar-app/
├── index.html      ← 메인 앱
├── sw.js           ← Service Worker (PWA/알림)
├── manifest.json   ← PWA 설정
├── icon-72.png     ← 앱 아이콘 (소)
├── icon-192.png    ← 앱 아이콘 (중)
└── icon-512.png    ← 앱 아이콘 (대)
```

---

## ① 구글 캘린더 연동 설정

### 1. Google Cloud Console에서 프로젝트 생성
1. https://console.cloud.google.com 접속
2. 새 프로젝트 생성 (예: `my-calendar-app`)
3. **API 및 서비스 > 라이브러리** 에서 **Google Calendar API** 활성화

### 2. OAuth 2.0 클라이언트 ID 발급
1. **API 및 서비스 > 사용자 인증 정보** 이동
2. **사용자 인증 정보 만들기 > OAuth 클라이언트 ID** 클릭
3. 애플리케이션 유형: **웹 애플리케이션**
4. 승인된 JavaScript 출처: `http://localhost:8080` (또는 실제 배포 URL)
5. 승인된 리디렉션 URI: `http://localhost:8080` 추가
6. 생성 후 **클라이언트 ID** 복사

### 3. API 키 발급
1. **사용자 인증 정보 만들기 > API 키** 클릭
2. 생성된 API 키 복사
3. API 키 제한: **Google Calendar API** 만 허용 (보안 강화)

### 4. index.html에 적용
```javascript
// index.html 상단 CONFIG 섹션 수정
const CLIENT_ID = '여기에-클라이언트-ID-붙여넣기';
const API_KEY = '여기에-API-키-붙여넣기';
const DEMO_MODE = false; // 반드시 false로 변경
```

---

## ② 앱 실행

### 로컬 실행 (개발)
```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .

# 브라우저에서 열기
open http://localhost:8080
```

> ⚠️ `file://` 프로토콜로 직접 열면 Service Worker가 동작하지 않습니다. 반드시 HTTP 서버를 통해 실행하세요.

### 배포 (추천)
- **Netlify**: 폴더를 드래그앤드롭으로 배포 (무료)
  → https://app.netlify.com/drop
- **Vercel**: `npx vercel` 명령 실행
- **GitHub Pages**: 저장소에 푸시 후 Pages 활성화

---

## ③ 스마트폰 잠금화면 알림 설정

### Android (Chrome)
1. 앱을 Chrome에서 열기
2. 브라우저 메뉴 **> 홈 화면에 추가**
3. 홈 화면의 앱 아이콘으로 실행
4. 첫 실행 시 **알림 허용** 클릭
5. ✅ 이후 잠금화면에서 일정 알림 수신

### iPhone (Safari)
1. Safari에서 앱 열기
2. 공유 버튼 **> 홈 화면에 추가**
3. 홈 화면 아이콘으로 앱 실행
4. **설정 > 알림 > 일정관리** 에서 알림 허용
5. ✅ iOS 16.4+ 에서 잠금화면 알림 지원

---

## ④ 기능 요약

| 기능 | 설명 |
|------|------|
| 구글 캘린더 연동 | OAuth 2.0으로 안전하게 연결 |
| 실시간 동기화 | 60초마다 자동 동기화 |
| 주간/일간/목록 보기 | 3가지 뷰 전환 |
| 일정 추가/수정 | 색상, 장소, 메모 지원 |
| 알림 시간 설정 | 10분/30분/1시간 전 선택 |
| PWA | 홈 화면 설치, 오프라인 지원 |
| 잠금화면 알림 | 브라우저 Web Notification API |

---

## ⑤ 알림이 오지 않을 때 확인사항

1. 브라우저 알림 권한 허용 여부 확인  
   → 주소창 왼쪽 자물쇠 아이콘 클릭 > 알림 허용
2. 스마트폰 설정에서 해당 브라우저(Chrome/Safari)의 알림 허용 확인
3. 방해 금지 모드 해제 확인
4. 앱을 PWA로 설치한 경우 홈 화면 아이콘으로 실행

---

## 기술 스택

- **Frontend**: Vanilla HTML/CSS/JS (프레임워크 없음, 즉시 실행 가능)
- **인증**: Google OAuth 2.0 (암묵적 흐름)
- **API**: Google Calendar API v3
- **알림**: Web Notifications API + Service Worker Push API
- **오프라인**: Service Worker Cache API + Background Sync
- **PWA**: Web App Manifest
