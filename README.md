# Documentação da API - Backend

## Visão Geral
Sistema backend para plataforma de cursos online com autenticação, gerenciamento de usuários, cursos, chamados e relatórios.

## Estrutura do Projeto
```
backend/
├── config/           # Configurações do sistema
├── controllers/      # Lógica das rotas
├── database/         # Modelos e conexão com banco
├── middleware/       # Autenticação e autorização
├── routes/          # Definição das rotas
├── utils/           # Utilitários (email, etc)
└── server.js        # Arquivo principal
```

## Configuração e Instalação

### Pré-requisitos
- Node.js
- MySQL
- NPM ou Yarn

### Instalação
```bash
cd backend
npm install
```

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
JWT_SECRET=seu_jwt_secret
JWT_REFRESH_SECRET=seu_refresh_secret
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

### Inicialização
```bash
npm start
# ou para desenvolvimento
npm run dev
```

## Autenticação e Autorização

### Registro de Usuário
**POST** `/register`

**Request:**
```json
{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "Senha@123",
  "user_type": "student"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": "1",
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "role": "student"
  }
}
```

### Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "Senha@123",
  "rememberMe": false
}
```

**Resposta:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_aqui",
  "user": {
    "id": "1",
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "role": "student"
  }
}
```

### Refresh Token
**POST** `/auth/refresh-token`

**Request:**
```json
{
  "refreshToken": "refresh_token_aqui"
}
```

**Resposta:**
```json
{
  "token": "novo_token_aqui"
}
```

### Ativação de Conta
**GET** `/auth/activate/:token`

### Recuperação de Senha

#### Solicitar Reset
**POST** `/auth/forgot-password`

**Request:**
```json
{
  "email": "usuario@email.com"
}
```

#### Redefinir Senha
**POST** `/auth/reset-password/:token`

**Request:**
```json
{
  "newPassword": "NovaSenha@123"
}
```

## 2FA (Autenticação de Dois Fatores)

### Habilitar 2FA
**POST** `/auth/enable-2fa`

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Resposta:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

### Verificar Código 2FA (Segunda Etapa do Login)
**POST** `/auth/verify-2fa`

**Request:**
```json
{
  "user_id": "1",
  "token": "123456"
}
```

**Resposta:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Desabilitar 2FA
**POST** `/auth/twofactor/disable`

**Headers:**
```
Authorization: Bearer <token_jwt>
```

## Dashboard

### Métricas Principais
**GET** `/dashboard/metrics`

**Resposta:**
```json
{
  "totalUsers": 1248,
  "activeSessions": 84,
  "errorRate": 2.3,
  "responseTime": 320,
  "userSatisfaction": 4.7
}
```

### Últimos Usuários
**GET** `/dashboard/users/recent`

**Resposta:**
```json
[
  {
    "id": "1",
    "name": "Usuario Exemplo",
    "email": "exemplo@email.com",
    "registrationDate": "2023-09-20T10:30:00Z",
    "profileType": "Docente",
    "status": "Ativo"
  }
]
```

### Distribuição de Perfis
**GET** `/dashboard/profiles-distribution`

**Resposta:**
```json
{
  "labels": ["Estudantes", "Docentes", "Administradores"],
  "data": [800, 300, 148],
  "colors": ["#3b82f6", "#8b5cf6", "#10b981"]
}
```

## Gerenciamento de Usuários

### Administradores

#### Listar Administradores
**GET** `/users/admin/list`

**Parâmetros de Query:**
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `status` (opcional): Filtrar por status

