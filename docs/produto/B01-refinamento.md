# B01 — Verificação automática de cada alteração

Data: 03/11/2026. Papel: produto. Proposta para revisão do coordenador; sem implementação ou mudança de status no backlog.

- **Origem:** B01 / P0 / M — automatizar build, testes e validação de contrato em CI; depende de B00.
- **Resultado:** `AGUARDANDO_DECISAO` sobre destino do repositório e provedor de CI. O recorte e os critérios abaixo estão definidos para revisão; execução remota ainda não está pronta.
- **Usuário e problema:** como responsável que desenvolve com IA, quero receber um resultado automático e rastreável ao alterar o projeto, para identificar regressões sem repetir manualmente todos os comandos nem confundir build com teste de integração.
- **Valor esperado:** uma alteração deixa evidências de compilação, testes e contrato na versão verificada; uma falha necessária torna a execução malsucedida. Isso apoia a revisão, sem substituir o QA independente.
- **Prioridade/tamanho:** manter P0 / M do backlog, sem prazo novo. A base B00 já foi aprovada; B01 prepara verificações repetíveis para os incrementos seguintes.

## Fontes e estado observado

Foram consultados [AGENTS.md](../../AGENTS.md), [contexto](../contexto-e-premissas.md), [PRD](../PRD.md), [regras](../regras-de-negocio.md), [Tech Spec](../TECH-SPEC.md), [backlog](../backlog.md), [fluxo dos agentes](../agentes/fluxo-de-trabalho.md), [plano de testes](../plano-de-testes.md), ADRs [0002](../adr/0002-stack-e-persistencia.md) e [0007](../adr/0007-contrato-e-testes.md), [refinamento B00](B00-refinamento.md), [parecer B00](../qa/B00-001-parecer.md) e [controle B00](../qa/B00-001-controle.md).

B01 atende ao requisito de manutenção do PRD §7 e à CI prevista na Tech Spec §8. Preserva RN25–26 (dados e demonstração); executa os testes já existentes de RN08/11/13, sem prometer automação das regras ainda não implementadas.

| Área | Evidência disponível | Consequência para B01 |
|---|---|---|
| Base | Parecer final B00 aprovado em 03/11: builds .NET/web, 18 unitários, 4 E2E, OpenAPI e HTTP com/sem PostgreSQL real | Dependência B00 atendida; esses resultados locais não comprovam CI |
| Git/CI | `.git` não encontrado; `git rev-parse --is-inside-work-tree` encerrou com código 128. Inventário não encontrou workflow de CI; `.github`, `.gitlab-ci.yml` e `azure-pipelines.yml` ausentes | Não há remoto identificável nesta pasta nem pipeline implementado; não presumir conta/provedor autorizado |
| .NET | `global.json` permite SDK .NET 10 com rollForward; `Directory.Build.props` gera lockfiles; solução contém aplicação e somente o projeto unitário | CI deve restaurar em modo bloqueado e compilar/testar; gerar lockfile local não equivale a exigir seu uso imutável |
| Web | `package-lock.json` v3, scripts `build` e `test:e2e`; Playwright tem desktop/mobile, `forbidOnly` em CI e não reutiliza servidor em CI | Reutilizar verificações existentes; instalar navegador correspondente, não depender de cache da máquina local |
| Integração | `tests/Autoluguel.IntegrationTests/` contém apenas README; não há projeto integrado à solução | Uma pasta ou um PostgreSQL iniciado não contam como teste de integração executado |
| Contrato | OpenAPI 3.0.3; somente health/live, health/ready e project-info implementados | Validar estrutura/referências, preservando operações `planned`; não chamar endpoints futuros como testes funcionais |
| Ambiente | Compose local usa porta 5432 e volume `postgres_data`; B00 usou container exclusivo descartável | CI precisa de recurso próprio; não reutilizar o banco/volume de desenvolvimento nem executar `down -v` sobre o projeto local |

