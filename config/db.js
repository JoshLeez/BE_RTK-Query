require("dotenv").config();
const { Sequelize } = require("sequelize");

const db = new Sequelize(process.env.DATABASE,process.env.USER, process.env.PASSWORD,{
    host: process.env.HOST, 
    dialect: 'mysql',
    logging: false  
});

module.exports = {db};