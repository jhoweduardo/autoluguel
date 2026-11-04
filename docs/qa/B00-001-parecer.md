# Parecer QA — B00 — rodada 001

- Estado final: **APROVADO para B00 na versão congelada**, após complemento PostgreSQL real abaixo. Resultados BLOQUEADO anteriores neste registro são históricos e foram superados.
- Data: 03/11/2026. QA: `/root/qa_b00_001`, independente, sem autoria de produto ou das entregas atuais.
- Entrada aceita: nova liberação em B00-001-controle.md, entregas PRONTO_PARA_QA de `/root/frontend_b00_delivery` e `/root/backend_b00_delivery`. Autoria histórica desconhecida permanece registrada, sem certificação retroativa. AGUARDANDO_ENTREGA anterior superado.
- Versão: B00-001-manifesto.json, 73 arquivos SHA256 conferidos durante a execução, zero divergências. Produto preservado.
- Ambiente: Windows/PowerShell, SDK 10.0.401, Node 24.18.0, npm 12.0.1, Vite 7.3.7. Docker CLI presente, daemon ausente (pipe docker_engine inexistente). PostgreSQL/psql/pg_ctl não encontrados no PATH.

| Critério | Esperado / prova | Observado / resultado |
|---|---|---|
| 1 | Build .NET e web | Passaram, exit 0; não certifica ambiente limpo |
| 2 RN08/11/13 | Datas 1–30, fim exclusivo, adjacência/sobreposição e centavos exatos | Unidade 18/18, 0 falhas/ignorados |
| 3 RN25/26 | pt-BR, públicos e demonstração sem coleta | Passou inspeção e E2E atual com navegador instalado |
| 4 | Layout desde 360px | Passou teste adicional 360×800 em ambos projetos, sem overflow/formulários |
| 5 | live/project-info 200 | HTTP 200, healthy/scaffold/sandbox=true e sem contratação/cobrança |
| 6 | ready 503 sem banco, sem vazamento | HTTP 503 application/problem+json, título genérico e traceId. Sucesso 200 com banco bloqueado |
| 7 | Somente health/info implementados | Parse 3 implemented/24 planned; 3 MapGet; vehicles 404. Schema OpenAPI validado ao fechamento |
| 8 | Compose válido, senha obrigatória e loopback | config exit 0 com senha sintética, exit 1 sem senha; loopback/volume/.env ignorado conferidos por leitura. Containers não executados |
| 9 | Registrar falhas e ausência de prova | Este relatório distingue execuções/inspeções e bloqueios |
| 10 | Orientação e limites | README descreve pré-requisitos/comandos/scaffold; product omitido no mapa é inconsistência menor conhecida. Reprodução completa bloqueada |

## Execuções e códigos

- `dotnet test Autoluguel.slnx`: exit 0, 18 aprovados, 0 falhas, 0 ignorados, testes 47ms. Restauração efetuada pelo comando.
- `dotnet build Autoluguel.slnx --no-restore`: restrito exit 1 sem diagnóstico (0 erros/avisos). Primeira chamada escalada interrompida antes de retornar resultado; verificado nenhum processo dotnet ativo. Repetição escalada exit 0, 0 erros/avisos, 3,97s.
- `npm ci --ignore-scripts --no-audit --no-fund`: restrito exit 1 ENOTFOUND registry.npmjs.org; escalado exit 0, 134 pacotes/39s. Sem alterar lockfile/manifests.
- `npm run build`: exit 0, TypeScript/Vite, 918 módulos; Vite 4,55s.
- `docker ps` e `docker info`: exit 1, daemon ausente. Nenhum recurso de banco criado ou tocado.
- `docker compose --env-file NUL config --quiet`: exit 0 com senha temporária sintética; exit 1 sem senha. Não leu .env nem imprimiu configuração expandida.
- `npm run test:e2e` restrito: sessão 66244 sem progresso até testes; interrompida com Ctrl+C após alguns minutos, exit 1, nenhum teste contabilizado; não aprovada.
- Repetição escalada `npm run test:e2e -- --timeout=20000 --global-timeout=90000`: término normal exit 1, 2 falhas de inicialização, Chromium headless shell 1248 ausente, 0 aprovados, 4,65s. Falha de infraestrutura.
- `npx playwright install chromium`: exit 0, Chromium/headless shell 1248 e FFmpeg 1013 instalados pelo comando oficial; sem dependência nova no projeto.
- HTTP inicial: cliente restrito exit 1 por sockets proibidos. Cliente escalado não alcançou host restrito e foi interrompido exit 1. Sem prova dessas tentativas.
- HTTP final: servidor e cliente no mesmo contexto escalado, porta exclusiva 15080, conexão sintética para porta indisponível 59999; Invoke-WebRequest com TimeoutSec 8; exit 0. live 200, project-info 200, ready 503, vehicles 404. Problem Details sem host/usuário/senha; servidor encerrado em finally; nenhum Autoluguel.Api remanescente conferido.

