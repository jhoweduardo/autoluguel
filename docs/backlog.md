# Backlog inicial

Fluxo aplicável às próximas histórias: frontend/backend implementam e entregam; somente então QA independente cria e executa os testes. A atividade de teste integra cada história, não fica adiada para B15. Correções voltam aos desenvolvedores e passam novamente por QA. Consulte [coordenação dos agentes](agentes/fluxo-de-trabalho.md).

Após parecer `APROVADO` e registro `CONCLUIDA` para a mesma versão, o coordenador aciona `closeout` para conferir os critérios aceitos e suas evidências. Se houver lacunas, preserve os originais e devolva ao coordenador. Após consolidação, o item deve apontar para o registro final em `docs/entregas/<ID>.md`; só então podem sair os documentos transitórios exclusivos inventariados, recuperáveis e autorizados.

Estimativas relativas: S = pequena, M = média, L = grande; não equivalem a dias nem compromisso de prazo. Todo item começa como **a fazer**, salvo B00 (estrutura inicial concluída com QA independente em 03/11/2026; consultar evidências). P0 conclui o MVP; P1 é evolução. Executar por dependências, com uma história pequena por vez.

| ID / prioridade / tamanho | História e resultado | Dependências | Aceite verificável |
|---|---|---|---|
| B00 / P0 / M | Como desenvolvedor, iniciar web, host, bibliotecas e documentação | — | Build e testes iniciais; Compose válido; README distingue scaffold e produto. Estado: concluída em 03/11/2026, restrita à estrutura inicial; [entrega final e evidências de QA](entregas/B00.md). Não representa MVP concluído. |
| B01 / P0 / M | Automatizar build/testes/validação de contrato em CI | B00 | Checkout limpo usa lockfiles; falha de teste bloqueia pipeline; banco de teste isolado; sem publicação automática. |
| B02 / P0 / L | Cadastrar, entrar, sair e proteger sessão com Identity | B00 | RF01 e RN01/03–05; senha não aparece em logs; 401 JSON; CSRF testado; cadastro não concede admin. |
| B03 / P0 / M | Recuperar conta com e-mail de desenvolvimento e limitar abuso | B02 | Resposta genérica para conta inexistente; token expira e é de uso único; rate limit retorna 429; nenhuma mensagem real enviada. |
| B04 / P0 / M | Criar perfil autodeclarado PF/PJ | B02 | RF02/RN02; usuário sem perfil pode alugar; um perfil por conta; outro usuário não lê campos privados nem edita. |
| B05 / P0 / L | Criar e editar veículo com imagem sintética | B04 | RN06–09; carro e moto; validação de BRL/UF/ano; IDs de dono não vêm do cliente; versão obsoleta recebe 412. |
| B06 / P0 / M | Publicar, pausar e arquivar anúncios | B05 | RF03/RN10; estados válidos; oferta oculta sai da busca; snapshot/histórico preservados. |
| B07 / P0 / L | Persistir agenda e impedir sobreposições | B05 | RN11–16; migration com GiST; manual × reserva e reserva × reserva concorrentes; limites adjacentes permitidos em PostgreSQL real. |
| B08 / P0 / M | Buscar por cidade, tipo, preço e período | B06,B07 | RF04; filtros combinados e paginação; datas em par; resultados só publicados e livres; estado vazio e erro acessíveis. |
| B09 / P0 / M | Exibir detalhe público e estimativa | B08 | Diárias e total corretos; apenas dados públicos; preço e disponibilidade indicativos; proprietário vê rascunho por rota autorizada. |
| B10 / P0 / L | Criar solicitação com snapshot e idempotência | B02,B07,B09 | RN09/17/18/22; proibir veículo próprio; PriceChanged; duplo clique/retry cria uma solicitação; prazo depende do relógio. |
| B11 / P0 / L | Aceitar, recusar e cancelar com integridade | B10 | RN19/20/23/24; um vencedor em corrida de aceites; erro de autorização; rollback sem ocupação órfã; cancelamento libera agenda atomicamente. |
| B12 / P0 / M | Expirar pendentes e concluir simulação | B11 | RN18/21; worker repetível; instante exato e meia-noite testados; aceite vencido falha mesmo com job atrasado. |
| B13 / P0 / M | Acompanhar solicitações e frota no painel | B06,B11,B12 | RF07; filtro no servidor por dono/locatário; contagens consistentes; sem saldo financeiro; estados vazios. |
| B14 / P0 / M | Moderar anúncios/contas e auditar | B02,B06,B11 | RF08; apenas admin; motivo obrigatório; bloqueio de novos aceites; não cancelar existentes silenciosamente. |
| B15 / P0 / L | Validar jornadas, acessibilidade e resiliência | B03,B08,B12,B13,B14 | E2E PF/PJ × carro/moto; teclado/foco; CSRF/IDOR; banco indisponível; desempenho medido; nenhuma falha crítica. |
| B16 / P0 / M | Conduzir piloto sintético e revisar hipóteses | B01,B15 | Gate PRD; roteiro de 10 participantes proposto; eventos sem PII; achados e decisão continuar/ajustar registrados. |
| B17 / P1 / M | Isolar adapter de LLM e criar avaliação offline | B08,B16 | ≥ 40 casos rotulados; baseline determinística; fake de testes; timeout; nenhuma chave no cliente; gate L3/L4. |
| B18 / P1 / L | Oferecer busca conversacional somente leitura | B17 | Schema validado; ambiguidades esclarecidas; dados hidratados do catálogo; fallback; gates de segurança/qualidade/custo. |
| B19 / P1 / M | Experimentar RAG para FAQ, se necessário | B18 e evidência de falha de FAQ | Comparar com busca simples; citar trechos versionados; teste de injeção; só adotar se ganho medido. |
| B20 / P1 / L | Preparar piloto externo com dados reais | Revisão separada de produto/operação | Finalidades/retenção, hospedagem, suporte, incidentes e responsabilidades definidos; fora do gate do sandbox; não equivale a autorizar locações reais. |

## Ordem prática e fatias revisáveis

Primeira fatia: B02 login básico + autorização + teste negativo, sem recuperar conta. Segunda: B04 PF e PJ com mesma API. Terceira: B05/B06 anúncio sintético publicável. Evitar implementar todos os módulos por camadas antes de ter uma jornada ponta a ponta.

Histórias L devem ser divididas sem perder seus invariantes. Ex.: B11a transições e autorização; B11b transação/constraint; B11c concorrência e reenvio; só marcar B11 concluída após as três.

## Template para uma história

```text
ID e resultado para o usuário:
Requisitos e regras envolvidos:
Premissas a confirmar:
Contrato afetado:
Cenário feliz:
Cenário de acesso indevido:
Cenário de falha/concorrência:
Critérios de aceite observáveis:
Evidência de teste:
O que aprendi e o que não foi implementado:
```

## Definition of Ready / Done

Ready: objetivo claro, regra citada, dependências prontas, contrato suficiente e dados sintéticos disponíveis. Done: aceite demonstrado, testes úteis, autorização negativa, UI de erros, docs sincronizadas e sem segredos. B00 não dá por concluídas as histórias seguintes. Não estimar datas de entrega sem conhecer disponibilidade semanal e velocidade observada.
