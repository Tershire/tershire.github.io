# Embedding Media in Articles

All components are available in every article page (projects, blog, hobbies, music) without importing.

---

## YouTube

```mdx
{/* URL 그대로 붙여넣기 */}
<YouTube url="https://www.youtube.com/watch?v=cMy0Gimlym4" />

{/* 플레이리스트 포함 URL */}
<YouTube url="https://www.youtube.com/watch?v=cMy0Gimlym4&list=PLyumZZbmy3MBbKcHNV5G3LMS0Ns2BVU0B" />

{/* 시작 시간 지정 (URL의 t= 파라미터 자동 파싱) */}
<YouTube url="https://www.youtube.com/watch?v=cMy0Gimlym4&t=1m30s" />

{/* 시작 시간 수동 지정 (초 단위) */}
<YouTube id="dQw4w9WgXcQ" start={90} />
```

- `url` — YouTube URL 그대로 붙여넣기. 영상 / 플레이리스트 / 영상+플레이리스트 모두 파싱됨
- `id` — video ID 직접 지정
- `start` — 시작 시간 (초). URL에 `t=` 파라미터가 있으면 자동으로 파싱됨
- 시간 형식: `90`, `1m30s`, `1h2m3s` 모두 지원

---

## Spotify

```mdx
{/* 앨범 전체 (트랙리스트 포함, 기본 높이) */}
<SpotifyEmbed url="https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy" />

{/* 단일 곡 (compact 모드) */}
<SpotifyEmbed url="https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3" compact />
```

- `url` — Spotify 공유 URL 그대로 붙여넣기 (앨범, 트랙, 플레이리스트)
- `compact` — 높이를 줄인 플레이어 (기본: false)

---

## Apple Music

```mdx
<AppleMusicEmbed url="https://music.apple.com/kr/album/album-name/1234567890" />
<AppleMusicEmbed url="https://music.apple.com/kr/album/album-name/1234567890" compact />
```

- `url` — Apple Music 공유 URL 그대로 붙여넣기
- `compact` — 높이를 줄인 플레이어 (기본: false)

---

## Images

`public/images/` 아래에 파일을 넣고 절대 경로로 참조:

```mdx
![설명](/images/projects/my-figure.jpg)
```

---

## Thumbnails for tiles/cards

썸네일은 인덱스 페이지(projects, music reviews, papers)의 카드에 표시됩니다.

### Projects & Papers

`data/projects.ts` 또는 `data/papers.ts`에서 `image` 지정:

```ts
{
  image: '/images/projects/tfp-slam.jpg',
}
```

### Music

우선순위: `image` > `spotifyUrl` > `appleMusicUrl` > `youtubeUrl`

**수동 지정:**
```yaml
---
image: '/images/music/chega-de-saudade.jpg'
---
```

**Spotify에서 자동 추출** (빌드타임에 앨범 커버 fetch):
```yaml
---
spotifyUrl: 'https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy'
---
```

**Apple Music에서 자동 추출:**
```yaml
---
appleMusicUrl: 'https://music.apple.com/kr/album/album-name/1234567890'
---
```

**YouTube 썸네일 자동 추출** (API 호출 없이 즉시 적용):
```yaml
---
youtubeUrl: 'https://www.youtube.com/watch?v=cMy0Gimlym4'
---
```
