# PRD — Autoluguel

Versão 0.1 · 19/10/2026 · Status: baseline proposta para implementação incremental.

## 1. Problema e proposta de valor

Pessoas físicas com veículos disponíveis e pequenas locadoras precisam divulgar oferta, organizar agenda e receber interessados sem construir um site próprio. Quem procura aluguel precisa encontrar carros e motos por cidade, período e preço, com clareza sobre o anunciante. A hipótese do Autoluguel é reunir essa oferta em uma experiência simples, com calendário e solicitações rastreáveis.

A solução oferece catálogo comum para PF/PJ, disponibilidade por veículo e um painel compacto. O projeto também é um laboratório de desenvolvimento com IA: cada incremento deve produzir software verificável e aprendizado documentado. IA conversacional será uma camada futura sobre capacidades determinísticas já testadas.

## 2. Públicos e necessidades

| Persona | Necessidade | Jornada principal |
|---|---|---|
| Locatário | Encontrar veículo compatível com período e orçamento | Buscar → comparar → solicitar → acompanhar |
| Anunciante PF | Divulgar um ou poucos veículos e controlar datas | Criar perfil → anunciar → bloquear agenda → responder |
| Pequena locadora PJ | Organizar uma pequena frota em uma vitrine única | Cadastrar frota → gerenciar solicitações → consultar painel |
| Administrador | Reduzir abuso e remover conteúdo inadequado | Receber sinalização → suspender anúncio → registrar motivo |

Uma pessoa pode alugar e anunciar. PF/PJ descrevem o perfil anunciante e não a permissão técnica. No MVP, uma PJ tem um único usuário responsável; filiais, membros e permissões de equipe estão fora.

## 3. Objetivos e critérios de sucesso

Objetivos de produto: demonstrar descoberta e solicitação; reduzir esforço de cadastro de oferta; evitar duplicidade de agenda; tornar situação da solicitação compreensível. Objetivo de aprendizado: o responsável explicar e alterar cada parte gerada por IA e avaliar a futura busca conversacional com casos reproduzíveis.

Metas abaixo são **hipóteses de piloto**, não resultados nem benchmarks de mercado:

| Indicador | Definição / coleta | Meta proposta |
|---|---|---|
| Conclusão de publicação | Participantes que publicam anúncio válido / participantes que iniciam a tarefa | ≥ 80% em teste moderado |
| Tempo de publicação | Mediana entre abrir criação e publicação válida, excluindo inatividade > 10 min | ≤ 10 min |
| Sucesso de busca | Participantes que encontram um veículo adequado em cenário com oferta conhecida | ≥ 80% |
| Conclusão de solicitação | Solicitações criadas / formulários iniciados, por sessão sintética | ≥ 70% |
| Integridade de agenda | Confirmações conflitantes persistidas para mesmo veículo | Zero em testes concorrentes |
| Isolamento | Acessos de uma conta a recursos privados de outra | Zero em testes negativos |
| Aprendizado | Incrementos com hipótese, revisão, teste e explicação no diário | Um registro por incremento |

Proposta de rodada: 5 anunciantes (PF e PJ) e 5 locatários em tarefas sintéticas. Amostra qualitativa pequena, sem inferência estatística de demanda. Eventos internos mínimos: search_performed, listing_viewed, listing_published, reservation_requested, reservation_decided; sem texto livre, IP completo ou documentos no payload analítico.

## 4. Escopo

**P0 — MVP:** conta e sessão; perfil anunciante autodeclarado PF/PJ; catálogo de carro/moto; filtros; detalhe; diária e total estimado; disponibilidade; bloqueios manuais; solicitação, aceite, recusa, cancelamento e expiração; painel do locatário/anunciante; moderação básica; acessibilidade; testes e ambiente local.

**P1 — após núcleo estável:** paginação e filtros mais ricos se necessários, melhoria de métricas, imagens por upload controlado, recuperação de conta externa, piloto fechado, busca conversacional somente leitura sob flag.

**Fora do MVP:** pagamento, split, estorno, cobrança de caução, seguro, vistoria, telemetria, entrega do veículo, contrato de locação, multas, CNH/CPF/CNPJ/identificação, avaliação de crédito, biometria, operação nacional, aplicativo nativo, equipes PJ, integrações com locadoras, avaliações públicas e chat entre usuários. Não há botão que simule cobrança aprovada nem selo de identidade verificada.

