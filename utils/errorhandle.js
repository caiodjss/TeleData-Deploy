
const ErrorModel = require("../database/models/error")



async function ErrorHandle (error){

    const errortype = error.code || "Não foi possível coletar o erro."
    const errormessage = error.message || "Erro Interno."

    const Error = await ErrorModel.create({
        error_type: errortype ,
        error_message: errormessage
    })

}

module.exports = ErrorHandle