Foram lidos também README, manifests/lockfile web, configuração e testes Playwright, solução/projetos .NET, Dockerfiles, Compose e `Program.cs`. O refinamento B00 é histórico; suas lacunas de execução foram superadas pelo parecer final, não devem ser reabertas por copiar trechos antigos.

## Escopo, exclusões e premissas

**Mínimo proposto para revisão:** uma configuração de CI no provedor escolhido, executável a partir de checkout novo; restauração por lockfiles; build .NET e web; testes .NET existentes; validação estrutural OpenAPI com ferramenta versionada; integração mínima útil com PostgreSQL 17 descartável; resultado agregado que falha quando qualquer verificação obrigatória falha; instruções e evidências de uma execução real.

**Regressão web incluída na proposta:** executar os testes Playwright já aprovados na B00, incluindo 360 px. Não criar telas nem expandir jornadas. É uma explicitação proposta de “testes” em B01, a consolidar pelo coordenador. Se optar por adiar E2E, registrar a exclusão e sua consequência antes do desenvolvimento; não omitir silenciosamente uma suite existente do resultado apresentado.

**Integração proporcional:** automatizar a verificação já demonstrada manualmente: o host existente conecta a um PostgreSQL exclusivo e readiness retorna 200; indisponibilidade controlada retorna 503, sem skip convertido em sucesso. QA define o teste útil depois das entregas de desenvolvimento. Não criar endpoint, entidade ou migration para satisfazer B01. O foco de B01 é automação, propagação de falha e isolamento do recurso de teste.

**Fora:** deploy, publicação de site/pacote/imagem, push automático de código, operação pública, pagamento, dados reais, ambientes de produção, novas funcionalidades RF01–RF08, testes de reservas inexistentes, LLM, benchmarks, auditoria completa de segurança/acessibilidade, matriz extensa de sistemas operacionais e serviço de testes permanente. Caches são otimização opcional; não são requisito de sucesso. Nenhuma conta paga ou orçamento foi autorizado.

**Premissas confirmadas:** stack e demonstração do projeto; banco descartável separado; não publicar automaticamente; separação desenvolvimento/QA. **Propostas técnicas:** um runner com suporte a .NET 10, Node 24 e PostgreSQL 17; versões de ferramentas registradas e instalação compatível com os lockfiles. Sistema operacional, provedor, gatilhos e nomes de checks serão consolidados na atribuição técnica. Não há preferência aprovada por GitHub.

### Ajuste documental necessário antes da implementação

O plano de testes associa “migração e restauração” a B01/B15; a Tech Spec atribui a primeira migration à identidade/perfis, e o código ainda tem DbContext sem entidades. Menor resolução proposta: B01 fornece automação e banco isolado, cobrindo conexão real; testes de migrations entram quando a primeira migration existir, e restauração operacional permanece no gate pertinente de B15/piloto. Coordenador deve consolidar essa delimitação documental, sem criar schema fictício nem declarar migração/backup testados por B01.

## Fatias sugeridas

São agrupamentos de entrega sob B01, sem novos IDs de backlog:

1. **Decisão e preparação:** escolher destino privado/provedor e identificar permissões, branch alvo e pré-requisitos; preparar configuração revisável localmente. Nenhuma criação/envio externo é autorizado por este documento.
2. **Automação da base:** restauração, builds, suites existentes e validação do contrato, com resultado agregado e logs úteis. Um escritor dos arquivos compartilhados deve ser atribuído pelo coordenador.
3. **Isolamento e prova independente:** após entrega/congelamento, QA cria ou mantém a integração mínima e verifica sucesso, falha propagada, isolamento e limpeza. Ajustes exclusivamente de harness/execução de testes seguem propriedade explícita de QA.
4. **Execução remota e fechamento:** depois da autorização aplicável para envio/configuração externa, verificar a configuração na versão enviada e registrar os resultados. Só arquivo de workflow ou execução local não concluem CI remota.

## Critérios de aceite observáveis propostos

