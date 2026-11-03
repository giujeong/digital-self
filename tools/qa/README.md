# tools/qa — 빌드 점검

개발 일이 늘어서 "새 기능이 옛 기능을 조용히 깨는" 사고를 막기 위한 두 겹 점검.

| 점검 | 언제 | 무엇을 잡나 |
|---|---|---|
| `lint.py` | `make.py`가 매번 자동 실행 — 실패하면 빌드가 멈춤 | 같은 id 두 번, 인라인 script 문법 오류 |
| `flow.cjs` | 커밋 전 (playwright 있는 곳: 클로드 작업 환경 · 맥은 아래) | 화면에서 눌러 보고 다음으로 넘어가는지 |

```
python3 tools/qa/lint.py          # 두 앱 tpl.html 점검만
node tools/qa/flow.cjs            # public/ 빌드 후, 레포 루트에서
```

- 생긴 계기 (2026-11-04): kanji v0.27(11-02) 홈 의견 카드 `id="fb"`가 복습 피드백 `id="fb"`와 겹쳐, 답을 고르면 피드백이 숨은 홈 카드에 그려짐 → 복습이 멈춘 것처럼 보임. 두 점검 모두 고치기 전 버전에서 실패함을 확인.
- 번갈아 그려지는 템플릿처럼 일부러 같은 id를 쓰면 `lint.py`의 `ALLOW`에 등록.
- 새 화면·흐름을 만들면 `flow.cjs`에 한 묶음 추가.
- 맥에서 돌리기 (2026-11-04): playwright 를 레포에 넣지 않고(Vercel 빌드가 무거워짐) 레포 밖에 한 번 설치 → `NODE_PATH` 로 연결. 브라우저는 맥의 크롬을 쓴다.
  ```
  npm i --prefix ~/.cache/digital-self-qa playwright@1.48.2
  NODE_PATH=~/.cache/digital-self-qa/node_modules node tools/qa/flow.cjs
  ```
- 이름이 `.cjs` 인 이유: `package.json` 이 `"type": "module"` 이라 `.js` 는 `require` 를 쓸 수 없다 (11-04 맥에서 처음 돌릴 때 발견).