## Testes, recursos e conclusão

Teste novo `apps/web/e2e/b00-360.spec.ts` cobre lacuna explícita de 360px e ausência de formulários. Originais preservados. Não é auditoria completa de acessibilidade (B15).

Provas produzidas: unidade, build, HTTP real, parse e inspeção/configuração. Não comprovados: PostgreSQL real/readiness 200, execução conjunta dos containers, validação estrutural completa do schema OpenAPI (resolvida na complementação abaixo). Não existem comandos privados/reservas neste scaffold; isolamento/concorrência futura não é fabricado como prova B00.

Nenhum defeito de produto demonstrado. Sem correção solicitada aos desenvolvedores. Dependências e saídas ignoradas preservadas; processos QA encerrados; nenhum banco/volume existente tocado. Produto congelado sem divergências nos 73 hashes durante a rodada.

**Conclusão restrita:** base compila, helpers passam e caminho HTTP sem banco responde corretamente. Docker/PostgreSQL impedem comprovar caminho de sucesso. Não aprovar nem concluir B00/MVP por ausência de erro. Aguardar resolução do ambiente e nova liberação para verificações pendentes.

Observação de escopo: execução conjunta dos três containers é evidência operacional ainda faltante, não novo gate retroativo da B00. O aceite de Compose válido foi demonstrado. O estado BLOQUEADO limita a comprovação operacional solicitada nesta rodada; não transforma ausência de funcionalidade futura em defeito. Para fechar a lacuna, iniciar Docker Desktop/serviço Docker e liberar uso de PostgreSQL descartável separado, repetir somente readiness 200 e verificações afetadas após conferir versão.


## Fechamento da rodada

- Playwright após instalação: `npm run test:e2e -- --timeout=20000 --global-timeout=90000` escalado terminou normalmente **exit 0**, **4 aprovados, 0 falhas, 0 ignorados**, duração 6,9s do runner. Dois casos originais (desktop/mobile) e dois do caso 360×800 (ambos projetos) passaram. Avisos NO_COLOR/FORCE_COLOR não impediram execução. Esta é a evidência atual válida, substituindo a lacuna de encerramento histórico.
- Teste QA adicionado: SHA256 `FF59F09CBFEC47B720BC8CFC4105E5EB8F66D79D14C795AE0CE4E5494405FEC4`, `apps/web/e2e/b00-360.spec.ts`. Não altera o manifesto da baseline de produto.
- Conferência final: **73 arquivos originais, zero divergências**. Portas QA 15080 e 5173 com **zero listeners**, nenhum servidor QA deixado ativo. Instalações necessárias preservadas; saídas de build/testes ignoradas preservadas.
- Pendências distintas: (a) Docker/PostgreSQL real/readiness 200 requer daemon ativo e recurso descartável separado; (b) validação estrutural completa OpenAPI concluída na complementação abaixo; pendência resolvida.
- Nenhuma jornada de autenticação, reserva ou autorização implementada ou certificada. E2E cobre apenas scaffold e limite 360px, não auditoria visual completa/contraste/teclado/leitor de tela.
- Resultado final **BLOQUEADO para comprovação operacional integral solicitada**, sem defeito de produto demonstrado, sem inventar exigência retroativa de execução conjunta do Compose. Builds, unidade, E2E, HTTP sem banco e configuração Compose estão comprovados nesta versão. Coordenador consolida próximos passos e não deve interpretar este parecer como aprovação do MVP.


## Complementação final — OpenAPI

