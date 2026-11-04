# Entrega de desenvolvimento — B00 — frontend

- **Rodada e data:** B00-001; entrega documental retomada em 03/11/2026. Inspeção e tentativa de build realizadas em 26/10/2026; hashes reconferidos em 03/11/2026, sem divergência nos arquivos abaixo.
- **Identidade da instância responsável:** `/root/frontend_b00_delivery`, responsável pela inspeção e entrega atual, sem assumir autoria histórica do scaffold.
- **Referência de origem:** atribuição do coordenador `/root`, B00 do backlog e refinamento `docs/produto/B00-refinamento.md` aceito pelo responsável. Fontes de contexto, PRD, regras, Tech Spec, README, AGENTS e fluxo dos agentes lidas na inspeção.
- **Estado:** `PRONTO_PARA_QA` para avaliação do baseline identificado, com lacunas explícitas. Não representa aprovação nem liberação automática da rodada.
- **Objetivo e RF/RN:** apresentação inicial demonstrativa; critérios 1/3/4/9/10 na parte web, PRD §6–8 e RN25–26. RF01–RF08 permanecem futuros.
- **Arquivos alterados e responsabilidades:** somente este relatório, por atribuição explícita. Nenhuma implementação ou alteração de aplicação, infraestrutura, manifest, lockfile ou testes.
- **Contrato consumido/alterado:** nenhum alterado. OpenAPI inspecionado marca somente GET `/health/live`, `/health/ready` e `/api/v1/project-info` como `implemented`; 24 operações permanecem `planned`. A página inicial estática não consome API.

## Resultado por critério

| Critério | Observação e limite |
|---|---|
| 1 — Base compilável, parte web | Stack React/TypeScript estrito/Vite/Material UI e lockfile presentes. Build atual não comprovado: tentativa em 26/10 encerrou com código 1 por compilador ausente. |
| 3 — Apresentação honesta | Leitura de App.tsx/index.html identifica nome, públicos, pt-BR e aviso de demonstração sem contratação/cobrança, com cadastro/anúncios/reservas indisponíveis. Não há formulário de documentos ou oferta real no código. Renderização não executada nesta entrega. |
| 4 — Telas pequenas | Código usa breakpoints, grid em coluna no xs, título adaptável e elementos semânticos. Legibilidade e ausência de overflow desde 360 px ainda precisam de verificação renderizada; preset Pixel 7 existente não comprova esse limite. |
| 9 — Resultados verificáveis | Resultados de leitura, execução malsucedida e pendências estão separados. Evidências históricas de 19/10 não foram atribuídas à execução atual. |
| 10 — Orientação e limites | README distingue scaffold de produto, descreve pré-requisitos, execução e verificações, e informa ausência das jornadas e migrations de negócio. Mapa de perfis ainda omite product; manutenção documental cabe ao coordenador, sem bloqueio essencial desta base. |

## Execuções e dependências

- Em 26/10: `node --version` → código 0, `v24.18.0`; `npm --version` → código 0, `12.0.1`.
- Em 26/10, `npm run build`, em `apps/web` → **código 1**. Script `tsc --noEmit && vite build` informou que `tsc` não é reconhecido. Vite não foi alcançado. `node_modules` estava ausente. Isso identifica dependência de ambiente, sem demonstrar defeito de produto.
- Git informou que o diretório não era repositório em `git status --short`/`git rev-parse HEAD`; usa-se manifesto SHA-256 abaixo.
- Em 03/11: conferência do template, ausência prévia deste relatório e recálculo dos hashes executados com sucesso. Build não repetido; condições de dependências não reavaliadas.
- **Não executados nesta atribuição:** instalação/restauração, Playwright, inspeção visual, HTTP, .NET, Compose ou PostgreSQL. Nenhum teste foi executado ou criado. Não se declara a suíte aprovada.

**Reprodução:** em `apps/web`, restaurar com `npm ci` e executar `npm run build`; para inspeção, iniciar `npm run dev`. Para testes existentes, disponibilizar Chromium conforme README e executar `npm run test:e2e` até término normal. Não há seed, conta ou migration necessária para a página estática. Restauração, navegador e resultados atuais ficam pendentes para a rodada liberada pelo coordenador.

**Limitações:** build após restauração, renderização, 360 px e encerramento normal Playwright não comprovados. A página não tem busca, sessão ou comandos; estados de busca, autorização privada, CSRF, idempotência e concorrência são não aplicáveis ao scaffold. Não foi demonstrado defeito de produto nesta inspeção.

**Cenários sugeridos ao QA:** conferir aviso, públicos, idioma e ausência de contratação/coleta; verificar 360 px explicitamente, sem overflow e com legibilidade; executar build/testes existentes com encerramento normal; confirmar página sem dependência de API/banco. Sugestões não substituem análise independente.

**Confirmação:** não criou, modificou, apagou ou enfraqueceu testes, fixtures, snapshots ou configuração de testes. Não alterou produto. Aguardar congelamento/liberação do coordenador e parecer QA distinto.

## Referência do conteúdo entregue

Manifesto SHA-256 reconferido em 03/11/2026. Testes/configuração aparecem apenas para identificar conteúdo existente preservado, sem reivindicar autoria. O coordenador deve conferir a referência ao congelar a rodada.

| Arquivo | SHA-256 |
|---|---|
| apps/web/src/App.tsx | 9c5258b49c81ee36f92b04468a18df6771724e140cc99656b8143c36395b7ed5 |
| apps/web/src/main.tsx | fc0e32e628994adb6fc0d0da48be3d5edc6cccfe0553b16ab923331ff63617e3 |
| apps/web/index.html | 64d3065af69ef42f5b01072c014a82be6c9048392ebd24502dbe3d1b6b068cad |
| apps/web/tsconfig.json | a0f9b5b85963119acc2c54155ef20efee9880b8d84e62a715b32506aa37e9b11 |
| apps/web/vite.config.ts | e5db341df19024f045c735b5652d12a938f716a78a263387f2fd9f1e16fec178 |
| apps/web/package.json | a2c7aea983000fbf4f63c5184ce3349228e38029fa0bc8413db5be16444f5589 |
| apps/web/package-lock.json | f574a9912abc630fa77fe8acc9cbe945776d4902fbd8f9a093d2edddd528b613 |
| apps/web/playwright.config.ts | 08b685d9105d0fb912302434f34c08abfc14ed75701037ce6453a50be8fad658 |
| apps/web/e2e/home.spec.ts | 80c504d8e59e4cc3218979130b97731ff23f8c24cc3e4fc0e672916aaa7c6780 |

**Conceito:** falta do compilador impede avaliar se o código compila. Restauração e nova execução produzem essa evidência; leitura de código também não substitui observação do layout renderizado.

Esta entrega não é parecer de aprovação nem conclusão da B00.
