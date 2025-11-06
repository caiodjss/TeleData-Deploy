// Middleware para verificar o tipo de usuário
module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const { user_type } = req.user;

    if (!allowedRoles.includes(user_type)) {
      return res.status(403).json({ message: "Acesso negado para este tipo de usuário" });
    }

    next();
  };
  
};