- Comando temporário, sem salvar dependências: `npm exec --yes --fetch-retries=0 --fetch-timeout=30000 --package=@apidevtools/swagger-cli -- swagger-cli validate docs/api/openapi.json`.
- Tentativa restrita: exit 1, ENOTFOUND registry.npmjs.org. Repetição escalada: **exit 0**, saída `docs/api/openapi.json is valid`. Validador resolvido @apidevtools/swagger-cli 4.0.4; aviso de pacote descontinuado registrado, sem afetar resultado desta execução pontual. Não incorporado ao projeto/CI.
- Pendência de validação estrutural OpenAPI **resolvida**; nenhum defeito estrutural reportado. Não repetir builds/E2E/HTTP para essa execução sem mudança de produto.
- Estado permanece **BLOQUEADO** somente quanto à comprovação operacional com PostgreSQL real/readiness 200; próximo passo concreto é disponibilizar daemon Docker e executar recurso PostgreSQL descartável separado após liberação coordenada. Nenhuma simulação substitui essa prova. Execução conjunta Compose segue evidência adicional, sem novo gate retroativo.


## Complemento operacional final — PostgreSQL real

Liberação adicional recebida do coordenador, sem mudança de produto. A coordenação iniciou o Rancher Desktop; não foi instalado/reconfigurado runtime por QA. Contexto observado default, npipe docker_engine. Primeiro info falhou por pipe ausente; polling escalado limitado a 90s respondeu normalmente versão Docker 29.5.3, exit 0.

- Container próprio: `b00-qa-b73fbcf6ee`, PostgreSQL `postgres:17-alpine`, digest `sha256:266d3c257594e195b309ae9d1805e54c788f1d7b375f56bf6c367aac6c917e7b`. Imagem baixada pelo runtime, sem alterar artefatos do projeto.
- Comando: `docker run --detach --name <nome-único> --publish 127.0.0.1:15439:5432 --env POSTGRES_PASSWORD --env POSTGRES_USER=b00qa --env POSTGRES_DB=b00qa --tmpfs /var/lib/postgresql/data postgres:17-alpine`. Senha sintética gerada temporariamente por ambiente, não registrada. Nenhum volume persistente existente usado; nenhum dado real.
- Prontidão via `docker exec <nome> pg_isready -U b00qa -d b00qa`, espera limitada a 60s; banco ficou pronto. Host de teste iniciado em contexto escalado na porta exclusiva 15080 com conexão para esse banco.
- `Invoke-WebRequest http://127.0.0.1:15080/health/ready -TimeoutSec 10 -SkipHttpErrorCheck`: **HTTP 200**, corpo `{"status":"ready"}`. Script completo encerrou **exit 0**. Isto prova conexão EF/Npgsql/PostgreSQL real; não prova tabelas, migrations ou regras de negócio persistidas, inexistentes na B00.
- Limpeza em finally: host/filhos QA encerrados; `docker rm --force b00-qa-b73fbcf6ee` retornou o nome removido e o script terminou exit 0. Variáveis temporárias removidas. Tmpfs descartado com container; nenhum volume alheio tocado.
- Conferência adicional `docker ps -a --filter name=...` não retornou no intervalo observado e foi explicitamente interrompida, exit 1; não é apresentada como conferência bem-sucedida. A evidência de remoção é o comando rm concluído com sucesso, não o timeout. Conferência independente de portas: **15439 e 15080 com zero listeners**, exit 0. Runtime iniciado pela coordenação permanece disponível ao responsável.
- Versão reconferida ao final: **73 arquivos originais, zero divergências**. Nenhuma implementação ou mudança nos testes originais. Teste novo QA permanece identificado por hash neste parecer.

**Parecer final: APROVADO para o escopo B00 e versão do manifesto registrado.** Critérios pertinentes demonstrados por builds, 18 unitários, 4 E2E, 360px, HTTP com/sem PostgreSQL real, contrato validado e configuração Compose positiva/negativa. Bloqueios anteriores superados. Execução conjunta dos três containers não foi realizada, permanece evidência operacional adicional e não novo gate retroativo. Ausência de auditoria completa de acessibilidade/isolamento/concorrência de reservas é limite do scaffold e de histórias futuras. Não conclui MVP nem autoriza publicação. Coordenador consolida o parecer e decide continuidade; QA não altera backlog nem inicia próxima história.
