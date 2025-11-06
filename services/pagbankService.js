const axios = require("axios");
const PAGBANK_URL = "https://api.pagbank.com.br";
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN;

async function createOrder({ user, course }) {
  try {
    const response = await axios.post(
      `${PAGBANK_URL}/orders`,
      {
        customer: {
          name: user.name,
          email: user.email
        },
        items: [
          {
            name: course.title,
            quantity: 1,
            unit_amount: Math.round(course.price * 100) // em centavos
          }
        ],
        charges: [
          {
            reference_id: `CURSO-${course.id}-USER-${user.id}`,
            description: `Pagamento curso ${course.title}`,
            amount: {
              value: Math.round(course.price * 100),
              currency: "BRL"
            },
            payment_method: {
              type: "CREDIT_CARD"
            }
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${PAGBANK_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar ordem no PagBank:", error.response?.data || error.message);
    throw new Error("Erro ao criar pagamento no PagBank");
  }
}

module.exports = { createOrder };
