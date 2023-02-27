const { Sequelize, DataTypes } = require("sequelize");
const {db} = require("../config/db");

const User = db.define('users',{
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password : DataTypes.STRING,
    gender: DataTypes.STRING,
    refresh_token : DataTypes.TEXT
},{
    freezeTableName:true
})

module.exports = User;

(async()=>{
    await db.sync();
})();