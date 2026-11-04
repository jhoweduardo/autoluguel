# Validação da entrega inicial

Data: 19/10/2026. A estrutura inicial foi criada e verificada localmente; **não corresponde ao MVP completo**.

## Ambiente observado

Windows / PowerShell; SDK .NET 10.0.401; Node.js 24.18.0; npm 12.0.1; Docker CLI 29.1.4-rd. O serviço Docker estava indisponível. Dependências JavaScript foram instaladas e fixadas em package-lock.json; dependências .NET foram restauradas a partir do cache local existente e fixadas em packages.lock.json. Os caches de validação ficaram fora do projeto transferível.

## Verificações realizadas

| Verificação | Resultado | O que comprova |
|---|---|---|
| Compilação da solução .NET | Sucesso, zero erros e avisos | Host, biblioteca de módulos e tipos de domínio compilam |
| xUnit | 18 aprovados, zero ignorados/falhas | Períodos, limites, sobreposição, ano bissexto e centavos |
| TypeScript + Vite | Build concluído | Tipagem e empacotamento do frontend inicial |
| Playwright / Chromium | Asserções dos 2 cenários aprovadas; encerramento do runner incompleto | Página inicial, aviso de demonstração, públicos atendidos e ausência de overflow horizontal; ver limitação abaixo |
| HTTP local | live 200; project-info 200 com sandbox=true; ready 503 sem banco; vehicles 404 | Host responde e não expõe catálogo ainda não implementado |
| Docker Compose | Configuração validada com .env.example | Sintaxe e interpolação da configuração; não prova execução de contêineres |
| OpenAPI 3.0.3 | Validado com @apidevtools/swagger-parser | Contrato e referências válidos; 27 operações, sendo 3 implementadas e 24 planejadas |
| JSON e links Markdown locais | Válidos | Arquivos parseáveis e referências documentais existentes |
| npm audit na instalação | Zero vulnerabilidades reportadas naquele momento | Resultado do catálogo npm consultado, não auditoria completa de segurança |

Execução de .NET usou MSBuild com um único processo e caches graváveis no workspace devido a restrições do ambiente. A restauração NuGet pela internet não concluiu por acesso negado; o cache local permitiu restaurar e compilar. Auditoria online de vulnerabilidades NuGet não foi executada. A instalação npm foi concluída após autorização de rede; um postinstall opcional do esbuild foi bloqueado pelo npm, mas o binário distribuído com a dependência permitiu build e testes.

## Limites conhecidos

- PostgreSQL/containers não foram iniciados: Docker daemon indisponível. Nenhuma tabela de negócio, migration, autenticação, reserva ou constraint persistida foi implementada.
- Playwright reportou `ok` para desktop e mobile, mas o runner não encerrou automaticamente neste ambiente Windows restrito e foi interrompido após as asserções. A execução deve ser repetida fora deste ambiente para confirmar também o encerramento normal; não foi registrada como suite com exit code 0. O servidor de teste foi configurado para chamar Vite diretamente, reduzindo processos intermediários.
- Readiness foi testado no caminho de falha esperado (503). O caminho de conexão bem-sucedida depende de iniciar PostgreSQL.
- Não foram executados testes de concorrência, persistência, isolamento de contas, recuperação de senha, desempenho ou jornadas completas. Eles estão especificados no plano de testes e backlog.
- A página é uma apresentação inicial com Material UI; não possui catálogo interativo nem formulários de negócio.
- O OpenAPI é um contrato parcial do produto alvo. Operações de edição detalhada, recuperação de conta e moderação serão formalizadas antes de suas histórias.
- Não há CI, implantação, repositório remoto, conta em serviço externo ou transação real criados por esta entrega.

## Transferência e próximo incremento

O ZIP contém somente código-fonte, documentação, configurações e lockfiles; exclui dependências instaladas, caches, builds, relatórios temporários e segredos. A integridade das entradas é comparada com os arquivos de origem durante o empacotamento.

Ao extrair, seguir README. Próxima fatia sugerida: B01/B02 (automação de checks e identidade com um teste de acesso indevido), depois B04 (perfil PF/PJ). Iniciar o Docker local quando for implementar/testar persistência.
