# B00 — Estrutura inicial para desenvolver o Autoluguel

Data do refinamento: 23/10/2026. Papel: produto. Documento proposto ao coordenador; não altera o status do backlog.

- **História de origem:** B00 / P0 / M — “Como desenvolvedor, iniciar web, host, bibliotecas e documentação”.
- **Resultado:** `REFINADO_PARA_COORDENACAO`.
- **Usuário, problema e valor:** como responsável que aprende a desenvolver com IA, quero uma base local compreensível, com aplicação inicial, regras pequenas e instruções reproduzíveis, para iniciar incrementos sem confundir estrutura técnica com funcionalidades prontas.
- **Estado registrado:** “estrutura entregue com limites” no backlog. Este refinamento detalha seu alcance e a evidência necessária; não reabre implementação, certifica a entrega ou conclui o MVP.
- **Prioridade e tamanho:** manter P0 / M da baseline. É uma fundação que habilita B01 e B02; não há estimativa nova de prazo ou esforço de correção.

## Fontes, regras e estado observado

Foram lidos [contexto e premissas](../contexto-e-premissas.md), [PRD](../PRD.md), [regras](../regras-de-negocio.md), [Tech Spec](../TECH-SPEC.md), [backlog](../backlog.md), [fluxo dos agentes](../agentes/fluxo-de-trabalho.md), [plano de testes](../plano-de-testes.md), [relatório inicial](../validacao.md), [README](../../README.md), [AGENTS.md](../../AGENTS.md) e ADRs [0001](../adr/0001-monolito-modular.md), [0002](../adr/0002-stack-e-persistencia.md) e [0007](../adr/0007-contrato-e-testes.md).

B00 atende à preparação técnica e documental do PRD, especialmente seções 6–8; não entrega RF01–RF08. Regras aplicáveis à pequena biblioteca já presente: RN08 (centavos e limites), RN11 (duração e datas) e RN13 (sobreposição). RN25–26 delimitam dados e demonstração. RN03–05, RN15, RN19 e RN22–24 continuam requisitos de histórias posteriores, sem garantia entregue em B00.

| Área | Observado por leitura em 23/10 | Evidência histórica de 19/10 e limite |
|---|---|---|
| Solução .NET | Solução com host, Modules, BuildingBlocks e projeto unitário; `net10.0`, nullable, warnings como erros e lockfiles presentes | Relatório registra build sem erros/avisos e 18 casos xUnit aprovados; não reexecutados neste refinamento |
| Web | React/TypeScript estrito/Vite/Material UI; página estática em pt-BR com aviso de demonstração; scripts e lockfile presentes | Relatório registra build; asserções Playwright desktop/mobile passaram, mas runner foi interrompido sem encerramento normal |
| Host e persistência | `Program.cs` mapeia apenas três GETs; DbContext sem entidades de negócio e sem migrations | HTTP relatado: live 200, project-info 200, ready 503 sem banco, vehicles 404; conexão bem-sucedida não comprovada |
| Ambiente local | Compose descreve db/API/web, portas em loopback, volume de banco e senha obrigatória por variável; Dockerfiles e proxy presentes | Compose validado quanto a configuração; Docker estava indisponível. Execução conjunta e persistência não comprovadas |
| Contrato | OpenAPI marca 3 operações implemented e 24 planned, compatível com os mapeamentos lidos | Validação estrutural do OpenAPI relatada; isso não torna operações planned disponíveis |
| Documentação | README informa scaffold, instruções e limites; testes integrados são somente um README de planejamento | Nenhuma CI, jornada autenticada, isolamento de contas ou reserva foi demonstrada na entrega inicial |

Arquivos inspecionados incluem `src/Autoluguel.Api/Program.cs`, `src/Autoluguel.Modules/AutoluguelDbContext.cs`, tipos `RentalPeriod`/`RentalPrice`, testes unitários existentes, `apps/web/src/App.tsx`, `main.tsx`, configurações de web/Playwright, manifests, lockfiles, `compose.yaml`, Dockerfiles, proxy e [OpenAPI](../api/openapi.json). Leitura de arquivos é evidência de estrutura, não de execução atual. O ambiente de 19/10 não foi presumido como ambiente atual.