1. **Execução identificável.** Dado o repositório e provedor aprovados, quando uma revisão for submetida pelo gatilho definido, então a execução identifica commit/revisão, versão do workflow, ferramentas e verificações obrigatórias. Sucesso só existe após encerramento normal de todas elas. Evidência: execução real e referência de versão. Fonte: B01, PRD §7 e AGENTS.
2. **Checkout novo e lockfiles.** Dado um runner sem dependências locais do responsável, quando restaurar .NET em modo bloqueado e web com `npm ci`, então usa os lockfiles versionados e não os reescreve. Dada incompatibilidade entre manifest e lockfile, a restauração falha em vez de atualizar silenciosamente. Evidência: execução limpa e cenário negativo seguro. Fonte: B01 e ADR 0007.
3. **Builds e testes reais.** Dada a restauração concluída, quando executar builds .NET/web e suites obrigatórias acordadas, então os comandos concluem, os resultados distinguem testes aprovados/falhos/ignorados e nenhuma suite essencial ausente ou com zero testes é anunciada como executada. Usar como baseline os 18 casos unitários e 4 E2E atuais, sem fixar essas quantidades como limite futuro. Fonte: B01, AGENTS e parecer B00.
4. **Contrato válido.** Dado `docs/api/openapi.json`, quando validar estrutura OpenAPI e referências com ferramenta de versão definida, então o contrato válido passa; alteração sintética inválida falha. Interpretar JSON apenas não atende a esse critério. Operações `planned` continuam propostas, não APIs disponíveis. Evidência positiva/negativa. Fonte: B01 e ADR 0007.
5. **Banco isolado.** Dada uma execução com integração, quando preparar PostgreSQL, então o recurso e a conexão pertencem somente àquela execução, com dados e credenciais sintéticos; a aplicação testada usa explicitamente essa conexão. Execuções concorrentes não compartilham estado, banco nem volume de desenvolvimento. Evidência: identificação dos recursos/conexão sem senha e duas execuções independentes, se o runner suportar concorrência. Fonte: B01 e plano de testes.
6. **Integração com resultado significativo.** Dado o banco exclusivo pronto, quando o teste da capacidade existente consultar readiness, então observa 200; dado banco indisponível de forma controlada, observa 503. Se o recurso obrigatório não iniciar, a etapa/pipeline falha com diagnóstico, em vez de pular e aprovar. Isso prova integração de conexão, não migrations, constraints ou reservas. Fonte: Tech Spec §8 e escopo proporcional de B01.
7. **Falha bloqueia sucesso.** Dada uma versão de teste em branch/execução descartável autorizada, quando QA provocar uma falha controlada em teste, validação ou comando obrigatório, então o status agregado fica malsucedido; nenhuma opção equivalente a ignorar erro o transforma em verde. A falha de teste deve ser efetivamente demonstrada, sem enfraquecer testes principais. Evidência: execução negativa e repetição positiva na versão íntegra. Fonte: aceite B01.
8. **Limpeza inclusive em falha.** Dado um run aprovado, falho ou cancelado, quando finalizar, então executa a limpeza dos recursos exclusivos ou comprova que o runner os descarta; não remove recursos preexistentes. Timeouts de espera/execução são limitados, com diagnóstico. Evidência: sucesso/falha/cancelamento e rastreio da limpeza. Fonte: banco isolado de B01 e AGENTS.
9. **Permissões e segredos.** Dado código de revisão não confiável, quando a CI executar, então não recebe credenciais de produção/publicação nem permissão de escrever no repositório sem necessidade explícita. Não há `.env` local, documentos reais ou chave `VITE_*` secreta no run; logs e artefatos não expõem senha/token ou corpo sensível. Credenciais de banco são sintéticas e limitadas ao recurso do run. Evidência: inspeção de permissões, eventos e saídas pelo QA. Fonte: RN25, PRD §7 e AGENTS.
10. **Sem publicação automática.** Dada execução com sucesso, quando a CI terminar, então não publica aplicação, imagem, pacote, site ou dados, nem executa migration em banco compartilhado. Relatórios de teste restritos e sanitizados no provedor escolhido são evidência de CI, não release do produto. Fonte: aceite explícito B01.
11. **Instruções e limites.** Dado um revisor, quando consultar a documentação da entrega, então encontra gatilhos, checks, pré-requisitos, forma de reproduzir comandos, falhas conhecidas e distinção entre resultado do pipeline e política de merge. Falha de CI não é apresentada como bloqueio de merge configurado sem evidência dessa configuração externa. Fonte: B01 e AGENTS.

