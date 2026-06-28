# Figure WebP source (canonical drop folder)

외부 AI/CAD 산출 **WebP**를 **검수 통과 후** 이 폴더에 둡니다.

| 항목 | 규칙 |
|------|------|
| 형식 | **WebP only** — PNG 금지 (`technology/` 전체) |
| 해상도 | hero ≥ **1920×1080** |
| 파일명 | `scripts/canonical-image-webp.json` · [docs/118](../docs/118-PNG-canonical-파일명-W1-W11-정본.md) (확장자 `.webp`) |
| 등록 | `npm run register:figure -- --id IMG-### --input 이경로/파일.webp --method ai-reviewed --reviewer "이름" --visual-grade PASS` |
| 워크플로 | [docs/108](../docs/108-PNG-재작도-제작자-마스터-인덱스.md) W1~W11 |

## W1 P0 우선 (즉시)

| ID | 파일명 |
|----|--------|
| IMG-002 | `IMG-002_흙막이-계측-설치-대표-단면도.webp` |
| IMG-096 | `IMG-096_주변지반-계측-설치-대표-단면도_굴착영향권복합.webp` |
| IMG-004 | `IMG-004_어스앵커-하중계-설치-개념도_앵커두부정착구.webp` |

`register:figure`가 동일 WebP를 상위 `technology/` 및 `source/`에 복사합니다.

**PNG 정리:** `python scripts/purge-technology-png.py`