## Escopo e premissas

**Incluído:** estrutura de pastas e projetos; host com identificação e health; preparo de conexão EF Core/Npgsql; biblioteca de período/preço já existente; apresentação inicial web; configuração local e instruções; contrato que distingue alvo de implementação; testes iniciais e registro honesto de seus limites.

**Excluído:** CI de B01; conta/sessão/CSRF de B02; perfis, catálogo persistido, migrations de negócio, calendário, reservas e painéis das histórias seguintes; testes de isolamento e concorrência dessas funcionalidades; busca LLM; publicação externa ou contratação real. Não exigir entidades, endpoints de negócio ou novos frameworks para considerar a estrutura inicial.

Premissas confirmadas pelas instruções atuais: stack definida, monólito modular, dados sintéticos e ambiente demonstrativo. Limites de 1–30 diárias e diária de 1–10.000.000 centavos são a baseline documentada já refletida nos tipos; não são pesquisa de mercado nem decisão comercial nova deste refinamento. PostgreSQL 17 e readiness apenas de conexão seguem ADR 0002; validação de schema entra com migrations posteriores.

## Fatias de revisão sugeridas

São agrupamentos do escopo existente, sem novos IDs ou ordem de implementação autorizada:

1. **Base e orientação:** mapa da solução, dependências, documentação e limites de demonstração.
2. **Execução mínima:** página inicial, três GETs e biblioteca de regras; depende da base.
3. **Evidência e transferência:** verificações iniciais, configuração local e lacunas explícitas; depende dos artefatos anteriores.

Não há motivo para dividir B00 em novas histórias de produto. Eventuais defeitos encontrados posteriormente devem virar correções pequenas atribuídas pelo coordenador, sem absorver B01/B02.

## Critérios de aceite observáveis propostos

Estes critérios tornam o aceite resumido de B00 mais preciso para revisão do coordenador. As evidências esperadas abaixo não foram produzidas novamente neste trabalho.

