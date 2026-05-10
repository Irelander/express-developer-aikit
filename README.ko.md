# express-developer-aikit

[Read in English](./README.md)

Adobe Express add-on을 AI 보조 워크플로우로 개발할 때, 공식 MCP만으로는 해결되지 않는 부분을 보완하는 CLI이자 skill kit입니다.

## 개요

![Overview](./docs/assets/images/developer-aikit-overview.png)

## 왜 만들었나

공식 Adobe Express MCP가 나왔지만, 그것만으로 add-on을 개발하다 보면 몇 가지 페인포인트가 남습니다.

**1. MCP만 쓰면 컨텍스트가 비효율적입니다**
LLM에 모든 정보를 한꺼번에 던지면 대화가 길어질수록 답변 정확도가 떨어집니다. 이 도구는 상황에 맞는 reference만 그때그때 로드하도록 skill을 구성합니다. 같은 컨텍스트 예산으로도 답변 퀄리티를 유지할 수 있습니다.

**2. 어떤 add-on을 만들지 정하는 게 가장 어렵습니다**
실제로 가장 큰 페인포인트는 코딩이 아니라 "뭘 만들지"를 정하는 단계입니다. 이미 어떤 add-on이 있는지, 지금 사용자에게 어떤 게 필요한지 파악하지 않으면 만들어도 쓰일 데가 없습니다. 그래서 marketplace 트렌드 스캔과 아이디어 브레인스토밍 skill을 처음부터 한 세트로 묶어두었고, 더 넓은 overlap 체크가 필요한 경우를 위해 snapshot 조회도 함께 두었습니다.

**3. 릴리즈 전 가이드라인 체크는 문서를 다 읽어야만 가능합니다**
Adobe Express add-on 제출 가이드라인은 분량이 많고 체크 항목도 흩어져 있습니다. 문서를 처음부터 끝까지 읽지 않아도 자주 놓치는 항목과 reject 패턴을 짚어주는 skill로 이 부담을 줄였습니다.

## 무엇을 제공하는지

위 세 페인포인트에 각각 대응되는 기능 묶음입니다.

| 페인포인트 | 해결 도구 |
|---|---|
| 컨텍스트 효율 + 답변 퀄리티 | `skills install` (progressive reference 구조) |
| 아이디어 결정 | `express-addon-idea-brainstorm` skill + `addons scan` |
| 릴리즈 가이드라인 체크 | `prepare-for-publish` skill |

여기에 공식 MCP를 빠르게 셋업하는 `mcp init`이 더해져, 초기 셋업 시간도 짧아집니다.

## 설치

`npx`로 바로 실행:

```bash
npx express-developer-aikit --help
npx express-developer-aikit skills list
npx express-developer-aikit skills install all --provider cursor
```

전역 설치도 가능:

```bash
npm install -g express-developer-aikit
```

로컬 개발:

```bash
git clone https://github.com/irelander/express-developer-aikit
cd express-developer-aikit
npm run check
npm test
npm start -- --help
```

## 핵심 — Skill

이 CLI의 실제 가치는 skill에 있습니다. 명령어들은 skill을 설치하고 활용하기 위한 도구일 뿐입니다.

### `skills install <name>`

skill은 에이전트가 작업 유형에 맞춰 로드하는 markdown 번들입니다. 한 번에 모든 정보를 컨텍스트에 밀어 넣는 대신, 다음 구조로 필요할 때만 단계적으로 로드합니다.

- **메인 `SKILL.md`** — 언제 써야 하는지, 먼저 뭘 확인해야 하는지, 자주 빠지는 함정, 검증 체크리스트 (짧게 유지)
- **`references/` 디렉터리** — sample walkthrough, decision matrix, code pattern, troubleshooting 매트릭스 등 깊은 자료. 필요한 시점에만 따로 로드

