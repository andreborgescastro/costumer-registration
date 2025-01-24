# Sistema de Cadastro de Clientes - Serverless

## Visão Geral

Este projeto implementa um sistema simples de cadastro de clientes (CRUD) utilizando APIs REST e uma arquitetura serverless baseada em AWS Lambda, API Gateway e DynamoDB. A aplicação foi desenvolvida em Node.js (v22.x) e TypeScript, seguindo o paradigma de programação orientada a objetos. A solução inclui testes automatizados e não utiliza dependências externas além do AWS SDK v3 (`@aws-sdk`).

## Funcionalidades

- API REST para gerenciar o cadastro de clientes com os seguintes campos:
  - Nome completo
  - Data de nascimento
  - Status ativo/inativo
  - Lista de endereços
  - Lista de contatos (pelo menos um deve ser principal):
    - Email
    - Telefone
- Arquitetura serverless utilizando AWS Lambda, DynamoDB e API Gateway.
- Testes incluídos para cobertura completa do código.

---

## Tabela de Conteúdos

1. [Inicialização do Projeto](#inicializacao-do-projeto)
2. [Configuração do Ambiente (.env)](#configuracao-do-ambiente-env)
3. [Deploy](#deploy)
   - [Injeção de Credenciais AWS](#injecao-de-credenciais-aws)
4. [Execução Offline](#execucao-offline)
5. [Cobertura de Testes](#cobertura-de-testes)

---

## Inicialização do Projeto

Para começar com este projeto, siga os passos abaixo:

1. Clone o repositório:

   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Instale as dependências:

   ```bash
   yarn install
   ```

3. Compile o TypeScript para JavaScript:

   ```bash
   yarn run build
   ```

4. Execute os testes para garantir que tudo está funcionando corretamente:
   ```bash
   yarn run test
   ```

---

### Injeção de Credenciais AWS

Certifique-se de que suas credenciais da AWS estão configuradas. Você pode fazer isso de duas formas:

1. Utilizando o AWS CLI para configurar suas credenciais:

   ```bash
   aws configure
   ```

   Forneça sua chave de acesso, chave secreta e região padrão.

2. Alternativamente, exporte as credenciais AWS como variáveis de ambiente:
   ```bash
   export AWS_ACCESS_KEY_ID=<sua_chave_de_acesso>
   export AWS_SECRET_ACCESS_KEY=<sua_chave_secreta>
   export REGION=<sua_regiao>
   ```

---

## Configuração do Ambiente (.env)

Para executar a aplicação, você precisa configurar as variáveis de ambiente em um arquivo `.env` localizado na raiz do projeto. Abaixo está um exemplo de configuração:

```env
SERVERLESS_ACCESS_KEY=sua_chave_de_acesso
REGION=us-east-1
USERS_TABLE_NAME=CustomerTable
```

- `REGION`: A região da AWS onde seus recursos estão implantados.
- `USERS_TABLE_NAME`: Nome da tabela DynamoDB usada para armazenar os dados dos clientes.
- `SERVERLESS_ACCESS_KEY`: A chave de acesso da Serverless fornecida por e-mail.

---

## Deploy

Este projeto utiliza o Serverless Framework para implantação. Siga os passos abaixo para realizar o deploy da aplicação:

1. Instale o Serverless Framework globalmente (caso ainda não tenha instalado):

   ```bash
   npm install -g serverless
   ```

2. Realize o deploy da aplicação:
   ```bash
   yarn run deploy
   ```
   Obs. As credenciais da AWS devem estar vigentes no terminal em que for executado.

---

## Destroy

Este projeto utiliza o Serverless Framework, o que facilita a manipulação dos cloud resources. Para remover a aplicação, basta realizar o destroy da aplicação:

1. Execute:
   ```bash
   yarn run destroy
   ```
   Obs. As credenciais da AWS devem estar vigentes no terminal em que for executado.

---

## Execução Offline

Para testar a aplicação localmente, mas conectando-se a uma tabela real do DynamoDB, você deve:

1. [Injetar Credenciais AWS](#injecao-de-credenciais-aws)

2. Executar:

   ```bash
   yarn run start:offline
   ```

A aplicação estará disponível em `http://localhost:3000`.
Obs. As credenciais da AWS devem estar vigentes no terminal em que for executado.

---

## Cobertura de Testes

Este projeto inclui testes automatizados para garantir a qualidade e funcionalidade do código.
Adicionamos a cobertura de testes ao projeto para facilitar a visualização, mas você sempre pode gerá-la novamente seguindo as instruções abaixo.

1. Execute os testes:

   ```bash
   yarn run test:coverage
   ```

2. Um relatório de cobertura será gerado no diretório `coverage/`. Abra o arquivo `index.html` em um navegador para visualizar os resultados detalhados.

---

## Notas Adicionais

- A tabela DynamoDB será provisionada com uma chave primária chamada `id` (string) para armazenar os dados dos clientes.
- O deploy criará automaticamente os recursos necessários (ex.: funções Lambda, endpoints do API Gateway e tabela DynamoDB).
- Siga as melhores práticas da AWS para funções IAM e permissões para proteger seus recursos.
- O projeto não inclui um authorizer para a rota do API Gateway. É recomendável proteger suas rotas com API-KEY ou Authorizer.

---

## Contato

Se você encontrar algum problema ou tiver dúvidas, sinta-se à vontade para abrir uma issue no repositório ou entrar em contato comigo.
andreborgescastro@gmail.com

Obrigado!
