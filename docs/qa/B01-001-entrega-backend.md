# Entrega de desenvolvimento — B01 — backend

- Rodada/data: B01-001, 04/11/2026.
- Instância autora: `/root/backend_b01`.
- Origem: atribuição do coordenador `/root`, `B01-001-controle.md` e refinamento B01 consolidado; B00 já aprovada.
- Estado: **PRONTO_PARA_QA para a fatia build/contrato atribuída**. Não aprova B01 e não apresenta testes/harness ou execução hospedada como entregues.
- Frontend: não aplicável à UI.
- Objetivo/regras: automação de builds e contrato, reprodução com lockfiles e falha não suprimida; critérios 1–4/7/9–11 nas partes atribuídas, RN25/26 e ADR 0007. Os demais critérios e cenários negativos permanecem para QA/coordenador.

## Arquivos e resultado

- `.github/workflows/ci.yml`: três jobs separados `dotnet-build`, `web-build` e `openapi`; Ubuntu 24.04; push/PR main e acionamento manual; .NET10/Node24, restore locked/npm ci, builds, validação e verificação de lockfiles sem mudança. Limites de 15/10/10 minutos, token contents:read e checkout sem persistência de credenciais. Sem testes/harness nesta fase, sem secrets externos, deploy, publicação ou supressão de falhas.
- `tools/ci/package.json` e `package-lock.json`: swagger-parser 13.1.0 e transitivas fixadas, ferramenta privada e isolada do frontend.
- `tools/ci/validate-openapi.mjs`: valida schema/referências OpenAPI usando contrato padrão resolvido a partir do script; aceita arquivo local explícito, desabilita resolução HTTP e retorna código 1 em falha. Nenhum cenário de teste foi criado pelo backend.
- `docs/ci.md`: reprodução, segurança, check parcial versus B01/merge, limites de evidência e transferência ao QA.
- `README.md`: apenas seção CI adicionada; restante preservado.
- Este relatório.

Contrato de aplicação `docs/api/openapi.json` preservado; nenhuma API, entidade, migration, tela ou regra de negócio alterada. Fontes de produto/fluxo, baseline e ADRs consultadas. Alterações de requisitos/controle do coordenador preservadas e não atribuídas a esta instância.

## Decisões técnicas e referências

Actions fixadas por SHA real, verificadas via `git ls-remote` nas tags oficiais em 04/11 (código 0 depois de repetição escalada por falha de rede restrita):

| Action | Tag | SHA |
|---|---|---|
| actions/checkout | v6.0.2 | de0fac2e4500dabe0009e67214ff5f5447ce83dd |
| actions/setup-node | v6.5.0 | 249970729cb0ef3589644e2896645e5dc5ba9c38 |
| actions/setup-dotnet | v5.4.0 | 26b0ec14cb23fa6904739307f278c14f94c95bf1 |

Swagger Parser valida schema OpenAPI 3.0 e referências, não conformidade completa adicional à especificação 3.0 nem breaking changes. Resolução HTTP desabilitada evita que o contrato atual dependa de referência de rede. Ferramenta consultada no registry e instalada com versão exata/lockfile. Skill de CI Postman lida, usando os princípios de gate local, propagação de falha e distinção local/remoto; nenhum Postman workspace/API key/publicação criado.

## Verificações realmente executadas

Ambiente local Windows/PowerShell, usando as dependências disponíveis. Não é execução no runner Ubuntu nem checkout limpo.

| Comando | Resultado real |
|---|---|
| `npm view @apidevtools/swagger-parser version --fetch-retries=0 --fetch-timeout=30000` | Restrito ENOTFOUND/código 1; escalado código 0, versão 13.1.0 |
| `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=30000` em tools/ci | Restrito ENOTFOUND/código 1; escalado código 0, lockfile gerado |
| `npm ci --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=30000` em tools/ci | Restrito ENOTFOUND/código 1; escalado código 0, 15 pacotes |
| `npm run validate:openapi` em tools/ci | Código 0, `OpenAPI 3.0.3 schema and references are valid.` |
| `dotnet restore Autoluguel.slnx --locked-mode` | Restrito código 1 sem saída; repetição escalada código 0, quatro projetos restaurados |
| `dotnet build Autoluguel.slnx --configuration Release --no-restore` | Restrito código 1 sem diagnóstico (0 erros/avisos); repetição escalada código 0, 0 erros/avisos, 7,49 s |
| `npm run build` em apps/web | Código 0, TypeScript/Vite7.3.7, 918 módulos, build Vite6,43s |
| `git diff --check` | Código 0; avisos Git de conversão LF/CRLF, sem erro de whitespace |
| `git diff --exit-code -- '**/packages.lock.json' apps/web/package-lock.json` | Código 0, lockfiles da aplicação/testes existentes preservados |

Não executei testes .NET/Playwright, HTTP, PostgreSQL, cenários negativos, workflow no GitHub ou limpeza de recursos de banco; não foram necessários para verificar esta pequena fatia e pertencem à rodada QA. Nenhum runner de comando permanece pendente nesta entrega. Nenhum commit/push/PR foi feito.

## Dependências e próximos passos

1. Coordenador congela a entrega e libera uma instância QA distinta.
2. QA recebe exclusividade do workflow para acrescentar suites existentes e harness proporcional PostgreSQL 200/503, descoberta de testes, isolamento e limpeza; nenhum placeholder deve contar como aprovação.
3. QA verifica sintaxe do workflow, comandos em ambiente limpo, cenários negativos e permissões; build local não prova essas garantias.
4. Coordenador obtém autorização aplicável para envio e registra execução hospedada real. Configuração local não ativa branch protection nem conclui B01.

Sugestões ao QA: contrato malformado/referência inválida; manifest incompatível com lockfile; comando/teste que falha produzindo check vermelho; nenhum teste descoberto não deve virar aprovação; banco exclusivo por run, indisponibilidade controlada e limpeza inclusive em falha/cancelamento. Resultados esperados devem vir dos critérios, não destes detalhes de implementação.

Confirmação: **não criou/modificou testes, fixtures, snapshots, configuração Playwright, solução ou projetos de teste**. O workflow desta entrega contém somente estrutura/build/contrato, conforme divisão explícita do coordenador. Não assumirei QA da própria entrega e paro de editar após este relatório.

## Referência do conteúdo entregue — SHA256

| Arquivo | SHA256 |
|---|---|
| .github/workflows/ci.yml | CD38E72B9DFD1C8BDC373181CA002BE3DC9A642DE8901253A1F5BFA3502F2E00 |
| tools/ci/package.json | 3E45F1FF77F4D26AE984EF69151C36440BC2F0730603D81879492AD33847A36B |
| tools/ci/package-lock.json | EEF42CF1B25D5C914093639FF0CAFE6E7E2BBDE26F57C8A00817E07F15268D04 |
| tools/ci/validate-openapi.mjs | DE26CED7F86E2FD6C1999DBCD3D7594A350442914A8E1315FA6B088309735FD6 |
| docs/ci.md | 5743261473E503D1DB49299B4C8529E7172C6E7D200CAACA1BC12C7C42A3BCD3 |
| README.md | 12DB901D29E4200DBC98D8A85BC9DFCB046277AD00BBC96A77705327CB2428C1 |

Conceito: um lockfile versionado registra uma resolução; restore bloqueado exige que a instalação a respeite e falhe quando o manifest divergir. O resultado local positivo não demonstra esse cenário negativo nem execução hospedada.