1. **Base compilável.** Dado o código e os pré-requisitos documentados, quando as dependências forem restauradas e a solução .NET e web forem compiladas, então ambas terminam com código de saída zero, com versões e resultados registrados. Há lockfiles; instalação não depende de arquivos privados da máquina original. Evidência: execução identificada de `dotnet build Autoluguel.slnx` e, em `apps/web`, `npm ci` e `npm run build`. Fonte: B00 e ADR 0002. Automação em CI fica em B01.
2. **Regras pequenas e exatas.** Dadas datas de calendário e diárias em centavos, quando a biblioteca for verificada, então duração exclui devolução, aceita 1–30 dias, rejeita durações fora do limite, permite períodos adjacentes, identifica sobreposição e calcula totais inteiros dentro de RN08/11/13. Evidência esperada: testes existentes com resultados e término normal de `dotnet test Autoluguel.slnx`. Não comprova agenda persistida nem disputa entre reservas.
3. **Apresentação honesta.** Dado um visitante sem conta, quando abrir a página inicial, então vê nome, públicos atendidos, conteúdo em pt-BR e aviso de demonstração sem contratação/cobrança e sem cadastro, anúncios ou reservas disponíveis. Não há formulário de documentos nem alegação de frota real. Evidência: inspeção da página e testes existentes. Fonte: PRD §6, RN25–26.
4. **Apresentação em telas pequenas.** Dada a página inicial desde 360 px, quando o conteúdo for visualizado, então continua legível, com estrutura semântica e sem rolagem horizontal causada pelo layout. Evidência: verificação pertinente, com viewport declarado. O teste mobile atual usa o preset Pixel 7 e, sozinho, não demonstra o limite de 360 px. Fonte: PRD §6. Auditoria completa de acessibilidade e jornadas permanece em B15.
5. **Infraestrutura identificável.** Dado o host iniciado, quando consultar `/health/live` e `/api/v1/project-info`, então retorna 200; a identificação informa `stage=scaffold`, `sandbox=true` e caráter demonstrativo. Liveness não depende da conexão com banco. Evidência: respostas HTTP, sem segredos. Fonte: Tech Spec §8 e contrato existente.
6. **Falha de dependência explícita.** Dado PostgreSQL indisponível, quando consultar `/health/ready`, então retorna 503 em Problem Details, sem apresentar prontidão ou dados internos de conexão. O caminho 200 significa apenas conexão disponível, sem garantir tabelas ou migrations. Evidência: resposta HTTP e condição do ambiente. O caminho de sucesso continua uma evidência faltante; não inferir defeito ou sucesso a partir da ausência de execução. Fonte: Tech Spec §8–9 e contrato.
7. **Contrato sem funcionalidades fictícias.** Dado o OpenAPI e o host desta fatia, quando comparar operações expostas e status, então somente health e project-info estão implemented; o catálogo planejado não responde como funcionalidade disponível. A ausência do catálogo é limite esperado, e não falha a resolver em B00. Evidência: leitura comparativa, validação estrutural do contrato e HTTP pertinente. Fonte: ADR 0007.
8. **Configuração local utilizável.** Dadas as variáveis de exemplo com senha local substituída, quando a configuração Compose for validada, então resolve db/API/web sem erro e publica portas apenas no loopback. Senha obrigatória ausente produz erro de configuração em vez de um banco com senha padrão silenciosa. `.env` permanece ignorado; as instruções preservam o volume. Evidência: validação da configuração sem registrar valores sensíveis. Fonte: aceite B00, Tech Spec §8 e RN25. Sintaxe válida não equivale a contêineres executados.
9. **Resultados verificáveis.** Dadas as verificações iniciais, quando uma execução não encerrar normalmente ou depender de infraestrutura indisponível, então o relatório registra a lacuna e não apresenta a suite como aprovada. Para uma nova afirmação de sucesso dos testes iniciais, exigir término normal, resultados, ambiente e versão identificada. Fonte: AGENTS.md, ADR 0007 e plano de testes. A política de independência de 22/10 não é atribuída retroativamente aos testes de 19/10.
10. **Orientação e limites claros.** Dado alguém começando pelo README, quando seguir as referências, então encontra pré-requisitos, passos locais, comandos de verificação e distinção entre scaffold, contrato alvo e MVP; nenhuma capacidade RF01–RF08 é marcada como pronta pela B00. Fonte: B00 e PRD §8. Novas garantias de autorização ou disponibilidade exigem suas histórias e testes próprios.

Não há recurso privado, comando de negócio ou sessão em B00 para demonstrar acesso entre contas. O cenário negativo pertinente é a ausência de operações de negócio e de coleta de dados, sem fabricar um teste de autorização. A página estática não faz requisição de catálogo; carregamento, resultado vazio e falha de busca são não aplicáveis aqui e pertencem às respectivas telas futuras. Não há idempotência, versão de recurso ou concorrência persistida a validar nesta história.

## Preparação para desenvolvimento

### Contrato e dados

Contrato existente: GET `/health/live`, GET `/health/ready`, GET `/api/v1/project-info`, conforme [OpenAPI](../api/openapi.json). Este refinamento não propõe endpoint ou campo adicional. A página inicial não depende desses GETs para renderizar. Dados: conteúdo estático de demonstração e datas/valores sintéticos dos testes; nenhum usuário ou veículo real, seed de catálogo ou schema de negócio necessário.

### Dependências e evidências pendentes

- B00 não tem dependência de outra história no backlog. Solução, configuração, documentação e testes iniciais estão presentes.
- Para reproduzir o ambiente: SDK .NET 10, Node/npm, dependências disponíveis e Docker ativo para qualquer execução com PostgreSQL/contêineres. Essas são condições de execução, não histórias entregues.
- Pendências históricas: encerramento normal do Playwright; conexão PostgreSQL bem-sucedida; execução dos contêineres. As duas últimas não devem ser vendidas como comprovadas pela validação sintática do Compose.
- A validação atual não foi solicitada e não aconteceu: não há novos resultados de build, testes, HTTP ou Compose neste documento.
- O aceite original exige “Compose válido”, sem explicitar uma execução ponta a ponta dos três serviços. Recomenda-se manter essa distinção e registrar execução conjunta como evidência operacional ainda faltante, em vez de criar silenciosamente um novo bloqueio retroativo para B00.

