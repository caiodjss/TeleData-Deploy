# Guia de rotas para o frontend

## Usando rotas
#### `app.use("/home", home);`
#### `app.use("/profile", profileRouter);`
#### `app.use("/auth", authRouter);`
#### `app.use("/", registeruser);`
#### `app.use("/user", userRoutes);`
#### `app.use("/reports", reportRoutes);`
#### `app.use("/dashboard", dashboardRoutes);`
#### `app.use("/tickets", ticketRoutes);`
#### `app.use("/courses", courseRoutes);`
#### `app.use("/settings", settingsRoutes);`
#### `app.use("/tmp", express.static("tmp"));`
#

## **Rota de Registro**
Post

/register

```json
{
    "name": "Exemplo da Silva",
    "email": "exemplo@teledata.com",
    "password": "Exemplo@01",
    "user_type": "admin, student ou instructor"
}
```

## **Rota de Login**
Post
/auth/login
```json
{
    "email": "exemplo@teledata.com",
    "passoword": "Exemplo@01",
    "rememberMe": true ou false
}
```

