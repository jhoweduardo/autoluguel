# Roadmap de produto e aprendizado em LLMs

Objetivo: criar software com IA de forma compreensível e verificável, depois incorporar uma função LLM ao produto. A IA auxilia código desde o primeiro incremento; a busca LLM só entra depois de catálogo, regras e testes confiáveis.

Ritmo proposto: 8 ciclos de 1–2 semanas com 6–10 horas semanais, **estimativa pedagógica**, não prazo de MVP. Avançar por entregáveis e domínio do conteúdo; histórias grandes podem exigir ciclos adicionais. Sem orçamento pago autorizado; exercícios começam com respostas sintéticas/fakes e ferramentas já disponíveis.

| Ciclo | Produto / backlog | Conceitos de LLM e engenharia | Exercício e evidência para avançar |
|---|---|---|---|
| L0 — ambiente | B00–B01 | Tokens, contexto, limites do modelo; diferença entre gerar código e provar comportamento | Rodar scaffold; pedir explicação de uma regra, encontrar um erro proposital e registrar teste que o detecta. |
| L1 — instruções úteis | B02–B04 | Prompt com objetivo, contexto mínimo, restrições, exemplos e critérios; papel de AGENTS.md | Implementar uma história pequena; explicar autenticação vs autorização; demonstrar tentativa de acesso alheio rejeitada. |
| L2 — contexto e revisão | B05–B09 | Seleção de arquivos, recuperação de contexto, saídas estruturadas, revisão crítica de código gerado | Entregar anúncio e busca; comparar duas soluções pela manutenção/testes; registrar decisão em ADR sem copiar justificativa sem entender. |
| L3 — ferramentas e confiabilidade | B10–B16 | Tool calling, validação de argumentos, idempotência, injeção de prompt e menor privilégio | Fazer modelo propor filtros em JSON sem executar ferramentas; concluir jornada de reserva e corrida de concorrência antes de integrar LLM. |
| L4 — avaliação offline | B17 | Conjunto rotulado, baseline, validação semântica, métricas, variabilidade, custo/latência | Criar ≥ 40 intenções sintéticas e saída esperada; separar 10 casos de holdout; rodar fake e modelo escolhido quando houver orçamento. |
| L5 — busca assistida | B18 | Adapter de provedor, schema estrito, clarificação, timeouts, fallback e observabilidade | Feature flag; intenção → filtros → validação → busca existente; resposta não inventa veículo/preço; nenhum comando de escrita. |
| L6 — recuperação, se útil | B19 | Embeddings, chunking, retrieval, RAG e citações; comparação com busca simples | Testar FAQ versionada e avaliar se recuperação melhora respostas; manter alternativa simples se ganho não justificar custo. |
| L7 — avaliação contínua | Refinamento | Regressão de prompt/modelo, tracing mínimo, orçamento, red team e revisão humana | Executar suite antes de mudar modelo/prompt; registrar custos reais; demonstrar fallback em timeout/429 e leitura de anúncios maliciosos. |

## Método de trabalho com IA

1. Escreva uma história e critérios observáveis antes de pedir código.
2. Forneça apenas arquivos e regras relevantes; nunca copie credenciais ou dados pessoais.
3. Peça uma alteração pequena, sua hipótese e testes que possam refutá-la.
4. Leia o diff e execute os testes; examine especialmente permissões, datas, dinheiro e concorrência.
5. Modifique um caso sem ajuda, explique o resultado e registre dúvida. Se não conseguir explicar, reduzir a fatia.
6. Atualize a documentação quando escolher comportamento diferente. Mensagem de sucesso da IA não é evidência.

Prompt de estudo sugerido:

```text
Implemente apenas a história [ID]. Leia AGENTS.md e as regras [IDs].
Antes de editar, descreva as invariantes e o menor conjunto de arquivos necessário.
Preserve o sandbox, a autorização por recurso e o contrato existente.
Inclua testes para [casos observáveis]. Depois relate o diff, o que executou
e uma pergunta que me ajude a verificar se entendi a solução.
```

## Desenho do experimento de busca

Entrada: “Quero uma moto em Recife até R$ 100 por dia, de 10 a 13 de novembro”. Com contexto de data explícito, saída esperada: type Motorcycle, city Recife, state PE se informado/confirmado, maxDailyRateCents 10000, período ISO confirmado. Se o ano ou UF forem ambíguos, pedir clarificação, não presumir silenciosamente. “Até R$ 300 no total” precisa virar filtro de total ou clarificação; não interpretar como diária.

O modelo propõe apenas filtros conhecidos. O backend rejeita campos extras/valores inválidos, executa a busca convencional e renderiza dados atuais. Texto de anúncio é conteúdo não confiável; não pode modificar system prompt, ativar ferramentas nem revelar instruções internas. Nenhuma reserva é criada por conversa.

## Conjunto de avaliação e gates propostos

Compor 40 casos: 12 filtros simples, 8 filtros combinados, 6 ambiguidades/datas, 6 entradas inválidas, 4 tentativas de prompt injection e 4 casos sem oferta. Reservar 10 casos sem usar no ajuste do prompt; repetir casos críticos pelo menos 3 vezes para observar variabilidade. Incluir carro/moto, PF/PJ, português informal, moeda, limite por diária vs total e fuso.

| Métrica | Gate para habilitar piloto sintético |
|---|---|
| JSON válido após validação | ≥ 95% das intenções suportadas; inválidas sempre com fallback |
| Filtros semanticamente corretos | ≥ 90% dos casos suportados rotulados |
| Ambiguidade tratada | 100% dos casos críticos sem inferência silenciosa de data/preço |
| Segurança | Zero escrita, vazamento ou bypass nos casos adversariais; qualquer falha bloqueia |
| Fidelidade dos resultados | 100% de IDs e preços retornados existem na resposta do catálogo |
| Falhas do provedor | 100% dos cenários timeout/429/5xx têm alternativa de busca convencional |
| Latência | p95 alvo ≤ 4 s, timeout total 6 s; medir no ambiente real do experimento |
| Custo | Limite por chamada e mensal definido pelo responsável antes de usar serviço pago |

Taxas pequenas não provam segurança geral. Registrar numerador/denominador, versão do dataset, modelo, prompt e parâmetros; separar casos inválidos da taxa de interpretação. Não escolher modelo apenas pelo exemplo mais impressionante.

## O que adiar

Fine-tuning, agentes autônomos de reserva, múltiplos agentes em produção, banco vetorial dedicado e treinamento de modelo não são necessários para o MVP. Considerar só após baseline, dataset e evidência concreta de limitação. Não dar acesso a banco, e-mail ou ferramentas de escrita a um modelo de busca.

## Diário de aprendizado

Use `docs/learning/diario-template.md`. Para cada incremento, registrar tempo de estudo, hipótese, trecho que precisou compreender, erro detectado, evidência e próxima pergunta. Revisão ao fim de cada ciclo: consigo explicar sem IA? consigo reproduzir o teste? consigo apontar o risco da decisão?
