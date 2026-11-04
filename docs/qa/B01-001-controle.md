# Controle da rodada — B01 — 001

- Estado: BLOQUEADA na validação local, 04/11/2026. Coordenador `/root`.
- Origem: pedido de continuidade após responsável criar e indicar GitHub `jhoweduardo/autoluguel`. Refinamento `docs/produto/B01-refinamento.md`, critérios 1–11; RN25/26 e regras já cobertas pela base. B00 aprovada, sem reabertura.
- Destino confirmado: origin GitHub; CI adotada GitHub Actions. Branch local `b01-ci`; nenhum envio remoto nesta fase. Não alterar visibilidade, proteção de branch ou custos.
- Escopo consolidado: CI para push/PR main e execução manual, Ubuntu 24.04, .NET 10/Node 24, restore locked/npm ci, builds, suites existentes, validação estrutural OpenAPI versionada, integração mínima PostgreSQL 17 descartável 200/503, falha propagada, limites e permissões contents:read. Sem deploy/publicação ou migrations de negócio.
- Contrato de aplicação preservado: três GETs existentes. Nenhuma nova API, tela, schema ou comportamento de negócio.
- Backend: `/root/backend_b01`, responsável por automação de build/contrato e documentação, sob atribuição abaixo. Testes e harness não são sua autoria.
- Frontend: não aplicável; nenhum trabalho de UI.
- Arquivos backend exclusivos nesta fase: `.github/workflows/ci.yml` (estrutura/build/contrato apenas), `tools/ci/package.json`, `tools/ci/package-lock.json` e utilitário de validação de contrato se necessário, `docs/ci.md`, seção CI do README, `docs/qa/B01-001-entrega-backend.md`.
- Coordenador: refinamento/backlog/plano documental e este controle. Não editar arquivos atribuídos ao backend.
- Após entrega backend: congelar conteúdo de produto/configuração e liberar QA em instância independente. QA recebe propriedade exclusiva temporária do workflow para adicionar orquestração de testes/harness e seus manifests/projetos de teste necessários; não pode corrigir produto/build/contrato.
- QA NÃO acionado nesta fase. Não criar integração/testes simultaneamente com desenvolvimento.
- Dependência de harness explicitada: testes de conexão CI ainda não automatizados; QA os produzirá depois da entrega. Workflow parcial não equivale a história pronta/aprovada.
- Política de migrations consolidada no plano de testes: B01 cobre conexão e isolamento, migrations reais quando existirem nas histórias pertinentes; não criar schema fictício.
- Critério de conclusão: parecer independente sobre versão final, checks significativos e execução hospedada identificada; resultados somente locais deixam CI remota pendente. Build não substitui isolamento ou falha negativa.
- Autorização para envio externo: preparar conteúdo revisável localmente; obter autorização aplicável antes de envio/PR. Não concluir B01 apenas com arquivos de workflow.

## Entrega recebida e liberação

Backend `/root/backend_b01` entregou PRONTO_PARA_QA (`B01-001-entrega-backend.md`), com SHA256 e resultados positivos de restore locked, builds .NET/web e schema/referências OpenAPI. Não criou testes ou harness; nenhum desenvolvedor ativo. Frontend não aplicável.

Referência inicial congelada: `B01-001-manifesto-inicial.json`. Backend para de editar. QA será instância nova `/root/qa_b01_001`, distinta do backend e coordenador.

Propriedade transferida ao QA: `.github/workflows/ci.yml` somente para orquestração de testes, harness e agregação de resultados; novos testes/harness em `tests/ci/` ou projeto de integração se justificável; configuração de testes e relatórios `docs/qa/B01-001-*`. Não alterar aplicação, validador OpenAPI ou jobs de build/contrato para acomodar defeitos. Manifests/solução de teste somente se necessários e com atribuição exclusiva adicional do coordenador. Priorizar runtimes/testes existentes, sem framework novo desnecessário.

Critérios QA: suite .NET e E2E existentes com descoberta não vazia; contrato inválido e mismatch lockfile em cópias temporárias devem falhar; conexão real PostgreSQL exclusivo 200 e indisponível 503; ausência de recurso essencial não é skip/verde; isolamento/limpeza e fail propagation em sucesso/falha/cancelamento proporcionais. Não ampliar para reservas inexistentes. Registrar referência final de produto/configuração e testes após autoria QA, identificando mudanças de harness permitidas.

Execução hospedada exige envio remoto ainda não realizado nem autorizado explicitamente nesta fase. QA pode validar localmente e preparar negativos seguros, mas deve manter evidência remota pendente; configuração local não prova check vermelho/verde no GitHub. Nenhum PR/push/alteração de proteção ou visibilidade por QA.

QA `/root/qa_b01_001` confirmou recebimento e independência após a liberação. Plano concreto recebido: harness pequeno com runtimes existentes para suítes, smoke PostgreSQL e negativos em cópias temporárias, sem framework/dependência nova; jobs teste/agregado serão de sua autoria exclusiva. Backend permanece sem escrever.

## Resultado da retomada após interrupção da interface

Parecer independente `B01-001-parecer.md`: BLOQUEADO, sem aprovação da história ou defeito de produto demonstrado. Manifesto final QA registrado separadamente. Dos 80 arquivos iniciais, 79 preservados e apenas workflow alterado conforme atribuição de harness; novos testes identificados no manifesto QA.

Resultados reais: 4 cenários negativos aprovados, `dotnet test` direto 18 aprovados/0 falhas/0 ignorados, YAML parseável com 8 jobs/7 dependências e diff-check válido. Wrapper unitário restrito não produziu TRX e falhou; E2E terminou sem testes de aplicação por setup/teardown sem encerramento normal pertinente. Docker restrito sem acesso; repetições escaladas sem retorno foram interrompidas pela coordenação, não interpretadas como falha de produto. Nenhum container criado. QA confirmou ausência de processos node/dotnet/docker e listener 5173 ao encerrar.

Próximo passo: executar runners Node→dotnet/Playwright e integração Docker em ambiente permitido, validar workflow com ferramenta apropriada e demonstrar execução hospedada. Preservar positivos existentes, repetir apenas caminhos bloqueados/afetados. Envio remoto continua pendente de autorização aplicável após apresentar conteúdo revisável. B01 não concluída; B02 não iniciada.
