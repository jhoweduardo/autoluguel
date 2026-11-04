# Contexto, procedência e premissas

Data: 19/10/2026. Versão inicial 0.1. Responsável por validar produto: dono do projeto.

## Confirmado pelo pedido atual e pelas mensagens recuperadas

- Nome: Autoluguel; mercado brasileiro de aluguel de carros e motos.
- Público de oferta: pessoas físicas e pequenas locadoras sem estrutura para manter um site próprio; ambos no mesmo marketplace.
- Objetivo imediato: desenvolver o produto para estudar LLMs e criação de software com IA.
- Stack solicitada: React, TypeScript, Vite, Material UI; .NET 10 ASP.NET Core, monólito modular; PostgreSQL/EF Core; Docker Compose; xUnit e Playwright.
- Módulos: identidade, perfis PF/PJ, catálogo, disponibilidade, reservas, painel; busca conversacional futura.
- Entrega solicitada: estrutura inicial, PRD, Tech Spec, AGENTS.md, regras, ADRs, backlog e roadmap de aprendizado.
- Prioridade: MVP sem transações reais de seguro/pagamento ou documentação de identidade.

Referência: conversa “Aplicativos de aluguel automotivo”, ID `6ad297fc-22f0-83ea-9539-c55d98f07041`. As mensagens do usuário foram recuperadas; respostas anteriores do assistente vieram como marcadores de referência sem texto. Não foi possível recuperar análises, números ou decisões presentes nessas respostas.

## Decisões propostas para permitir o desenvolvimento

Estas decisões são reversíveis e não foram atribuídas ao usuário: operação em sandbox com dados sintéticos; reserva mediante aceite do anunciante; diária por data, sem horário; duração de 1 a 30 diárias; solicitação pendente expira em até 24 horas; um perfil anunciante por conta; nenhuma equipe PJ; mesma política de reserva para carros e motos; preço único por diária; nenhuma taxa; uma praça piloto a escolher; lançamento por convites somente após revisão.

ADRs registram a baseline técnica desta entrega. “Adotado” significa adotado no desenho inicial, não aprovação comercial, jurídica ou conclusão de implementação.

## Questões abertas — não bloqueiam a estrutura inicial

| Questão | Padrão usado nesta versão | Momento de decidir |
|---|---|---|
| Cidade/UF piloto | Nenhuma cidade real priorizada; cenários sintéticos | Antes de recrutar participantes |
| Permitir uso real de veículos | Não | Projeto separado de lançamento real |
| Monetização | Nenhuma cobrança no MVP | Após validar oferta, demanda e operação |
| Recuperação de conta/e-mail | Serviço local de desenvolvimento; fornecedor em aberto | História B03 |
| Imagens | Assets sintéticos locais; upload futuro controlado | História B05 |
| Verificação de PF/PJ | Tipo declarado, sem selo de verificado | Antes de qualquer operação real |
| Hospedagem e orçamento | Local; orçamento pago não autorizado | Antes de piloto externo |
| Provedor e modelo LLM | Não escolhido; adapter e avaliações primeiro | Fase L4 |
| Licença do código | Em aberto | Antes de publicação |

## Local da entrega

Foi confirmada leitura da pasta desta conversa em `C:\Users\JhonatanEduardo\Documents\Codex\2026-10-19\referenced-chatgpt-conversation-this-is-an`. Os arquivos foram criados dentro de `outputs\Autoluguel`, área gravável do workspace. A busca no diretório Codex não identificou arquivos de um projeto Autoluguel prévio; não se presume ausência de projetos em outros locais do computador. Um ZIP permite transferir a estrutura para o diretório definitivo.
