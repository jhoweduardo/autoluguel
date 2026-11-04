# Parecer QA — B01 — rodada 001

- Estado final desta rodada local: **BLOQUEADO**; sem aprovação da B01 ou da execução hospedada.
- Data: 04/11/2026. Instância independente `/root/qa_b01_001`, sem autoria de aplicação/build/validador.
- Entrada aceita: controle B01-001, liberação do coordenador `/root`, entrega backend `/root/backend_b01` PRONTO_PARA_QA e manifesto inicial. Frontend não aplicável; nenhum desenvolvedor ativo.
- Referência: `B01-001-manifesto-inicial.json`; alterações de testes/harness e workflow permitidas explicitamente nesta fase. Referência final pendente.

## Autoria e escopo de QA

Criados `tests/ci/run-suite.mjs` (executa suites e rejeita relatório ausente, zero testes, falha/skip/flaky), `readiness.mjs` (PostgreSQL exclusivo tmpfs, host próprio, 200/503, cleanup e timeout), `gates.spec.mjs` (negativos locais sem modificar produto). Acrescentados jobs de testes e check agregado `always()` em `.github/workflows/ci.yml`; jobs backend originais preservados. Não alterei aplicação, contrato, manifests/lockfiles nem testes originais.

## Evidências obtidas

| Critério | Verificação | Resultado atual |
|---|---|---|
| 4 / 7 | OpenAPI estruturalmente inválido rejeitado pelo validador entregue | Passou no teste negativo |
| 4 / 7 | Referência local inexistente rejeitada | Passou no teste negativo |
| 2 / 7 | `npm ci` com manifest incompatível com lockfile, fixture local offline | Passou: erro EUSAGE, sem depender de registry indisponível |
| 7 | Teste Node sintético realmente falho retorna código não zero | Passou no teste negativo |
| 3 | Execução unitária pelo runner com relatório | Pendente: restrito sem relatório, repetição escalada sem retorno |
| 3 | Testes unitários diretos | 18 aprovados, 0 falhas, 0 ignorados; código 0 |
| 3 | Execução E2E pelo runner | Falha de infraestrutura/setup; código 1, sem testes de aplicação contabilizados |
| 5 / 6 / 8 | PostgreSQL real isolado, 200/503, concorrência e cleanup | Pendente: acesso Docker restrito negado; consulta escalada sem retorno |
| 1 / 7 / 11 | CI hospedada verde/vermelha e política externa | Não executada; nenhum push/PR autorizado ou realizado |

## Comandos, resultados e interrupções

- `node --check tests/ci/run-suite.mjs` e `node --check tests/ci/readiness.mjs`: código 0.
- Primeira execução de `node --test tests/ci/gates.spec.mjs`: 3 passaram/1 falhou, falha do próprio harness ao herdar NODE_TEST_CONTEXT no subprocesso Node. Corrigida somente a montagem do ambiente do teste filho; assert esperada preservada. Fixture npm alterada para local/offline com EUSAGE explícito para não confundir falha de rede com incompatibilidade.
- Reexecução final `node --test tests/ci/gates.spec.mjs`: **4 aprovados, 0 falhas, 0 ignorados, código 0**, duração 10,2s. Sessão55938 recuperada e encerrada. Em sequência, unit runner terminou código1 por não produzir relatório; não há contagem unitária válida dessa tentativa.
- `docker info` restrito: permissão negada no pipe docker_engine. Sessão1622 encerrada código1; nenhum recurso Docker criado por QA.
- Consulta Docker escalada e `node tests/ci/run-suite.mjs unit` escalado: ferramentas interrompidas pela coordenação após espera sem retorno, sem session_id recebido. Não se afirma que testes/banco executaram nem que esses comandos falharam por produto. Não há aprovação pendente confirmada; operação ficou sem resultado observável.
- Antes da última tentativa escalada, `Get-Process dotnet,node,docker` não encontrou processos ativos. Limpeza final e eventual efeito da chamada interrompida ainda precisam ser conferidos.

## Complementação e encerramento local

