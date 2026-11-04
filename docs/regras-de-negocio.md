# Regras de negócio

Versão 0.1. Regras propostas como baseline; IDs estáveis permitem rastreabilidade com histórias e testes. Nenhuma regra deste documento implica implementação concluída.

## Identidade, perfil e acesso

| ID | Regra |
|---|---|
| RN01 | Conta única por e-mail normalizado; um usuário pode alugar e anunciar. Ser anunciante não concede acesso administrativo. |
| RN02 | Um perfil anunciante por usuário: Individual (PF) ou Business (PJ), autodeclarado. PJ tem um responsável, sem equipe. Sem documentos ou validação de identidade. |
| RN03 | Toda operação privada deriva UserId da sessão. OwnerProfileId do anúncio deriva do perfil dessa conta. Nunca aceitar esses valores como autoridade do cliente. |
| RN04 | Visitante acessa somente projeções públicas de Published. Proprietário vê seus rascunhos; somente locatário, anunciante e administrador autorizado veem reserva. Recurso privado alheio retorna 404. |
| RN05 | Conta suspensa não cria nem confirma operações. Acesso de leitura ao próprio histórico e cancelamentos permitidos permanece disponível. Administrador é provisionado fora do cadastro público. |

## Catálogo e dinheiro

| ID | Regra |
|---|---|
| RN06 | Um anúncio é um veículo individual, Car ou Motorcycle. Estados: Draft → Published ↔ Paused; Draft/Published/Paused → Archived; administrador pode suspender qualquer anúncio não arquivado. Suspended só volta a Paused após revisão. Archived é terminal no MVP. |
| RN07 | Publicar requer perfil, título (5–100), marca/modelo (1–60 cada), ano entre 1900 e ano corrente + 1, descrição (20–2000), cidade (2–100), UF brasileira válida, diária e imagem de demonstração válida. |
| RN08 | Diária entre 1 e 10.000.000 centavos (limite técnico proposto, não preço de mercado). BRL apenas. Total = diária × número de dias, sem desconto, taxa, seguro ou caução. Inteiros de 64 bits no backend; limite impede overflow e imprecisão no cliente. |
| RN09 | Solicitação armazena snapshot de diária, total, moeda e período. Alterações posteriores do anúncio não recalculam o snapshot. Cliente informa expectedDailyRateCents; divergência com valor atual resulta em 409 PriceChanged, pedindo nova confirmação. |
| RN10 | Pausar/arquivar/suspender remove oferta da busca e impede novas solicitações e aceites. Não altera confirmação existente nem apaga histórico. Publicar novamente não modifica reservas antigas. |

## Datas e disponibilidade

| ID | Regra |
|---|---|
| RN11 | Intervalo `[startDate, endDate)` em datas ISO, início inclusivo, fim exclusivo. Duração mínima 1 e máxima 30 diárias. Ex.: 20/10 a 23/10 = 3 diárias. Retirada/devolução sem horário nesta fase. |
| RN12 | Criar solicitação ou bloqueio exige startDate ≥ data atual em America/Sao_Paulo. O produto adota esse fuso único no piloto; expansão geográfica exige revisão. Timestamps de criação/expiração/auditoria são UTC. |
| RN13 | Dois períodos se sobrepõem quando A.start < B.end e B.start < A.end. 20–23 e 23–25 não conflitam. |
| RN14 | Pending não ocupa agenda. Accepted cria ocupação; bloqueio manual cria ocupação do mesmo tipo lógico. Agenda pública retorna apenas faixas ocupadas, sem detalhes de reserva ou usuário. |
| RN15 | Uma constraint PostgreSQL impede sobreposição de ocupações ativas por veículo, incluindo manual × reserva e reserva × reserva. Verificar primeiro no código melhora mensagem, mas não substitui constraint/transação. |
| RN16 | Bloqueio manual não pode sobrepor reserva aceita. Apenas dono ou administrador remove bloqueio. Cancelar reserva aceita desativa sua ocupação na mesma transação. Ocupações concluídas permanecem históricas. |

## Reserva demonstrativa