이게 핵심입니다. 모든 reference를 처음부터 컨텍스트에 넣으면 대화가 길어질수록 LLM이 중요한 정보를 잃습니다. 필요한 시점에 reference를 가져오면 같은 컨텍스트 예산으로 더 정확한 답을 얻을 수 있습니다.

skill 자체는 이 저장소의 [`skills/`](./skills) 디렉터리에 실제 markdown 파일로 있습니다. CLI는 편의 도구일 뿐이라, 원하면 GitHub에서 skill 폴더만 받아 provider의 skill 디렉터리에 직접 복사해도 됩니다. Node나 npm은 필요 없습니다.

```bash
express-developer-aikit skills install start-addon --provider cursor
express-developer-aikit skills install edit-document --provider claude-code,vscode
express-developer-aikit skills install all --provider codex --scope user
```

provider별 설치 위치:

| Provider | 경로 |
|---|---|
| Claude Code | `.claude/skills/` |
| Cursor | `.cursor/skills/` |
| VS Code / Copilot | `.github/skills/` |
| Antigravity | `.agents/skills/` |
| Codex | `.agents/skills/` + `agents/openai.yaml` |

`--scope user`로 사용자 전역 설치 가능. `--provider` 없이 실행하면 워크스페이스가 명확히 하나의 provider만 사용하는 경우에만 자동 감지하니, 혼합 환경에서는 명시하는 편이 안전합니다.

Codex는 보통 재시작 없이 새 skill을 인식합니다. Claude Code는 처음 `.claude/skills/`를 만들 때 한 번 재시작이 필요할 수 있습니다.

### `skills list`

번들된 skill 목록과 한 줄 설명을 출력합니다.

## 기본 포함 skill

| Skill | 단계 | 어떤 페인포인트에 대응되는지 |
|---|---|---|
| `express-addon-idea-brainstorm` | Ideation | 아이디어 결정 — 중복 검증, feasibility, 차별화, MVP 자르기 |
| `start-addon` | Setup | 템플릿 / manifest / 런타임 레이아웃 결정 |
| `edit-document` | Implementation | document sandbox 작업 — page, selection, element API |
| `connect-panel-to-document` | Implementation | panel ↔ sandbox 런타임 브리지 설계 |
| `build-panel` | Implementation | Spectrum 기반 panel UI, theme, 상태 설계 |
| `connect-service` | Implementation | OAuth, token lifecycle, 외부 서비스 연동 |
| `import-and-export-assets` | Implementation | drag-and-drop, rendition, export 권한, PPTX |
| `prepare-for-publish` | Release | 릴리즈 전 가이드라인 점검 — rejection 패턴, 브라우저 QA, listing 메타 |

각 skill은 메인 `SKILL.md` + `references/` 디렉터리로 구성되어 progressive reference 패턴을 따릅니다. 그중 페인포인트가 가장 무거운 두 skill을 좀 더 자세히 적어두었습니다.

### `express-addon-idea-brainstorm`

scan 결과를 가지고 아이디어를 세 단계로 점검합니다 — 시장 중복, Adobe Express capability fit, MVP 자르기. `snapshot` 검색과 단건 inspect 명령으로 전체 add-on 목록에서 필요한 부분만 좁게 가져오고, 추천을 내놓기 전에 Adobe Express runtime model 기준의 feasibility pass도 거치도록 유도합니다. panel UI, document sandbox, OAuth, import/export, publish-review 같은 제약이 걸리면 기존 implementation skill reference로 연결해서 더 현실적인 추천이 나오도록 했습니다. snapshot 조회는 GitHub 공개 저장소에서 이루어지고, 결과에는 날짜 / 버전 메타데이터가 함께 붙습니다.

### `prepare-for-publish`

Adobe Express add-on 제출 가이드라인은 양이 많고, 자주 reject되는 패턴이 여러 카테고리에 흩어져 있습니다. 이 skill은 그 가이드라인을 reference 트리로 정리해서 다음을 한 번에 점검합니다.

