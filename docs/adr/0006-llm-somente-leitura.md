# ADR 0006 — LLM após a busca estruturada

Status: adotado no desenho; fora do MVP inicial. Data: 19/10/2026.

Contexto: o objetivo pedagógico inclui LLMs, mas catálogo, preço, agenda e autorização exigem resultados determinísticos.

Decisão: IA como assistente de desenvolvimento desde o início. IA no produto depois: intenção → filtros em schema → validação no servidor → Catalog → resposta com dados do banco. Flag desligada por padrão; fallback; limite de custo/tempo; suite de avaliação; adapter sem fornecedor escolhido.

Alternativas: agente com SQL/ferramentas de escrita é excessivo e pode ultrapassar permissões; embeddings para todos os filtros adicionam custo sem necessidade; só busca tradicional atende o núcleo, mas não todo o objetivo futuro de estudo.

Consequências: experimentação limitada e mensurável; linguagem natural pode exigir clarificação e não atender toda consulta. RAG só para FAQ se avaliação justificar. Não incluir segredos ou dados pessoais no prompt.

Revisar autonomia somente com escopo separado, provas de autorização e avaliação adversarial. Modelo nunca será fonte de verdade de preço ou disponibilidade.
