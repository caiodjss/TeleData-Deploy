# TeleData API

API REST desenvolvida para uma plataforma de cursos online, com foco em autenticação, autorização, gerenciamento de usuários e controle de acesso.

O projeto foi utilizado para aprofundar conhecimentos em desenvolvimento backend, segurança de aplicações, análise de requisições HTTP e investigação de fluxos de autenticação, simulando cenários comuns encontrados em sistemas reais.

---

## Principais Tecnologias

* Node.js
* JavaScript
* MySQL
* JWT
* Refresh Token
* Two-Factor Authentication (2FA)
* Express
* Docker
* Git

---

## Funcionalidades

### Autenticação e Segurança

* Cadastro de usuários
* Login com JWT
* Refresh Token
* Recuperação de senha por e-mail
* Ativação de conta por token
* Autenticação em dois fatores (2FA)
* Controle de acesso baseado em permissões

### Gestão da Plataforma

* Gerenciamento de usuários
* Gerenciamento de cursos
* Controle de chamados
* Dashboard com métricas
* Relatórios operacionais

---

## Competências Aplicadas

Durante o desenvolvimento deste projeto foram exercitados conhecimentos em:

* Desenvolvimento de APIs REST
* Análise de requisições HTTP
* Autenticação e autorização
* JWT e Refresh Token
* Fluxos de autenticação em múltiplas etapas
* Integração com banco de dados relacional
* Validação de dados
* Tratamento de erros
* Debugging de aplicações backend
* Troubleshooting de autenticação
* Investigação de falhas em fluxos de login
* Estruturação de regras de negócio

---

## Fluxos Implementados

### Login

```http
POST /auth/login
```

Autentica usuários utilizando credenciais válidas e retorna token JWT.

### Refresh Token

```http
POST /auth/refresh-token
```

Gera novo token de acesso sem necessidade de novo login.

### Autenticação em Dois Fatores

```http
POST /auth/enable-2fa
POST /auth/verify-2fa
```

Implementação de segunda camada de segurança utilizando códigos temporários.

### Recuperação de Senha

```http
POST /auth/forgot-password
POST /auth/reset-password/:token
```

Fluxo completo de redefinição de senha utilizando tokens temporários.

---

## Arquitetura

```text
controllers/
services/
routes/
middleware/
database/
utils/
```

* Controllers responsáveis pelo tratamento das requisições HTTP
* Services contendo regras de negócio
* Middleware para autenticação e autorização
* Database para persistência de dados
* Utils para componentes reutilizáveis

---

## Aprendizados

Este projeto foi fundamental para aprofundar conhecimentos em autenticação, segurança de APIs, análise de fluxos HTTP e troubleshooting de sistemas backend.

A implementação de JWT, Refresh Token e 2FA exigiu investigação constante de cenários de autenticação, validação de tokens, análise de requisições e correção de falhas, competências diretamente relacionadas ao trabalho de diagnóstico técnico e suporte a APIs.
