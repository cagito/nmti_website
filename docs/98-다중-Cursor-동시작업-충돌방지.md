# 다중 Cursor 동시 작업 — 충돌 방지

**등록:** 2026-06-22  
**규칙 ID:** **LOCK-01**  
**적용:** Cursor 2창 이상 · 병렬 에이전트 · FTP 동기 경로

> **한 줄:** 공유 JSON·이미지·빌드 산출물은 **scope 잠금** 후 1세션만 쓰기 — 문서(`docs/`)만 편집 시 잠금 생략 가능.

---

## 1. 충돌이 나는 자원

| Scope | 파일·경로 |典型 작업 |
|-------|-----------|----------|
| **registry** | `scripts/image-review-registry.json` · `canonical-image-png.json` · `figure-production-policy.json` | `patch:registry-*` · `sign:phase-*` |
| **images** | `assets/images/technology/**` | PNG/WebP 교체 · `register:figure` |
| **build** | `js/technology/images.js` · `content-data` 생성물 | `build:images` · `build:content-data` |
| **full** | 위 전부 | Figure 등록 end-to-end |

---

## 2. 사용법

### 상태 확인

```bash
npm run lock:status
```

`held` 가 있으면 해당 scope **쓰기 금지** (다른 Cursor 창이 작업 중).

### 잠금 획득 · 해제

```bash
# registry만 (문서+registry 패치)
npm run lock:acquire -- registry --task "Phase AC patch"

# Figure 등록 전체
npm run lock:acquire -- full --task "IMG-024 register"

# 완료 후
npm run lock:release -- registry
npm run lock:release -- full
```

### 창별 식별 (권장)

PowerShell — **창마다 다른 값**:

```powershell
$env:CURSOR_LOCK_OWNER = "cursor-window-A"
```

잠금 파일: `.cursor/locks/<scope>.lock` (git 미추적 · 로컬 전용)

---

## 3. 에이전트·개발자 규칙

1. **쓰기 전** `lock:status`
2. busy → **중단** · 사용자에게 다른 창 `lock:release` 요청
3. Figure **한 ID는 한 창**에서만 재작도
4. `verify:local` / `build:all` 은 **full** 잠금 권장
5. 문서만 수정 시 잠금 **선택** (단, 같은 문서 동시 편집은 Git으로 해결)

`.cursor/rules/multi-cursor-coordination.mdc` — 에이전트 **alwaysApply**

---

## 4. 자동 잠금 (스크립트 · 훅 · atomic-write)

### 4.1 스크립트 (`runLocked` + `atomicWriteUtf8`)

| 스크립트 | Scope |
|----------|-------|
| `patch-registry-phase-*.mjs` · `patch-registry-img096-v4.mjs` | `registry` |
| `register-external-figure.mjs` | `full` |
| `generate-image-assets.mjs` | `build` |
| `build-content-data.mjs` | `build` |

`atomicWriteUtf8` — 다른 세션이 scope 잠금 중이면 **즉시 throw** (`assertWriteAllowed`).

CI 전용 우회: `CURSOR_LOCK_BYPASS=1` 또는 스크립트 `--no-lock`

### 4.2 Cursor hooks (`.cursor/hooks.json`)

| 이벤트 | 동작 |
|--------|------|
| `sessionStart` | 현재 lock 상태를 세션 컨텍스트에 주입 |
| `beforeShellExecution` | `patch-registry`·`build:images` 등 — **다른 창 잠금 시 deny** |
| `preToolUse` | `Write`/`StrReplace`/`Delete` on guarded paths — **다른 창 잠금 시 deny** |

**hooks 로드:** Cursor 재시작 또는 `hooks.json` 저장 후 Hooks 탭 확인.

### 4.3 보호 경로 (`scripts/lib/guarded-paths.mjs`)

- `registry` — `image-review-registry.json` · `canonical-image-png.json` · `figure-production-policy.json`
- `build` — `js/technology/images.js` · `content-data.js`
- `images` — `assets/images/technology/**`

---

## 5. Stale · 강제 해제

| 상황 | 조치 |
|------|------|
| TTL 120분 경과 | 자동 steal 가능 |
| pid 종료 | steal 가능 |
| 비정상 종료로 lock 잔류 | `npm run lock:release -- registry -- --force` |
| 전부 초기화 | `npm run lock:release-all` |

---

## 6. Phase 작업 분할 예 (Phase AC)

| Cursor 창 A | Cursor 창 B |
|-------------|-------------|
| 문서 92~96 편집 (lock 없음) | — |
| `lock:full` + IMG-024 PNG | `lock:status` 대기 |
| `lock:release` | `lock:full` + IMG-033 |
| 검수 문서만 | `build:images` (build lock) |

**동일 IMG-024를 두 창에서 재작도 금지.**

---

## 7. 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-06-22 | LOCK-01 · workspace-lock.mjs · 규칙 · 스크립트 연동 |
| 2026-06-26 | hooks.json · guarded-paths · atomic-write 차단 · patch 전체 runLocked |