## 5. Jornadas e requisitos funcionais

### RF01 — Identidade e conta

Visitante consulta anúncios públicos; conta permite solicitar e administrar recursos próprios. Cadastro pede nome de exibição, e-mail e senha, sem documento. Senhas e sessões usam mecanismos do ASP.NET Core Identity, com limitação de tentativas. Login e recuperação não revelam se e-mail existe. Sair invalida a sessão. Alterações autenticadas exigem proteção CSRF.

Aceite: anônimo não cria solicitação; credencial incorreta recebe erro genérico; conta bloqueada não realiza comandos; APIs não retornam hashes nem dados de sessão. Recuperação funciona com caixa de e-mail de desenvolvimento, sem remetentes reais no scaffold.

### RF02 — Perfil PF/PJ

Criar um perfil PF (nome de exibição) ou PJ (nome comercial e responsável interno), cidade/UF, descrição limitada. Marcar visivelmente como autodeclarado. Tipo bloqueado após primeira publicação; alteração posterior requer revisão de produto, sem migração automática.

Aceite: um perfil por usuário; locatário não precisa de perfil anunciante; nenhum campo de documento; usuário B não edita perfil A; identidade do responsável PJ não aparece no catálogo.

### RF03 — Catálogo

Criar rascunho, editar, publicar, pausar e arquivar veículo. Campos: tipo, marca, modelo, ano, título, descrição, cidade/UF, diária em centavos e imagem sintética selecionada. Placa e localização exata não são coletadas. Publicação exige perfil e campos válidos. Um anúncio representa um veículo individual, não uma categoria de frota.

Aceite: somente Published aparece na busca; proprietário edita apenas seus anúncios; pausar não cancela reservas confirmadas; arquivar é lógico e preserva histórico; alterações de preço não mudam solicitações já criadas.

### RF04 — Busca e detalhe

Filtrar cidade/UF, carro/moto, diária mínima/máxima e datas opcionais em par. Ordenação estável por preço ou mais recente, paginação limitada a 50. Exibir oferta vazia, carregamento e falha recuperável. Com datas, retornar veículos sem ocupação conflitante no momento da consulta.

Aceite: valor em BRL e intervalo explícito; retorno não promete disponibilidade garantida; detalhe só apresenta dados públicos; preço da lista corresponde à diária e o total informa quantidade de diárias; datas incompletas retornam validação.

### RF05 — Disponibilidade

Anunciante bloqueia períodos futuros e remove bloqueios próprios. Solicitação pendente não retém agenda. Confirmação e bloqueio manual ocupam o mesmo calendário e disputam a mesma restrição no banco.

Aceite: devolução de uma reserva pode coincidir com retirada da seguinte; bloqueio conflitante recebe 409; indisponibilidade recalculada no aceite; calendário não expõe quem reservou a visitantes.

### RF06 — Reservas demonstrativas

Locatário escolhe período, vê estimativa e envia solicitação. Servidor calcula snapshot de preço. Anunciante aceita ou recusa; locatário/anunciante cancela segundo regras; pendentes expiram; confirmadas tornam-se concluídas no término simulado. A interface informa “Solicitação de demonstração — sem contratação ou cobrança”.

Aceite: proibir reserva de veículo próprio; impedir confirmação de duas solicitações sobrepostas; reenvio idempotente não duplica; preço divergente exige nova confirmação do usuário; transições inválidas recebem 409; somente partes veem o detalhe privado.

### RF07 — Painéis

Locatário acompanha solicitações e ações permitidas. Anunciante vê frota, pendentes, futuras confirmadas e calendário. Indicadores: anúncios publicados, solicitações pendentes e confirmações futuras, filtrados no servidor. Valores são estimativas, sem “saldo” ou receita recebida.

Aceite: estado vazio orienta próxima ação; totais batem com dados autorizados; mudar um ID na requisição nunca revela dados de outro anunciante.

### RF08 — Administração mínima

Administrador configurado fora de cadastro público pode suspender anúncio/conta com motivo auditável. Suspensão tira anúncio da busca e impede novas solicitações/confirmações. Histórico e cancelamento permitido continuam acessíveis às partes; cancelamento de reservas existentes é uma ação explícita e auditada, não efeito silencioso da suspensão.

