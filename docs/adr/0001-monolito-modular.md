# ADR 0001 — Monólito modular e monorepo

Status: adotado na baseline. Data: 19/10/2026.

Contexto: projeto individual de aprendizado, domínio com várias responsabilidades, necessidade de transação entre reserva e agenda e stack .NET solicitada.

Decisão: um deploy de API, uma biblioteca com módulos por pasta/namespace, um banco e um repositório com frontend, backend e documentação. Host compõe módulos; contratos internos delimitam acesso a dados. Um DbContext compõe configurações por schema na primeira fase.

Alternativas: microsserviços adicionariam rede, consistência eventual e operação antes de haver demanda; monólito sem módulos reduziria disciplina; vários projetos por camada de cada módulo criariam custo sem implementação suficiente.

Consequências: desenvolvimento e depuração simples; transações locais; fronteiras dependem de revisão e teste de arquitetura. Mudanças podem exigir implantação conjunta. Não é isolamento físico por módulo.

Revisar se houver times autônomos, escala distinta comprovada ou implantação independente necessária. Scaffold cria biblioteca e responsabilidades; isolamento automatizado será adicionado com código de negócio.