- 기능 reject 패턴 (4개 지원 브라우저 동작, "plugin" 용어가 남아 있는지 등)
- 인증 reject 패턴 (logout 누락, reviewer credential 부재)
- listing 메타데이터 (release notes, screenshot, testing info)
- 제출 순서 (functional gate → compatibility gate → listing gate → polish)

문서를 처음부터 끝까지 읽지 않아도 자주 reject되는 항목을 잡아줍니다.

## 보조 도구

### `addons scan` — 아이디어 결정 단계 데이터 조회

Adobe Express의 공식 페이지에서 add-on 데이터를 가져옵니다. 핵심은 브레인스토밍 단계에서 필요한 정보만 좁게 가져오는 것입니다. 전체 데이터를 컨텍스트에 밀어 넣지 않고도 "이 아이디어를 이미 누가 만들었는지", "지금 어떤 카테고리가 활발한지", "어떤 niche가 비어 있는지"를 확인할 수 있습니다.

사람이 직접 몇 번 실행해서 확인할 수도 있지만, 더 중요한 용도는 `express-addon-idea-brainstorm` skill이 이 명령을 작은 단위로 호출하면서 아이디어 검증에 쓰는 것입니다.

```bash
express-developer-aikit addons scan --source trending --limit 10
express-developer-aikit addons scan --source snapshot --query accessibility --limit 5
express-developer-aikit addons inspect --name "Accessibility Assistant"
express-developer-aikit addons inspect --id wlgg52gjj
```

`trending`은 Adobe의 공식 trending 페이지를 기준으로 합니다.

`snapshot`은 수동으로 수집한 더 넓은 add-on 목록으로 overlap 분석에 씁니다. 수집 시점의 날짜 / 버전은 snapshot manifest에서 확인할 수 있습니다.

권장 흐름: 먼저 `trending`으로 지금 눈에 띄는 영역을 보고, 그다음 `snapshot`으로 더 넓은 overlap을 체크합니다. 이렇게 하면 전체 JSON을 모델 컨텍스트에 넣지 않고도 전체 목록을 활용할 수 있습니다.

로컬 개발 중에는 manifest 경로를 직접 넘겨서 검증할 수 있습니다.

```bash
express-developer-aikit addons scan --source snapshot --query accessibility --limit 5 --snapshot-manifest ./data/addon-marketplace-snapshots/manifest.json
```

### `mcp init` — 공식 MCP 셋업 자동화

공식 Adobe Express MCP를 클라이언트별로 셋업하는 boilerplate를 자동화합니다. 각 클라이언트의 config 위치와 형식이 달라서 새 프로젝트마다 손으로 넣어야 하는 부분을 한 번에 처리합니다.

`mcp init`을 `--clients` 없이 터미널에서 실행하면, 기본으로 전부 생성하지 않고 화살표 키 기반 선택 UI가 뜹니다. ↑/↓로 이동, Space로 토글, Enter로 확정. 비대화형 환경에서는 `--clients`를 명시해야 합니다.

```bash
express-developer-aikit mcp init
express-developer-aikit mcp init --clients cursor,vscode,codex
```

생성되는 것:

- Cursor / VS Code / Codex용 프로젝트 로컬 config
- Claude Desktop / Antigravity용 붙여넣기 스니펫 (`.express-developer-aikit/mcp-snippets/`)
- Adobe Express 작업 규칙 메모 (`.express-developer-aikit/AGENTS.express.md`) — MCP가 다루지 않는 panel/sandbox 분리, manifest 경로 같은 규칙을 에이전트 컨텍스트에 미리 깔아둡니다

지원 클라이언트: `cursor`, `claude-desktop`, `vscode`, `antigravity`, `codex`.

## Contributing

이슈와 PR 환영합니다. 자세한 내용은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고해주세요.

가장 도움이 되는 기여는 보통 새 skill 추가/개선, provider installer 수정, 실제 add-on 프로젝트에서 나온 사용 피드백입니다.

## 라이선스

MIT © Irelander. [LICENSE](./LICENSE) 참고.