- `dotnet test Autoluguel.slnx --configuration Release --no-restore` direto: **código 0, 18 aprovados, 0 falhas, 0 ignorados**, duração do conjunto 60 ms. Esta evidência é da suíte existente; não demonstra execução pelo subprocesso Node nem runner Ubuntu.
- `node tests/ci/run-suite.mjs unit` restrito repetido após execução direta: código1, nenhum relatório TRX encontrado. O runner rejeitou a ausência de evidência; a execução dotnet como subprocesso não ficou comprovada no ambiente restrito. Não atribuir defeito de aplicação com esse resultado.
- `node tests/ci/run-suite.mjs web`: sessão39602 concluída **código1**, mensagens Playwright `Timed out waiting 90s for the plugin setup to run` e timeout de teardown 90 s; runner rejeitou erro global. A coordenação solicitou limite e o terminal recebeu Ctrl+C ao encerrar. Nenhum cenário E2E de aplicação é contado como executado/passando. Timeout interno do subprocesso não garantiu retorno pontual no ambiente restrito; a execução hospedada ou permitida continua necessária.
- Parse YAML usando `js-yaml` já instalado transitivamente: código0, 8 jobs, agregado com 7 dependências, gatilhos/contents:read presentes. **Não equivale a actionlint** nem validação semântica completa de expressões GitHub. Actionlint não estava disponível; nenhuma instalação adicional feita.
- `git diff --check`: código0; somente avisos LF/CRLF. Conferência do manifesto inicial: única divergência é `.github/workflows/ci.yml`, alteração de harness explicitamente atribuída ao QA. Os outros 79 arquivos originais conferem. Novos scripts/versão workflow registrados em `B01-001-manifesto-qa.json`.
- Conferência `Get-Process node,dotnet,docker` e listener 5173 ao encerramento: nenhum processo correspondente ou listener retornado. Sessões 1622, 55938 e 39602 estão encerradas; nenhuma sessão conhecida ficou pendente. Consultas escaladas interrompidas não retornaram identificador de execução reutilizável.
- Nenhum container/banco foi criado pela execução QA desta rodada; nenhuma limpeza de banco/volume existente foi feita. Portanto, não se alega comprovação de cleanup, concorrência ou isolamento real do novo smoke.

## Referência final da fatia QA — SHA256

| Arquivo | SHA256 |
|---|---|
| .github/workflows/ci.yml | 425DCACA40121C11D8E394530F39DCBE09FA4036DF7E5FCB6A919216ED40DE66 |
| tests/ci/run-suite.mjs | 0B483EC17374D37D3DC221B019700C8FE012640916E981A9286F9EAB640CF290 |
| tests/ci/readiness.mjs | 4AD0221286EB81D6916FA7C12587FB64A4F491901E4D7BCC03E69D951898C197 |
| tests/ci/gates.spec.mjs | 8629731C844BAC7758811F641EF527B2EA17BD513DAF86CAE89B7C0E940DE5D0 |

## Lacunas e conclusão parcial

Sem defeito de produto demonstrado. Ainda não há prova positiva do runner unit/E2E, integração/isolamento/limpeza PostgreSQL, negativo de locked restore .NET, validação semântica completa workflow, ambiente limpo Ubuntu nem execução GitHub. Existência dos scripts não comprova seus resultados. Builds/restore positivos do desenvolvedor estão na entrega, separados da prova independente.

Sem commit/push/PR, deploy, serviço externo ou alteração de proteção de branch. Nenhuma reserva/autorização futura é certificada. **BLOQUEADO**, com artefatos locais concretos para revisão. Para retomar: autorizar/disponibilizar execução de Node→dotnet/Playwright/Docker em ambiente permitido e PostgreSQL 17 descartável, confirmar os resultados do harness e limpar seus recursos; validar workflow com actionlint/runner real; depois, sob autorização de envio, comprovar os checks positivos/negativos no GitHub na referência final. O envio remoto permanece ação posterior sob coordenação. Não iniciar próxima história por este parecer.

