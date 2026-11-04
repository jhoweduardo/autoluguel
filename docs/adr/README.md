# Architecture Decision Records

Status “adotado na baseline” identifica escolhas deste scaffold/desenho. Não significa funcionalidade pronta nem validação de negócio pelo usuário. Alterações significativas geram novo ADR referenciando o substituído, preservando histórico.

| ADR | Decisão | Status |
|---|---|---|
| [0001](0001-monolito-modular.md) | Monólito modular e monorepo | Adotado na baseline |
| [0002](0002-stack-e-persistencia.md) | Stack solicitada, PostgreSQL e EF Core | Adotado na baseline |
| [0003](0003-identidade-perfis-isolamento.md) | Conta única, perfil PF/PJ, cookies e isolamento | Adotado no desenho; pendente de implementação |
| [0004](0004-disponibilidade-e-concorrencia.md) | Intervalos `[)` e ocupação protegida no banco | Adotado no desenho; constraint pendente |
| [0005](0005-sandbox-e-escopo.md) | Sandbox sem contratação nem documentos | Adotado na baseline |
| [0006](0006-llm-somente-leitura.md) | Busca LLM posterior e somente leitura | Adotado no desenho; fora do MVP |
| [0007](0007-contrato-e-testes.md) | Contrato primeiro e testes por risco | Adotado na baseline |

Template para próximos ADRs: contexto, decisão, alternativas, consequências positivas/negativas, estado de implementação e gatilho para revisão. Data de todos os registros iniciais: 19/10/2026.