### Divisão sugerida, caso o coordenador identifique correções posteriormente

| Responsável | Escopo potencial, somente mediante atribuição posterior |
|---|---|
| Frontend | Defeito da apresentação inicial em `apps/web/src/`, se demonstrado; nenhuma tela de negócio adicional |
| Backend | Defeito nos três GETs ou tipos de período/preço existentes, se demonstrado; nenhuma migration/entidade nova |
| Coordenador | Consolidar critérios e estado; documentação e infraestrutura compartilhada com um único escritor atribuído |
| QA independente | Depois de entrega e congelamento, verificar a versão pertinente; testes úteis existentes e eventuais lacunas proporcionais, com banco descartável separado se necessário |

Nesta solicitação, frontend, backend e QA são **não acionados**. Não há implementação atribuída, versão liberada para QA ou parecer de aprovação.

### Riscos e decisões

- **Evidência histórica tomada por atual:** conservar datas e comandos; não transportar os 18 resultados xUnit ou o build de 19/10 para uma validação atual.
- **Página inicial tomada por marketplace funcional:** preservar aviso e planejado/implementado; login, catálogo e reservas continuam fora.
- **Helpers tomados por integridade de banco:** RN13 no código não implementa RN15; PostgreSQL real e constraints pertencem às próximas histórias.
- **Execução incompleta tomada por sucesso:** Playwright continua pendente quanto ao encerramento; um runner interrompido não equivale a exit code zero.
- **Pequenas inconsistências documentais:** o mapa do README ainda lista somente frontend/backend/qa, embora product tenha sido incluído; o fluxo traz uma afirmação antiga de que a conversa está na pasta pai. São propostas de manutenção documental ao coordenador, não mudanças realizadas nem bloqueios essenciais da B00.

Não há pergunta de produto essencial que impeça este refinamento. Cidade piloto, monetização, fornecedor de e-mail, LLM e licença não precisam ser decididos para a estrutura local. A escolha do momento de repetir verificações pertence à coordenação; não é autorização implícita para implementá-las agora.

### Definition of Ready e conclusão

| Item de Ready | Avaliação |
|---|---|
| Objetivo claro | Sim: base local e limites compreensíveis |
| Regras citadas | Sim: RN08/11/13/25/26 e requisitos técnicos/documentais pertinentes |
| Dependências de histórias | Nenhuma anterior; pré-requisitos de ambiente precisam ser conferidos quando houver execução |
| Contrato suficiente | Sim para os três GETs já definidos; demais operações não pertencem à B00 |
| Dados sintéticos disponíveis | Conteúdo estático e exemplos de testes presentes |

**Ready da especificação:** suficiente para revisão pelo coordenador, sem ambiguidade essencial. **Prontidão de execução:** depende de conferir ambiente e atribuir escopo se houver nova rodada; não avaliada por execução. **Done:** este trabalho não emite conclusão, aprovação ou certificação retroativa. Mantém o status histórico “estrutura entregue com limites” e explicita o que não foi comprovado.

- **Arquivo alterado nesta atribuição:** somente `docs/produto/B00-refinamento.md`.
- **Atividades realizadas:** leitura das fontes e inspeção estática dos arquivos relacionados; redação deste refinamento.
- **Não executado:** implementação, build, testes, instalação, HTTP, Compose, migrations ou QA, conforme pedido.
- **Próximo passo recomendado:** coordenador revisar esta proposta e preservar as lacunas de evidência ao planejar B01/B02. Se decidir repetir ou corrigir algo da base, atribuir uma fatia explícita e seguir a sequência desenvolvimento → entrega → QA independente; nenhuma dessas etapas começa por este documento.
- **Conceito aprendido:** critério de aceite descreve o resultado esperado; evidência mostra se ele foi observado. “Compose validou” demonstra configuração interpretável, enquanto “os três serviços funcionaram juntos” precisa de outra observação. Separar os dois evita prometer uma capacidade que ainda não foi demonstrada.
