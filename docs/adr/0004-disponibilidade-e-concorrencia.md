# ADR 0004 — Agenda e concorrência

Status: adotado no desenho; tipos puros iniciais presentes, persistência pendente. Data: 19/10/2026.

Contexto: validação apenas na aplicação pode confirmar duas solicitações simultâneas. Bloqueios manuais também competem pela agenda.

Decisão: datas `[retirada, devolução)`, 1–30 diárias. Pending não retém veículo. Accepted e bloqueios manuais criam Occupancy na mesma tabela; GiST exclusion constraint impede sobreposição ativa por veículo. Transação cobre reserva, ocupação, auditoria e idempotência. Serializar mudanças relevantes do anúncio e aceite na linha do veículo.

Alternativas: disponibilidade booleana não representa períodos; um calendário por dia aumenta linhas sem necessidade atual; lock só em memória falha entre processos; hold de pendentes bloquearia oferta por usuários que não concluem.

Consequências: proteção no banco, limites adjacentes claros; várias solicitações podem disputar o mesmo período e o primeiro aceite válido vence. É necessário comunicar conflito e tratar SQLSTATE 23P01. Fuso único do piloto e ausência de horários limitam operação nacional.

Revisar ao adicionar reserva instantânea, holds pagos, horários de retirada ou múltiplos fusos. Não usar teste em memória como evidência desta decisão.
