const { sql } = require("googleapis/build/src/apis/sql");
const connection = require("../database/connection")
const Sequelize = require("sequelize")



const VideoAula = connection.define("videoaula",{

    aula_id:{
        primaryKey:true,
        autoIncrement: true,
        type: Sequelize.INTEGER(10),
        allowNull:false
    },

    aula_name:{
        type:Sequelize.STRING(255),
        allowNull:false,
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    
});



module.exports = VideoAula;



