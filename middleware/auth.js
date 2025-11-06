const jwt = require("jsonwebtoken");
const config = require("../config/config"); // Importa o arquivo de configuração

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      console.log("Erro ao verificar token:", err);

      if (err.name === "TokenExpiredError") {
        console.log("Token expirado em:", err.expiredAt);
        return res.status(401).json({ message: "Token expirado" });
      }

      return res.status(403).json({ message: "Token inválido" });
    }

    //Apenas para debug: mostra horário de expiração e horário atual
    const decoded = jwt.decode(token);
    console.log("Expira em:", new Date(decoded.exp * 1000).toLocaleString());
    console.log("Agora:", new Date().toLocaleString());

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;