const Ticket = require("../database/models/ticket");
const User = require("../database/models/user");

// Abrir novo chamado
exports.addTicket = async (req, res) => {
  try {
    const { title, description, category, attachments, assigned_to } = req.body;
    const ticket = await Ticket.create({
      title,
      description,
      category,
      attachments,
      created_by: req.user.user_id,
      assigned_to: assigned_to || null
    });
    res.status(201).json({ message: "Chamado criado com sucesso", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar chamado" });
  }
};

// Listar chamados com filtros
exports.listTickets = async (req, res) => {
  try {
    const { status, category, created_by } = req.query;
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (created_by) where.created_by = created_by;

    const tickets = await Ticket.findAll({
      where,
      include: [
        { model: User, as: "creator", attributes: ["full_name", "email"] },
        { model: User, as: "assignee", attributes: ["full_name", "email"] }
      ],
      order: [["created_at", "DESC"]]
    });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao listar chamados" });
  }
};

// Visualizar detalhes do chamado
exports.viewTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["full_name", "email"] },
        { model: User, as: "assignee", attributes: ["full_name", "email"] }
      ]
    });
    if (!ticket) return res.status(404).json({ message: "Chamado não encontrado" });
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar chamado" });
  }
};

// Atualizar chamado
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ message: "Chamado não encontrado" });

    Object.assign(ticket, updates);
    ticket.updated_at = new Date();
    await ticket.save();

    res.json({ message: "Chamado atualizado com sucesso", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar chamado" });
  }
};

// Excluir chamado
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ message: "Chamado não encontrado" });

    await ticket.destroy();
    res.json({ message: "Chamado excluído com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao excluir chamado" });
  }
};
