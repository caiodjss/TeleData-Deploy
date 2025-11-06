const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/connection");
const passport = require("passport"); 

// Inicialização do app
const app = express();
const port = 3001;

// Middlewares para tratar JSON e formulários
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializo o Passport (sem sessões, só JWT depois)
app.use(passport.initialize());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Importando rotas
const home = require("./routes/home"); 
const profileRouter = require("./routes/profileRoutes"); 
const authRouter = require("./routes/authRoutes"); 
const registeruser = require("./routes/registerRoutes"); 
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const courseRoutes = require("./routes/courseRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Sincronizando banco
connection.sync({ alter: true })
  .then(() => console.log("Banco sincronizado"))
  .catch(console.error);

// Usando rotas
app.use("/home", home);
app.use("/profile", profileRouter);
app.use("/auth", authRouter);
app.use("/", registeruser);
app.use("/user", userRoutes);
app.use("/reports", reportRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/tickets", ticketRoutes);
app.use("/courses", courseRoutes);
app.use("/settings", settingsRoutes);
app.use("/payments", paymentRoutes);
app.use("/tmp", express.static("tmp"));

// Log do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
