# Plano de testes e critérios de evidência

## Autoria e ordem de execução

A partir de 22/10/2026, criação e manutenção de testes pertencem ao especialista `qa`, em instância distinta dos agentes que implementam produto. QA só inicia depois das entregas dos desenvolvedores envolvidos e da liberação de uma versão identificada pelo coordenador. Frontend/backend podem executar testes existentes, mas não criá-los, alterá-los ou enfraquecê-los. Defeitos de produto voltam aos desenvolvedores e exigem nova rodada de QA após a correção. Ver [fluxo de trabalho](agentes/fluxo-de-trabalho.md).

Os testes iniciais abaixo foram criados antes dessa política. Permanecem úteis, mas não são apresentados como evidência retroativa de independência.

## Existentes no scaffold

Testes xUnit de domínio: duração de período, datas inválidas, limites adjacentes/sobreposição, intervalo máximo e aritmética/limites de preço. Playwright: conteúdo de demonstração e apresentação do produto em desktop e celular. Esses testes não comprovam login, persistência, isolamento ou reservas. O relatório `validacao.md` informa quais foram executados nesta máquina.

## Obrigatórios para o MVP

| Teste | Camada / ambiente | Resultado esperado | Rastreio |
|---|---|---|---|
| Registro/login/logout/recuperação | Integração ASP.NET + banco descartável + e-mail fake | Sessão correta; tokens não reutilizáveis; erro genérico | RF01, B02–03 |
| IDOR de perfil, anúncio e reserva | Integração HTTP, contas A/B | 404 em recurso privado alheio; nenhum dado vazado | RN03–05, B04/B11 |
| CSRF ausente/incorreto | Integração HTTP com cookies | Escrita rejeitada; sem mudança persistida | B02 |
| Datas e centavos | Unidade, casos parametrizados | 1–30 dias; `[)`; BRL exato | RN08/11/13 |
| Aceites simultâneos | PostgreSQL real, duas conexões, barreira de sincronização | Um commit e um conflito; uma ocupação | RN15/19 |
| Bloqueio × aceite simultâneo | PostgreSQL real, duas transações | No máximo uma ocupação; rollback limpo | RN15/16 |
| Pausar × aceitar | Integração concorrente | Ordem serializada; se pausa vence, aceite falha | RN10/19 |
| Idempotência simultânea | HTTP + banco, mesma chave | Uma entidade; mesma resposta; hash diferente 409 | RN22 |
| Versão obsoleta | HTTP + banco | 412, nenhuma atualização perdida | RN23 |
| Expiração na fronteira e job atrasado | Unidade/integração, TimeProvider | Não aceitar em expiresAt; leitura coerente | RN18 |
| Cancelar após início | Unidade/integração | Parte comum não cancela; admin exige motivo | RN20 |
| Jornada PF e PJ | Playwright + serviços + seeds sintéticos | Publicar carro/moto, buscar, solicitar, aceitar, acompanhar | RF02–07 |
| Moderação e histórico | Integração/E2E | Some da busca; histórico preservado; auditoria | RF08 |
| Conexão na CI | PostgreSQL descartável exclusivo | Readiness 200 com banco e 503 em indisponibilidade controlada; falha/ausência de integração não vira sucesso | B01 |
| Migração e restauração | PostgreSQL descartável | Subir schema vazio quando a primeira migration existir (identidade/perfis) e restaurar backup de teste no gate operacional | B02/B04/B15 |
| Busca e carga | Benchmark com dataset controlado | Medir p50/p95/erros, recursos e seed; metas PRD | B15 |
| Acessibilidade | Playwright + inspeção teclado/leitor | Rótulos, foco, erros, contraste; sem barreira crítica | B15 |
| Busca LLM adversarial | Suite offline + provedor só quando configurado | Gates do roadmap | B17–18 |

Não usar SQLite ou EF InMemory como substituto de constraints PostgreSQL. Não mascarar integração indisponível como teste passando: marcar bloqueio/skip com motivo. Testes não acessam banco de desenvolvimento nem dados reais. Cada suite gera identificador de banco/container próprio e remove apenas seus recursos.

## Matriz de estados de interface

Em busca, detalhe, formulários e painel, cobrir carregamento, vazio, validação, falha de rede, sessão expirada, permissão negada, conflito de disponibilidade/preço, versão obsoleta e sucesso. Mensagem de retry deve reutilizar chave somente para o mesmo comando/payload.

## Critério de release de demonstração

Executar CI em ambiente limpo, suite negativa de autorização, concorrência e jornadas. Revisar qualquer teste ignorado. Não liberar piloto externo só porque build e teste de página inicial passaram. Registrar evidências e riscos conhecidos no PR/relatório do incremento.