## 6. Experiência e conteúdo

Interface em pt-BR, responsiva desde 360 px. Navegação por teclado, foco visível, rótulos associados, mensagens por campo, contraste AA como meta e status não dependente somente de cor. Datas exibidas dd/MM/aaaa, enviadas ISO; moeda BRL. Não usar fotos que insinuem frota real: assets identificados como demonstração.

Telas alvo: início/busca, resultados, detalhe, entrar/cadastrar, perfil PF/PJ, editor de anúncio, calendário, solicitação e detalhe, minhas solicitações, painel anunciante e moderação. Toda tela deve contemplar carregamento, vazio, erro, falta de permissão e sucesso pertinente.

## 7. Requisitos não funcionais

- Segurança: autorização por recurso, sessão protegida, CSRF, rate limiting e ausência de segredos no cliente. Sem exposição pública antes de implementar essas proteções.
- Integridade: preço calculado no servidor; ocupação protegida por transação e constraint; trilha de mudanças de estado.
- Desempenho proposto: busca p95 ≤ 500 ms e comandos p95 ≤ 800 ms, excluindo rede, em benchmark documentado com 10 mil anúncios sintéticos e 20 clientes concorrentes. Não é SLA.
- Operação: liveness/readiness, logs estruturados sem PII, backup/restauração testados antes do piloto, migrations explícitas e reversíveis quando possível.
- Privacidade: minimizar dados, não usar produção em testes/LLM, procedimentos de remoção e retenção definidos antes de pessoas reais.
- Manutenção: módulos com dono de dados, contrato versionado, CI com testes pertinentes e lockfiles versionados.

## 8. Diferenciação, riscos e viabilidade

Diferenciais a testar: carros e motos na mesma busca; acesso simples para PF e pequena locadora; calendário compartilhado com solicitações rastreáveis; painel enxuto; futura busca em linguagem natural. Não são vantagens competitivas comprovadas. O MVP não valida cobertura de seguro, confiabilidade do anunciante nem viabilidade de operação real.

| Risco | Efeito | Mitigação / sinal de revisão |
|---|---|---|
| Pouca oferta por cidade | Busca sem resultado | Começar por uma praça e poucos parceiros; medir buscas vazias |
| Duas personas de oferta | Produto e suporte complexos | Um fluxo comum, diferenças só no perfil; observar atrito |
| Fraude e confiança | Risco a pessoas e veículos | Sandbox; nova análise operacional antes de qualquer locação real |
| Dupla reserva | Perda de confiança | Constraint comum e teste de corrida |
| Código gerado incorreto | Falhas ocultas | Revisões pequenas, testes negativos e explicação pelo responsável |
| LLM inventar oferta/preço | Decisão incorreta | Consulta estruturada, hidratação do banco e fallback |
| Custo/suporte maior que receita | Modelo inviável | Medir esforço por solicitação antes de cobrar |

Viabilidade financeira ainda não demonstrada: não há pesquisa de aquisição, conversão ou disposição a pagar recuperada da conversa. Modelo de estudo futuro: contribuição mensal = assinaturas × mensalidade líquida + reservas pagas × ticket × comissão líquida − infraestrutura − suporte − aquisição − custos variáveis. No MVP, receita e volume de reservas pagas são zero; despesas são aprendizado. Assinatura de ferramentas ou comissão são hipóteses futuras, não funcionalidades autorizadas. Montar cenários com valores observados antes de decidir monetização; não usar volume de solicitações de sandbox como receita projetada.

## 9. Plano e gate de conclusão

Sequência: fundação → identidade/perfis → catálogo/busca → agenda → reservas → painel/moderação → hardening → piloto sintético → experimento LLM. Detalhes no backlog e roadmap.

MVP concluído quando RF01–RF08 passam seus critérios; testes de concorrência com PostgreSQL real e de acesso indevido passam; E2E demonstra jornadas PF e PJ com carro e moto; interface não sugere contratação real; instruções reproduzem ambiente limpo; não há defeito crítico conhecido; responsável consegue explicar arquitetura e regras. A entrega inicial atual não atende esse gate e não se apresenta como produto pronto.
