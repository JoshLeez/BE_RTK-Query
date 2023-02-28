const express = require("express");
const cors = require("cors");
const UserRoute = require("./routes/UserRoute.js");
const cookieParser = require("cookie-parser")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
// gambaran path itu sama dengan route nyaa
const logRequest = (req, res, next) => {
    console.log("Terjadi request ke PATH : ", req.path)
    next()
 }

 app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(cookieParser())
app.use(express.json());
app.use(logRequest)
app.use(UserRoute);

app.listen(PORT, ()=> console.log(`Server is running http://localhost:${PORT}`));