“Falha bloqueia pipeline” significa execução obrigatória malsucedida. **Exigir checks para permitir merge** é uma política separada no serviço do repositório: depende de permissões, configuração e capacidades disponíveis. B01 não presume essa política já ativa. Se o responsável quiser incluí-la, o coordenador deve atribuir a configuração externa e obter evidência; não prometer suporte de plano não verificado.

Não há novos comandos de negócio nesta história. RN22/23 e testes de concorrência/IDOR de reservas são não aplicáveis ao incremento atual; não inventar cobertura por uma execução de CI verde. Acesso indevido pertinente aqui é código de revisão receber privilégios/segredos desnecessários. Estados de UI de catálogo/formulários pertencem às histórias futuras.

## Preparação para desenvolvimento

### Contrato e dados

Preservar [OpenAPI](../api/openapi.json) e os três GETs existentes. Não há novo contrato HTTP ou interface de produto. Contrato operacional proposto: etapas obrigatórias, entradas de versão/ambiente/conexão de teste, códigos de saída e relatórios sanitizados. Nomes de variáveis e checks serão definidos tecnicamente antes da integração.

Dados: casos de datas/centavos existentes, conteúdo estático web e banco vazio exclusivo para conexão. Sem usuários/veículos reais ou seed de marketplace. Ferramenta de validação OpenAPI precisa de versão definida; o uso temporário de swagger-cli na B00 não equivale a dependência de CI aprovada. O coordenador/especialista deve escolher uma ferramenta adequada e registrar a resolução, sem usar `latest` implicitamente.

### Dependências, decisões e ações externas

- **Entregue:** B00, conforme parecer final e controle de 03/11. Esse é o único pré-requisito de história no backlog.
- **Pendente essencial:** definir destino do repositório e provedor para escrever a configuração específica e demonstrar execução real. Não há remoto nesta pasta.
- **Pendente operacional:** disponibilizar runner compatível, acesso aos registries e permissões do provedor. Não presumir que a configuração Windows/Rancher da máquina local existe no runner.
- **Não autorizado por este refinamento:** criar conta ou repositório externo, publicar o código, enviar commits, configurar tokens ou mudar proteção de branch. Escolher o destino é decisão de planejamento; efetuar o envio/configuração externa exige autorização aplicável separada. Um remoto privado não é publicação pública, mas ainda é envio externo.

Pergunta essencial ao responsável, a ser apresentada pelo coordenador: **onde o projeto e a CI devem ficar?**

| Opção | Consequência para a preparação |
|---|---|
| Repositório privado no serviço já usado pelo responsável | Informar serviço/destino; aproveitar sua administração existente, sem pressupor qual é |
| Novo repositório privado, sem preferência atual | GitHub + Actions pode ser uma proposta concreta para monorepo, mas requer escolha explícita; recursos/permissões/custos devem ser verificados antes de configurar |
| Apenas arquivos locais por enquanto | Permite preparar comandos e proposta; CI hospedada não pode ser marcada concluída sem destino e execução |

**Recomendação contextual:** preferir o serviço privado que o responsável já administra. Na ausência de preferência, apresentar GitHub + Actions como opção a confirmar, sem alegar decisão anterior ou gratuidade. Não tornar o repositório público: licença está em aberto no contexto e publicação não foi autorizada. Não existe outra decisão de negócio necessária para B01; cidade piloto, monetização, e-mail e LLM não bloqueiam automação da base.

### Divisão sugerida e ordem de trabalho

