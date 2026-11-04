# CI da B01

Estado desta entrega: **builds e contrato preparados localmente; testes/harness e execução no GitHub ainda pendentes**. Este documento não aprova B01. Consulte o [controle](qa/B01-001-controle.md) e o [refinamento](produto/B01-refinamento.md).

## Execução e checks

O arquivo [ci.yml](../.github/workflows/ci.yml) prepara GitHub Actions para push em `main`, pull request destinado a `main` e acionamento manual. Cada job usa um runner novo `ubuntu-24.04`, sem caches de dependências, com tempo máximo. A revisão executada é identificada pelo run do GitHub e por `git rev-parse HEAD` no build .NET.

| Check desta entrega | Resultado esperado |
|---|---|
| `Build .NET` | .NET 10, restore em modo bloqueado, build Release sem nova restauração e lockfiles preservados |
| `Build web` | Node 24, `npm ci`, TypeScript/Vite e lockfile preservado |
| `Validate OpenAPI` | Ferramenta isolada com lockfile, schema OpenAPI e referências válidos |

Qualquer comando obrigatório com saída diferente de zero falha seu job e a execução. Não há `continue-on-error`, supressão de saída, deploy, publicação de pacote/imagem/site, upload de artefatos ou acesso a banco compartilhado. Uma execução verde desta **fase parcial** demonstra apenas os três checks acima, não testes nem o aceite integral da B01.

As actions estão fixadas por SHA consultada nas tags oficiais: checkout v6.0.2, setup-node v6.5.0 e setup-dotnet v5.4.0. .NET 10 e Node 24 recebem o patch disponível da linha especificada; as versões efetivas ficam nos logs. O `global.json` continua definindo a seleção local de SDK. Atualizações de action/ferramenta devem ser revisadas e ter SHA/lockfile coerentes.

## Contrato e dependências

A ferramenta `tools/ci` usa `@apidevtools/swagger-parser` **13.1.0**, com dependências transitivas fixadas em `package-lock.json`. Ela valida schema OpenAPI 3.0 e referências; não faz análise de compatibilidade entre versões nem comprova comportamento dos endpoints. O parâmetro `validate.spec` do parser não oferece validação adicional da especificação OpenAPI 3.0; por isso não se alega esse resultado. Resolução HTTP de referências está desabilitada, mantendo a validação local. O contrato atual usa referências internas; uma futura referência remota exige revisão explícita dessa política.

Operações `planned` no OpenAPI continuam planejamento, não endpoints funcionais. Não foi adicionado novo endpoint ou alterado o contrato da aplicação.

## Reproduzir os checks localmente

Requisitos: SDK .NET 10 compatível com `global.json`, Node 24/npm e acesso aos registries na primeira instalação. Na raiz:

```powershell
dotnet restore Autoluguel.slnx --locked-mode
dotnet build Autoluguel.slnx --configuration Release --no-restore
npm --prefix apps/web ci --no-audit --no-fund
npm --prefix apps/web run build
npm --prefix tools/ci ci --ignore-scripts --no-audit --no-fund
npm --prefix tools/ci run validate:openapi
git diff --exit-code -- '**/packages.lock.json' apps/web/package-lock.json tools/ci/package-lock.json
```

Validação de outro arquivo local, para uso explícito de diagnóstico: em `tools/ci`, execute `npm run validate:openapi -- <caminho>`. O caminho informado é relativo ao diretório corrente; sem argumento, o contrato padrão é resolvido a partir do script, independentemente de onde o comando for iniciado.

## Limites de segurança e ações externas

O token do workflow tem somente `contents: read`, e checkout não persiste credenciais. Não são usados `pull_request_target`, secrets externos, `.env` local, credenciais de produção ou chaves `VITE_*`. Não há alteração de proteção de branch, visibilidade do repositório ou orçamento. A instalação de dependências executa código versionado na revisão em runner descartável; não fornecer credenciais adicionais a esses jobs.

Pipeline com falha e merge bloqueado são coisas distintas. Exigir checks no GitHub é uma configuração externa de regras/proteção que depende de permissões e recursos disponíveis, ainda não executada nem comprovada. Publicar/envio de commits ou abrir PR exige a autorização aplicável do responsável. A existência local do workflow não comprova execução hospedada.

## Transferência ao QA independente

Somente depois desta entrega e do congelamento pelo coordenador, QA recebe o workflow com exclusividade para adicionar orquestração de testes/harness: suites .NET e Playwright existentes, integração de readiness 200/503 com PostgreSQL 17 exclusivo e cenários proporcionais de falha/isolamento/limpeza. Essas etapas **não existem nesta entrega de desenvolvimento**; nenhum placeholder é apresentado como teste passando.

O futuro recurso PostgreSQL precisa ser exclusivo do job/run, usar credenciais sintéticas e conexão explícita, sem volumes do Compose de desenvolvimento. Iniciar um serviço não conta como teste integrado. Não criar entidades/migrations para B01: o host atual permite comprovar conexão; constraints e transições de reservas continuam futuras.

QA deverá verificar especialmente checkout sem dependências prévias, incompatibilidade de lockfile, contrato inválido, propagação real de falha de teste, descoberta de suites essenciais, isolamento de recursos e limpeza em sucesso/falha/cancelamento. Testes e harness pertencem ao QA, não ao autor desta automação de build/contrato. Se aparecer defeito de build/contrato, a correção volta ao backend e exige nova entrega.

Fontes técnicas: [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [setup-node](https://github.com/actions/setup-node), [setup-dotnet](https://github.com/actions/setup-dotnet) e [API do Swagger Parser](https://github.com/APIDevTools/swagger-parser/blob/main/docs/swagger-parser.md). Fontes de produto: refinamento B01 e ADR 0007. Nenhum workspace Postman, API key ou publicação é necessário à validação estrutural local.
