# ADR 0003 — Identidade e isolamento PF/PJ

Status: adotado no desenho, pendente de implementação. Data: 19/10/2026.

Contexto: mesma pessoa pode alugar e anunciar; uma locadora pode precisar de equipe futuramente; MVP deve evitar documentos de identidade.

Decisão: conta Identity única, perfil anunciante opcional PF ou PJ autodeclarado, único por conta. PJ tem um responsável. Propriedade derivada da sessão e checada no servidor; rotas privadas alheias devolvem 404. Cookies HttpOnly com antiforgery e proxy de mesma origem; admin provisionado separadamente.

Alternativas: contas distintas de locador/locatário duplicam identidade; multiempresa/equipes exigem memberships/papéis adicionais; JWT persistido no navegador aumenta exposição a extração de token e complexidade de revogação para este caso.

Consequências: onboarding curto e política consistente; usuário não pode administrar várias locadoras ou delegar tarefas ainda. Tipo PF/PJ não é prova de identidade. Cookies exigem CSRF explícito e configuração HTTPS adequada.

Revisar ao adicionar equipes: criar organização/membership e migrar ownership de forma controlada, preservando IDs/histórico. Nenhuma autenticação real está implementada no scaffold.
