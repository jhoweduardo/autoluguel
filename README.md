# Autoluguel

Marketplace brasileiro de aluguel de **carros e motos**, voltado a pessoas físicas e pequenas locadoras. Projeto de aprendizado em engenharia de software e desenvolvimento assistido por IA.

**Estado: estrutura inicial, não um MVP concluído.** Há uma aplicação web inicial, host ASP.NET Core, conexão EF Core preparada, regras de período/preço com testes e documentação do produto a implementar. Cadastro, anúncios persistidos, autenticação e reservas ainda pertencem ao backlog. O protótipo não permite contratar locações reais.

## Comece aqui

1. Leia o [PRD](docs/PRD.md) para entender produto, escopo e critérios de sucesso.
2. Consulte as [regras de negócio](docs/regras-de-negocio.md) antes de implementar um fluxo.
3. Use a [Tech Spec](docs/TECH-SPEC.md) e o [contrato proposto da API](docs/api/openapi.json).
4. Escolha uma história do [backlog](docs/backlog.md), respeitando suas dependências.
5. Siga [AGENTS.md](AGENTS.md) e o [fluxo dos especialistas](docs/agentes/fluxo-de-trabalho.md): frontend/backend desenvolvem e entregam; depois, uma instância QA independente cria e executa os testes. Só após QA aprovado e conclusão registrada para a mesma versão, o coordenador aciona `closeout` para conferir cada critério do refinamento e consolidar as evidências em `docs/entregas/<ID>.md`. Se houver lacunas, os documentos permanecem e o caso volta ao coordenador.

## Mapa do repositório

```text
apps/web/                       React + TypeScript + Vite + Material UI
src/Autoluguel.Api/              Host ASP.NET Core 10 e composição dos módulos
src/Autoluguel.BuildingBlocks/   Tipos de domínio pequenos e independentes
src/Autoluguel.Modules/          Identity, Profiles, Catalog, Availability,
                               Reservations, Dashboard e Search (futuro)
tests/Autoluguel.UnitTests/      xUnit: regras puras
tests/Autoluguel.IntegrationTests/ Plano de testes com PostgreSQL real
docs/                          Produto, arquitetura, regras, backlog e estudo
docs/adr/                      Registro de decisões
docs/agentes/                  Coordenação e templates de entrega/QA
docs/qa/                       Evidências de validação independente
.codex/agents/                 Perfis product, frontend, backend, qa e closeout
docs/api/openapi.json           Contrato alvo; ver x-implementation-status
infra/                         Dockerfiles e proxy web
compose.yaml                   Ambiente local: PostgreSQL, API e web
```

## Executar localmente

Requisitos: SDK .NET 10, Node.js 24 LTS e npm; Docker com serviço ativo para o banco. O `global.json` aceita o SDK 10.0.100 ou feature band posterior da mesma versão. Versões efetivamente verificadas estão no [relatório](docs/validacao.md).

Na raiz do projeto, copie `.env.example` para `.env` e substitua a senha de exemplo. Não versione `.env`.

```powershell
Copy-Item .env.example .env
docker compose up -d db
dotnet restore Autoluguel.slnx
$env:ConnectionStrings__Autoluguel = 'Host=localhost;Port=5432;Database=autoluguel;Username=autoluguel;Password=SUA_SENHA_LOCAL'
dotnet run --project src/Autoluguel.Api --urls http://localhost:5080
```

Em outro terminal:

```powershell
cd apps/web
npm ci
npm run dev
```

Acesse [a interface local](http://localhost:5173). O Vite encaminha `/api` e `/health` para a API em `5080`. A página inicial funciona sem banco; `/health/live` verifica o processo e `/health/ready` verifica a conexão com PostgreSQL. **Nenhuma tabela de negócio ou migration foi criada nesta entrega.**

Para executar os três serviços em contêineres:

```powershell
docker compose up --build -d
```

A interface fica em [localhost:8080](http://localhost:8080); a API usa a porta `5080`. Portas são publicadas apenas no loopback. As imagens e o servidor web desta configuração destinam-se ao desenvolvimento. Use `docker compose down` para parar; preserve o volume do banco.

## Verificar

```powershell
dotnet test Autoluguel.slnx
cd apps/web
npm run build
npx playwright install chromium
npm run test:e2e
```

O teste Playwright verifica a página inicial, não o fluxo de reservas futuro. Instalações de dependências e navegador precisam de internet. O [plano de testes](docs/plano-de-testes.md) diferencia o que existe do que é requisito para concluir o MVP.

## Integração contínua

A B01 está em desenvolvimento: a configuração GitHub Actions prepara builds .NET/web e validação estrutural do OpenAPI com lockfiles. Testes/harness de CI e execução hospedada ainda estão pendentes; esta fase parcial não comprova a B01 concluída. Consulte [CI e reprodução local](docs/ci.md). O workflow não publica a aplicação nem configura proteção de merge.

## Documentação

- [Contexto e premissas](docs/contexto-e-premissas.md)
- [PRD](docs/PRD.md) · [Tech Spec](docs/TECH-SPEC.md) · [Regras](docs/regras-de-negocio.md)
- [ADRs](docs/adr/README.md) · [Backlog](docs/backlog.md)
- [Equipe de agentes e sequência de execução](docs/agentes/fluxo-de-trabalho.md)
- [Roadmap do produto e de aprendizado em LLMs](docs/roadmap-llms.md)
- [Fontes técnicas](docs/fontes.md) · [Validação da entrega](docs/validacao.md)

Sem licença de distribuição escolhida: decidir antes de tornar o repositório público. Nenhum serviço pago, conta externa, implantação ou repositório remoto foi criado.
