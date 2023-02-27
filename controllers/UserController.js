const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const Register = async(req, res)=>{
    const { name, email, password, confirmPassword } = req.body;
    if(confirmPassword == null) return res.status(400).json({message : "you need to Confirm Password"})
    if(password !== confirmPassword) return res.status(400).json({
        message : "Password and Confirm Password not same"
        }
    )
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt)
    try{
        await User.create({
            name : name,
            email : email,
            password : hashPassword
        });
        res.json({message : "Register Success"})
    }catch(error){
        console.log(error)
        res.json({message : `${error} Error`})
    }
}

const Login = async(req, res)=>{
    try{
        const user = await User.findOne({
            where:{
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password , user.password)
        if(!match) return res.status(400).json({
            message : "Wrong Password"
        })
        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: "60m",
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: "1d",
        });
        await User.update({refresh_token : refreshToken},{
            where :{
                id : userId
            }
        });
        res.cookie("refreshToken", refreshToken,{
            httpOnly : true,
            maxAge : 24 * 60 * 60 * 1000
        });
        res.json({accessToken})
    }catch(error){
        res.status(404).json({
            message : "Email not found"
        })
    }
}

const Logout = async(req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(400).json({
        message : "User not Found"
    });
    const user = await User.findAll({
        where :{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await User.update({ refresh_token : null },{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.status(200).json({
        message : "Logout Success"
    });
}

const getUser = async(req, res)=>{
    try{
        const user =  await User.findAll();
        console.log(req.email)
        const data = user.map(user => {
            return {
              id : user.id,
              name: user.name,
              email: user.email,
              gender: user.gender,
              password: user.password
            };
          });
        res.status(200).json({
            Success : "Get All User Success",
            data
        })
    }catch(error){
        console.log(error.message)
    }
}

const getUserById = async(req,res)=>{
    try{
        const user = await User.findOne({
            where:{
                id: req.params.id
            } 
        });
        const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            password: user.password
        }
        res.status(200).json(data)
    }catch(error){
        console.log(error.message)
    }
} 

const createUser = async(req,res)=>{
    try{
        const data = await User.create(req.body);
        res.status(201).json({
            Success: "User Created",
            data : data })
    }catch(error){
        console.log(error.message)
    }
} 

const updateUser = async(req,res)=>{
    try{
        const response = await User.update(req.body,{
            where :{
                id : req.params.id
            }
        });
        res.status(200).json({
            Success: "Update User Success",
            data : response })
    }catch(error){
        console.log(error.message)
    }
} 
 
const deleteUser = async(req,res)=>{
    try{
        const response = await User.findOne({
            where:{
                id: req.params.id
            } 
        });
       await User.destroy({
            where :{
                id : req.params.id
            }
        });
        res.status(200).json({
            Success: `Success Delete User With Id ${req.params.id}`,
            data : response})
    }catch(error){
        console.log(error.message)
    }
} 

const getUserByLogin = async(req,res) =>{
    try{
        const user = await User.findAll({
            where : {
                email : req.email
            }
        })
        res.status(200).json(user[0]) 
    }catch(error){
        res.status(400).json({
            message : "User not found"
        })
    }
}


module.exports = {
    getUser, 
    getUserById, 
    createUser,
    updateUser,
    deleteUser,
    Register,
    Login,
    Logout,
    getUserByLogin
}