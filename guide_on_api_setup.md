# API & External Services Setup

이 사이트는 두 가지 외부 API를 사용합니다.

---

## 1. YouTube Data API v3 (플레이리스트 트랙 목록)

`<YouTubePlaylist>` 컴포넌트가 플레이리스트의 트랙 목록을 가져올 때 사용합니다.  
API 키가 없으면 기본 YouTube 플레이어로 fallback 됩니다.

### 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 또는 새 프로젝트 생성
3. **APIs & Services → Library** → "YouTube Data API v3" 검색 → Enable
4. **APIs & Services → Credentials → Create Credentials → API key**
5. (권장) 키 제한: Application restrictions → None, API restrictions → YouTube Data API v3

### 로컬 개발

`.env` 파일에 추가:

```
YOUTUBE_API_KEY=여기에_키_붙여넣기
```

### GitHub Actions (배포)

1. GitHub 저장소 → **Settings → Secrets and variables → Actions**
2. **New repository secret**
   - Name: `YOUTUBE_API_KEY`
   - Secret: 발급받은 키
3. `.github/workflows/deploy.yml`에 이미 설정되어 있음:
   ```yaml
   - run: npm run build
     env:
       YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}
   ```

---

## 2. Umami Analytics (방문자 통계)

홈 우측 하단 버튼 → 팝업 지도에서 국가별 방문자 통계를 표시합니다.

### 계정 정보

| 항목 | 값 |
|------|-----|
| 대시보드 | [app.umami.is](https://app.umami.is) |
| 리전 | EU |
| Website ID | `5979ffcd-d67f-45c4-8f87-941ee6f62d04` |
| API 엔드포인트 | `https://api.umami.is/v1` |

### 트래킹 스크립트

`BaseLayout.astro`에 이미 추가되어 있음 — 별도 설정 불필요.

### API 키 교체 방법

API 키가 변경되면 `src/components/StatsMap.tsx` 상단의 상수만 수정:

```ts
const API_KEY = 'api_새로운_키';
```

### API 키 재발급

1. [app.umami.is](https://app.umami.is) 로그인
2. 우측 상단 프로필 → **API Keys**
3. **Create API key**

---

## 요약

| 서비스 | 용도 | 키 위치 |
|--------|------|---------|
| YouTube Data API v3 | YouTubePlaylist 트랙 목록 | `.env` + GitHub Secret |
| Umami | 방문자 통계 지도 | `src/components/StatsMap.tsx` |
