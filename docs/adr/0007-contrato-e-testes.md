# ADR 0007 — Contrato e evidência de testes

Status: adotado na baseline. Data: 19/10/2026.

Contexto: frontend e backend evoluem com auxílio de IA; é fácil gerar endpoints inconsistentes ou alegar testes que não comprovam regras.

Decisão: OpenAPI versionado como contrato alvo, com status de implementação por operação. Sincronizar antes de implementar uma história. xUnit para domínio/integração, PostgreSQL real para constraints e Playwright para jornadas. Lockfiles registram dependências resolvidas. Distinguir planned de implemented na documentação.

Alternativas: só exemplos manuais não cobrem falhas; gerar contrato exclusivamente de código impede discutir primeiro; duas fontes manuais de contrato e coleção exigiriam sincronização desnecessária nesta fase.

Consequências: interface revisável e testes por risco; custo de manter contrato e comportamento coerentes. Não foi criado workspace Postman nem publicação externa. Uma coleção pode ser gerada do OpenAPI quando houver API funcional.

Revisar ao introduzir consumidores externos: validação automática de breaking changes e geração de cliente. Scaffold prova apenas seu escopo documentado.
