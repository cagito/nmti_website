#!/usr/bin/env node
/**
 * Pillow figure pipeline was removed. Use GenerateImage + register:figure only.
 * See docs/16-기술자료-이미지-에이전트-SVG-생성-금지.md · AGENTS.md
 */
console.error('BLOCKED: Pillow render pipeline removed (2026-06-29).');
console.error('Use: ImageWorks prompt → GenerateImage → npm run register:figure -- --method ai-reviewed');
console.error('Docs: docs/122-Pillow-와이어프레임-Figure-출판품질-통합-수정계획.md (historical)');
process.exit(2);
