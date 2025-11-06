const Payment = require("../database/models/payment");
const User = require("../database/models/user");
const Course = require("../database/models/courses");
const { createOrder } = require("../services/pagbankService");

exports.createPayment = async (req, res) => {
  try {
    const userId = req.user.id; // vem do middleware auth
    const { courseId } = req.body;

    const user = await User.findByPk(userId);
    const course = await Course.findByPk(courseId);

    if (!course) return res.status(404).json({ message: "Curso não encontrado" });

    const pagbankOrder = await createOrder({ user, course });

    const payment = await Payment.create({
      userId,
      courseId,
      pagbankOrderId: pagbankOrder.id,
      amount: course.price,
      status: "PENDING"
    });

    // checkout URL do PagBank
    const checkoutUrl = pagbankOrder.links?.find(l => l.rel === "PAYMENT")?.href;

    return res.status(201).json({
      message: "Pagamento criado com sucesso",
      checkoutUrl,
      paymentId: payment.id
    });
  } catch (err) {
    console.error("Erro ao criar pagamento:", err.message);
    res.status(500).json({ message: "Erro ao processar pagamento" });
  }
};

// webhook chamado pelo PagBank quando o pagamento muda de status
exports.handleWebhook = async (req, res) => {
  try {
    const { id, reference_id, status } = req.body;

    const payment = await Payment.findOne({ where: { pagbankOrderId: id } });
    if (!payment) return res.status(404).send("Pagamento não encontrado");

    await payment.update({ status: status.toUpperCase() });

    // aqui você pode liberar o curso se o status for "PAID"
    if (status.toUpperCase() === "PAID") {
      // exemplo: marcar matrícula como ativa
      console.log(`✅ Curso ${payment.courseId} liberado para usuário ${payment.userId}`);
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Erro no webhook PagBank:", err.message);
    res.status(500).send("Erro interno");
  }
};