**Resposta:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Admin User",
      "email": "admin@email.com",
      "accessLevel": "Super Admin",
      "status": "Ativo",
      "createdAt": "2023-01-15T08:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "itemsPerPage": 10
  }
}
```

#### Adicionar Administrador
**POST** `/users/admin/add`

**Request:**
```json
{
  "name": "Novo Admin",
  "email": "novo.admin@email.com",
  "password": "Senha@123",
  "accessLevel": "Moderador"
}
```

#### Editar Administrador
**PUT** `/users/admin/edit/:id`

**Request:**
```json
{
  "name": "Admin Atualizado",
  "email": "admin.atualizado@email.com",
  "accessLevel": "Super Admin",
  "status": "Ativo"
}
```

#### Excluir Administrador
**DELETE** `/users/admin/delete/:id`

### Docentes

#### Listar Docentes
**GET** `/users/instructor/list`

**Resposta:**
```json
[
  {
    "id": "1",
    "name": "Docente Exemplo",
    "email": "docente@email.com",
    "coursesCreated": 12,
    "rating": 4.8,
    "status": "Ativo",
    "specialization": "Area de Especializacao"
  }
]
```

#### Adicionar Docente
**POST** `/users/instructor/add`

**Request:**
```json
{
  "name": "Novo Docente",
  "email": "novo.docente@email.com",
  "password": "Senha@123",
  "specialization": "Area de Especializacao"
}
```

### Estudantes

#### Listar Estudantes
**GET** `/users/student/list`

**Parâmetros de Query:**
- `status` (opcional): ativo, inativo, pendente
- `course` (opcional): id_do_curso
- `registrationDateFrom` (opcional): 2025-01-01
- `registrationDateTo` (opcional): 2025-10-31

**Resposta:**
```json
[
  {
    "id": "1",
    "name": "Estudante Exemplo",
    "email": "estudante@email.com",
    "enrolledCourses": 5,
    "status": "Ativo",
    "progress": 75,
    "lastAccess": "2025-10-26T14:30:00Z"
  }
]
```

## Gerenciamento de Cursos

### Listar Cursos
**GET** `/courses/list`

**Parâmetros de Query:**
- `category` (opcional): programming, design, business
- `status` (opcional): ativo, inativo, rascunho
- `instructor` (opcional): id_do_instrutor

**Resposta:**
```json
[
  {
    "id": "1",
    "title": "Curso Exemplo",
    "description": "Descricao do curso exemplo",
    "instructor": "Instrutor Exemplo",
    "category": "Programacao",
    "price": 199.90,
    "studentsEnrolled": 150,
    "rating": 4.8,
    "status": "Ativo"
  }
]
```

### Adicionar Curso
**POST** `/courses/add`

**Request:**
```json
{
  "title": "Novo Curso",
  "description": "Descricao do novo curso",
  "category": "Programacao",
  "price": 149.90,
  "duration": "40 horas",
  "instructorId": "1"
}
```

### Editar Curso
**PUT** `/courses/edit/:id`

**Request:**
```json
{
  "title": "Curso Atualizado",
  "description": "Nova descricao do curso",
  "price": 179.90,
  "status": "Ativo"
}
```

## Gerenciamento de Chamados

### Listar Chamados
**GET** `/tickets/list`

**Parâmetros de Query:**
- `status` (opcional): aberto, em_andamento, finalizado, cancelado
- `category` (opcional): suporte, tecnico, financeiro
- `priority` (opcional): baixa, media, alta, urgente

**Resposta:**
```json
[
  {
    "id": "1",
    "code": "0821-00040",
    "createdAt": "2025-10-15T14:13:00Z",
    "status": "aberto",
    "subject": "Assunto do Chamado",
    "description": "Descricao detalhada do problema",
    "requesterName": "Usuario Exemplo",
    "requesterEmail": "usuario@email.com",
    "category": "Suporte Tecnico",
    "priority": "media"
  }
]
```

### Abrir Chamado
**POST** `/tickets/add`

**Request:**
```json
{
  "subject": "Assunto do chamado",
  "description": "Descricao detalhada do problema",
  "category": "Suporte Tecnico",
  "priority": "media"
}
```

### Visualizar Chamado
**GET** `/tickets/view/:id`

**Resposta:**
```json
{
  "id": "1",
  "code": "0821-00040",
  "createdAt": "2025-10-15T14:13:00Z",
  "status": "aberto",
  "subject": "Assunto do Chamado",
  "description": "Descricao detalhada do problema",
  "requesterName": "Usuario Exemplo",
  "requesterEmail": "usuario@email.com",
  "category": "Suporte Tecnico",
  "priority": "media",
  "messages": [
    {
      "id": "1",
      "sender": "Usuario Exemplo",
      "message": "Mensagem do usuario",
      "timestamp": "2025-10-15T14:13:00Z",
      "type": "user"
    }
  ]
}
```

## Perfil do Usuário

### Visualizar Perfil
**GET** `/profile/view`

**Resposta:**
```json
{
  "id": "1",
  "name": "Usuario Admin",
  "email": "admin@email.com",
  "phone": "(71) 99999-9999",
  "role": "Super Administrador",
  "registrationDate": "2023-01-15T08:00:00Z",
  "lastAccess": "2025-10-26T14:23:00Z",
  "twoFactorEnabled": true
}
```

### Editar Perfil
**PUT** `/profile/edit`

**Request:**
```json
{
  "name": "Usuario Atualizado",
  "email": "usuario.atualizado@email.com",
  "phone": "(71) 98888-8888"
}
```

### Alterar Senha
**PUT** `/profile/change-password`

**Request:**
```json
{
  "currentPassword": "SenhaAtual@123",
  "newPassword": "NovaSenha@123",
  "confirmPassword": "NovaSenha@123"
}
```

## Configurações do Sistema

### Configurações Gerais
**GET** `/settings/general`

**Resposta:**
```json
{
  "siteName": "Plataforma de Cursos",
  "siteDescription": "Plataforma de ensino online",
  "contactEmail": "contato@plataforma.com",
  "maxUsers": 1000,
  "maintenanceMode": false,
  "registrationEnabled": true
}
```

**PUT** `/settings/general`

**Request:**
```json
{
  "siteName": "Nova Plataforma",
  "siteDescription": "Nova descricao da plataforma",
  "contactEmail": "novo@plataforma.com",
  "maxUsers": 1500
}
```

### Configurações de Segurança
**GET** `/settings/security`

**Resposta:**
```json
{
  "passwordMinLength": 8,
  "requireSpecialChars": true,
  "requireNumbers": true,
  "sessionTimeout": 60,
  "maxLoginAttempts": 5,
  "twoFactorAuth": true
}
```

## Relatórios

### Relatório de Chamados
**GET** `/reports/tickets`

**Resposta:**
```json
{
  "totalTickets": 150,
  "openTickets": 45,
  "inProgressTickets": 30,
  "closedTickets": 75,
  "averageResolutionTime": "2.5 dias",
  "ticketsByCategory": [
    {
      "category": "Suporte Tecnico",
      "count": 60,
      "percentage": 40
    }
  ]
}
```

### Relatório de Cursos
**GET** `/reports/courses`

**Resposta:**
```json
{
  "totalCourses": 45,
  "activeCourses": 38,
  "totalEnrollments": 1250,
  "popularCourses": [
    {
      "courseName": "Curso Exemplo",
      "enrollments": 150,
      "completionRate": 85
    }
  ]
}
```

### Exportar Dados
**GET** `/reports/export/csv`
**GET** `/reports/export/pdf`

## Rota de Health Check
**GET** `/`

**Resposta:**
```json
{
  "message": "Sistema rodando normalmente",
  "timestamp": "2025-10-26T14:30:00Z",
  "version": "1.0.0"
}
```

## Códigos de Erro Padronizados

### Erro de Autenticação
```json
{
  "success": false,
  "error": "Token de autenticação inválido",
  "code": "AUTH_001"
}
```

### Erro de Validação
```json
{
  "success": false,
  "error": "Dados de entrada inválidos",
  "code": "VALIDATION_001",
  "details": [
    {
      "field": "email",
      "message": "Email é obrigatório"
    }
  ]
}
```

### Erro de Permissão
```json
{
  "success": false,
  "error": "Usuário não tem permissão para acessar este recurso",
  "code": "PERMISSION_001"
}
```

### Erro de Recurso Não Encontrado
```json
{
  "success": false,
  "error": "Usuário não encontrado",
  "code": "NOT_FOUND_001"
}
```

## Notas Importantes para o Frontend

1. **Autenticação**: Todas as rotas (exceto login, registro e ativação) requerem token JWT no header:
   ```
   Authorization: Bearer <token>
   ```

2. **Fluxo de 2FA**:
   - Primeiro login retorna token normalmente se 2FA não estiver ativado
   - Se 2FA estiver ativado, login retorna `"2FA_REQUIRED"` e `user_id`
   - Use `user_id` e código do autenticador em `/auth/verify-2fa` para obter token final

3. **Paginação**: Para listas, use parâmetros `page` e `limit` na query string

4. **Filtros**: Use query parameters para filtrar resultados:
   - `/users/student/list?status=ativo&course=javascript`
   - `/tickets/list?status=aberto&priority=alta`

5. **Formatação de Datas**: Use formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)

6. **Validação de Senha**: Senhas devem atender critérios mínimos:
   - Mínimo 8 caracteres
   - Letras maiúsculas e minúsculas
   - Números e caracteres especiais

7. **Tratamento de Erros**: Sempre verifique o campo `success` e trate erros conforme os códigos padronizados

8. **Upload de Arquivos**: Para uploads, use multipart/form-data e inclua arquivos no campo `attachments`

## Fluxos Principais

### Fluxo de Login com 2FA
1. POST `/auth/login` → Se 2FA ativo, retorna `2FA_REQUIRED`
2. POST `/auth/verify-2fa` → Retorna token final
3. Usar token em requisições subsequentes

### Fluxo de Recuperação de Senha
1. POST `/auth/forgot-password` → Envia email com token
2. POST `/auth/reset-password/:token` → Redefine senha

### Fluxo de Ativação de Conta
1. POST `/registeruser` → Cria conta inativa
2. GET `/auth/activate/:token` → Ativa conta via link do email

### Fluxo de Refresh Token
1. Usar refresh token em POST `/auth/refresh-token`
2. Receber novo access token
3. Continuar usando novas requisições

Esta documentação cobre todas as funcionalidades implementadas no backend. Para dúvidas específicas sobre alguma rota ou funcionalidade, consulte os controladores correspondentes.