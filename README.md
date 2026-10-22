# Heose10.github.io

허세준 게임 기획 포트폴리오 사이트 — https://heose10.github.io

## 구조

```
index.html            본문 (섹션: about / projects / play / skills / ai / contact)
assets/css/style.css  스타일 (색상은 :root 변수에서 변경)
assets/js/main.js     미디어 슬롯 렌더링, 메뉴, 스크롤 효과
```

## 이미지 · 영상 · 문서 넣기

모든 자료 자리는 아래 형태의 슬롯입니다. `data-src`가 비어 있으면 "준비 중" 레이아웃이 보입니다.

```html
<div class="media" data-type="video" data-title="월하일검 트레일러" data-src=""></div>
```

| data-type | data-src 예시 |
|-----------|---------------|
| `video`   | `https://youtu.be/XXXXXXXXXXX` (유튜브) 또는 `assets/video/play.mp4` |
| `image`   | `assets/img/wolha/key-art.jpg` |
| `doc`     | `assets/docs/spear-combat.pdf` |

비율은 `data-ratio="4 / 3"`처럼 바꿀 수 있습니다. (기본 16 / 9)

## 준비 중 링크

`data-pending="이력서 PDF"`가 붙은 버튼은 클릭 시 "준비 중" 알림만 띄웁니다.
파일이 준비되면 `href`에 경로를 넣고 `data-pending` 속성을 지우세요.