| Papel | Responsabilidade sugerida, a confirmar na atribuição |
|---|---|
| Coordenador | Consolidar provedor/escopo/gatilhos; atribuir um escritor dos arquivos CI/manifests/solução; separar decisão de destino de autorização de envio; conferir entregas e congelar versão |
| Backend | Se receber atribuição explícita dos arquivos compartilhados, implementar orquestração CI/ambiente .NET e PostgreSQL e documentação operacional; executar testes existentes, sem criar ou editar testes/harness |
| Frontend | Não aplicável à UI. Participação pontual somente se houver necessidade concreta de configuração de build web atribuída; não inventar telas ou alteração em Playwright |
| QA independente | Só após entregas/congelamento: manter testes úteis, criar integração mínima faltante e cenários de falha/isolamento; pode ajustar harness e dependências/CI de testes com propriedade exclusiva explícita conforme fluxo; verificar a versão final executada |

A necessidade de integração ainda não automatizada não autoriza desenvolvedor a criar testes. A configuração entregue deve explicitar dependência do harness que QA produzirá; uma etapa ausente/placeholder não pode compor a aprovação final. Não antecipar QA para trabalhar em paralelo com desenvolvimento incompleto. Se QA detectar defeito de produto/configuração de aplicação, devolver ao responsável, receber nova entrega e liberar nova rodada. Alterações compartilhadas apenas para execução do harness devem ser registradas e verificadas na referência final.

### Riscos e evidências esperadas de QA

- Verde falso por ignorar códigos de saída, não descobrir testes ou não iniciar PostgreSQL: demonstrar falhas controladas e contagens reais.
- Lockfile presente, mas restauração alterando resolução: executar ambiente novo e cenário de incompatibilidade.
- Isolamento apenas no nome: conferir conexão efetiva, recursos por execução e limpeza; nunca apontar para banco local/compartilhado.
- Cache mascarando ausência de instalação: primeira execução sem cache e instalação explícita de navegador se E2E incluído.
- Workflow presente confundido com run remoto ou merge protegido: registrar separadamente artefato, execução e política externa.
- Código de revisão/artefato como entrada não confiável: verificar permissões mínimas e ausência de segredos; não publicar traces com dados sensíveis.
- Suite B00 verde confundida com MVP: manter limites atuais e ampliar suites só quando cada história entregar comportamento.

### Definition of Ready

| Item | Avaliação |
|---|---|
| Objetivo e critérios | Definidos nesta proposta, para consolidação do coordenador |
| Regras e dependência B00 | Referenciadas; B00 concluída com evidências independentes |
| Contrato de produto/dados sintéticos | Existentes e suficientes; nenhuma API nova |
| Provedor/destino e contrato operacional específico | Pendentes; impedem fechar atribuição de arquivos e execução hospedada |
| Ambiente/autorizações externas | A conferir quando destino e forma de execução forem decididos |

**Ready:** ainda não para implementação completa da CI específica, por decisão essencial de destino/provedor. Uma proposta local pode ser preparada depois de consolidar escolhas, sem implicar autorização externa. **Done:** futuro parecer independente e execução real dos critérios na versão identificada; não emitido neste trabalho.

- **Arquivo escrito:** somente `docs/produto/B01-refinamento.md`.
- **Realizado:** leituras e inventário de fontes/configuração; verificação de ausência de Git/arquivos CI; redação da proposta. Nenhum segredo lido ou remoto consultado.
- **Não realizado:** implementação, instalação, build, testes, execução de CI, criação de repositório, envio externo ou QA.
- **Próximo passo recomendado:** coordenador apresentar a escolha de destino/provedor ao responsável e consolidar escopo, inclusive suites e delimitação de migrations. Depois atribuir arquivos e preparar uma entrega revisável, mantendo ações externas sob autorização aplicável.
- **Conceito aprendido:** CI é o mecanismo que executa verificações; proteção de merge é a regra que exige seus resultados. Um teste falhar pode deixar a execução vermelha, mas isso não demonstra que o serviço impede alguém de integrar a alteração.
