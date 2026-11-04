# Parecer QA — AGENTES-001 — rodada 1

- **Estado: APROVADO para configuração e documentação dos especialistas.**
- Instância QA: `/root/qa`, distinta dos autores `/root`, `/root/frontend` e `/root/backend`.
- Independência: esta instância não escreveu os perfis nem a coordenação revisada. Criou somente o verificador temporário e este parecer.
- Entrada: instrução explícita do coordenador com critérios, entregas concluídas dos dois desenvolvedores e manifesto `LIBERADO_PARA_QA`.
- Liberação: 22/10/2026 às 17:57:13, fuso America/Sao_Paulo, conforme [manifesto](AGENTES-001-manifesto.json).
- Validação automatizada inicial: 22/10/2026 às 17:58:06, após a liberação e as entregas.
- Referência validada: 12 arquivos e hashes do manifesto. SHA-256 do próprio manifesto: `003ef3dff0aa53420a0d70b558f51206ded38dd8b0a5038a9f5f83bcae72a9b7`.
- Ambiente: Windows/PowerShell, Python 3.12.14 e biblioteca padrão `tomllib`; sem instalação adicional ou acesso a serviços externos.

## Critérios e evidências

| Critério | Evidência observada | Resultado |
|---|---|---|
| Três especialistas persistentes | `frontend.toml`, `backend.toml` e `qa.toml` parseados por `tomllib`; nomes únicos e correspondentes aos arquivos | Passou |
| Campos obrigatórios e herança | Cada TOML contém somente `name`, `description` e `developer_instructions`, todos strings não vazias; não há override de modelo, esforço ou permissões | Passou |
| Desenvolvedor não escreve seus testes | Perfis frontend/backend e AGENTS.md proíbem criação/alteração/remoção/enfraquecimento de testes, fixtures, snapshots e configuração de testes | Passou |
| QA não implementa produto | Perfil QA delimita escrita em testes/relatórios e manda devolver defeitos de produto aos desenvolvedores; arquivos compartilhados exigem atribuição exclusiva | Passou |
| QA somente depois das entregas | Fluxo, AGENTS.md e perfil QA exigem entrega de todos os desenvolvedores envolvidos, identificação de versão e liberação do coordenador | Passou |
| Instância independente | Fluxo proíbe converter/renomear o desenvolvedor para aprovar a própria mudança; exige identificação dos autores e da instância QA | Passou |
| Defeito → correção → nova validação | Perfis e fluxo devolvem a correção ao desenvolvedor e exigem nova entrega e rodada QA sobre a versão atualizada | Passou |
| Sem concorrência de escrita em QA | Desenvolvimento cessa na entrega; alteração posterior invalida a rodada afetada; arquivos compartilhados têm um escritor por vez | Passou |
| Sem falsa ativação ou isolamento | Documentação declara que TOML não executa pipeline automaticamente, não cria barreiras de filesystem e não comprova descoberta nativa nesta sessão | Passou |
| Uso sem descoberta nativa | Fluxo orienta o coordenador a ler e repassar integralmente o perfil para uma instância correspondente quando a ferramenta não permite selecioná-lo | Passou |
| Coerência com backlog e plano de testes | Ambos foram atualizados para QA independente por história, preservando o caráter histórico dos testes anteriores | Passou |
| Links e imutabilidade da entrega | 30 links Markdown locais resolvidos; hashes dos 12 arquivos coincidem com o manifesto | Passou |

## Execução

Foi criado o verificador temporário `work/validate_agents_001.py`, fora dos arquivos de produto. Ele usa `tomllib`, `hashlib`, JSON e resolução de caminhos para verificar a liberação, autoria, campos TOML, nomes, hashes e links locais.

Comando executado na pasta desta conversa:

```powershell
& 'C:\Users\JhonatanEduardo\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' work/validate_agents_001.py
```

Resultado: **62 verificações aprovadas, zero falhas, código de saída 0**. A leitura e revisão semântica dos perfis, fluxo, AGENTS.md, backlog e plano de testes complementaram essas verificações. O relatório temporário detalhado ficou em `work/AGENTES-001-checks.json`.

Não foram criados ou alterados testes do produto. Nenhum serviço, container, banco ou navegador foi iniciado para esta revisão. Não há recurso de teste externo a limpar. Os arquivos temporários de verificação ficam em `work/`, fora do projeto transferível.

## Limites e conclusão

Nenhum defeito bloqueante foi identificado nos critérios desta entrega. Não houve solicitação de correção aos desenvolvedores. A aprovação é restrita à sintaxe e coerência dos perfis e ao fluxo documentado.

Não foi testada a descoberta nativa desses perfis pelo cliente Codex, nem demonstrada execução automática do fluxo. Também não foi validado o MVP, a autenticação, reservas ou infraestrutura. A política estabelece coordenação e separação de responsabilidades; não é um mecanismo de segurança do sistema operacional. A aprovação só se aplica aos hashes registrados no manifesto, e alterações posteriores nos arquivos avaliados exigem revisão pertinente.