| ID | Regra |
|---|---|
| RN17 | Somente conta ativa pode solicitar anúncio Published de outro anunciante. Dono não reserva o próprio veículo. Solicitação conflitante com ocupação ativa recebe 409. Pendentes entre si podem sobrepor. |
| RN18 | Pending expira em min(criação + 24h, início do dia seguinte à startDate no fuso do produto). Worker periódico processa; toda leitura apresenta estado efetivo e todo comando revalida deadline. Aos exatos expiresAt, não aceitar. |
| RN19 | Aceite revalida estado, deadline, startDate ≥ hoje, publicação, conta das partes, propriedade, versão e agenda. Aceite e ocupação são atômicos. Solicitações pendentes concorrentes permanecem Pending até decisão/expiração; a UI informa conflito ao tentar aceitar. |
| RN20 | Cancelamento de Accepted é permitido às partes somente se hoje < startDate. Após início, só administrador pode cancelar, com motivo. Pending pode ser cancelada pelo locatário antes de expirar; anunciante usa Reject. Não existe reembolso. |
| RN21 | Worker marca Accepted como Completed quando hoje ≥ endDate. Não representa vistoria, devolução real ou pagamento. Job é idempotente e transições são condicionais à versão/estado. |
| RN22 | Comandos repetidos com mesma chave de idempotência, conta, método e rota retornam a resposta original; payload diferente na mesma chave retorna 409 IdempotencyConflict. Registro dura pelo menos 48h. Constraint de chave única e transação evitam duplicação por requisições simultâneas. |
| RN23 | Atualizações de recurso usam version/If-Match. Versão obsoleta retorna 412; cabeçalho ausente, 428. Retry idempotente reconhecido ocorre antes da validação de versão. Não repetir automaticamente um comando com payload alterado. |
| RN24 | Toda mudança de estado registra ator, origem (usuário/job/admin), de/para, instante UTC, motivo quando aplicável e correlationId. Logs não incluem senha, tokens, e-mail ou descrição livre do anúncio. |

### Máquina de estados

| Origem | Destino | Ator | Condições adicionais |
|---|---|---|---|
| inexistente | Pending | locatário | RN09, RN11–12 e RN17; snapshot e deadline calculados |
| Pending | Accepted | anunciante | RN19; ocupação criada atomicamente |
| Pending | Rejected | anunciante | Ainda não expirada; motivo curto opcional |
| Pending | Cancelled | locatário ou admin | Antes de expirar; admin informa motivo |
| Pending | Expired | sistema | now ≥ expiresAt ou startDate < hoje |
| Accepted | Cancelled | partes ou admin | RN20; desativa ocupação |
| Accepted | Completed | sistema | RN21 |

Rejected, Cancelled, Expired e Completed são terminais. Uma nova tentativa de locação cria nova solicitação com nova chave. Não há transição InUse no MVP; o calendário resolve o período vigente.

### Cenários de referência

- Veículo a R$ 120,00/dia, 20–23/10: total R$ 360,00. Alterar diária para R$ 150,00 não muda o snapshot existente.
- Duas Pending para 20–23 e 21–24: ambas possíveis. Dois aceites simultâneos: exatamente um Accepted, outro recebe 409; nenhum registro de ocupação órfão.
- Bloqueio manual 22–24 simultâneo ao aceite 20–23: só uma ocupação persiste.
- Cancelar em 19/10 uma Accepted com início 20/10 libera agenda; em 20/10 exige admin.
- Solicitação de hoje expira no máximo no início do dia seguinte, mesmo que isso resulte em menos de 24h.
- Conta B acessando `/reservations/{id-de-A}` recebe 404 mesmo conhecendo o UUID.

## Segurança e escopo de dados

RN25 — Não coletar documentos, números de documentos, placa, localização exata, dados bancários, biometria ou dados de cartão. Campos livres têm instrução para não inserir esses dados e moderação; não afirmar que filtros automáticos impedem todo vazamento.

RN26 — UI, notificações e endpoints deixam explícito o caráter demonstrativo. Não há contato externo automático, contrato nem garantia de disponibilidade física. Dados sintéticos são o padrão.

RN27 — Busca conversacional futura é somente leitura. Filtros são validados contra schema e catálogo permitido; o servidor reaplica publicação, autorização e disponibilidade. Respostas finais usam preços e IDs do banco. Nenhum texto de anúncio pode autorizar ferramentas ou alterar regras.
