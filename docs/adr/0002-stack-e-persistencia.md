# ADR 0002 — Stack e persistência

Status: adotado na baseline. Data: 19/10/2026.

Contexto: stack explicitamente pedida; necessidade de integridade relacional e filtros por agenda.

Decisão: React/TypeScript/Vite/Material UI, ASP.NET Core .NET 10, EF Core/Npgsql 10 e PostgreSQL 17 em Docker Compose. Dinheiro em centavos bigint BRL; datas de locação em date; timestamps UTC. Migrations versionadas, patches/lockfiles revisados.

Alternativas: banco documental dificulta constraints entre agenda e reserva; SQLite não reproduz concorrência e range constraints PostgreSQL; outros frameworks contrariariam a preferência atual sem benefício demonstrado.

Consequências: recursos relacionais adequados, ferramentas familiares; SQL específico para GiST exige testes com banco real. Imagens com tag de versão maior podem mudar patch: fixar digest antes de implantação reproduzível externa. Readiness inicial verifica conexão, não schema.

Revisar versão de PostgreSQL e patches em atualização planejada; mudança de stack exige razão concreta, não preferência de um agente.
