const express = require("express");
const {
  getUser,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  Register,
  Login,
  Logout,
  getUserByLogin,
} = require("../controllers/UserController");
const refreshToken = require("../middleware/RefreshToken");
const verifyToken = require("../middleware/VerfiyToken");

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
router.get("/users", verifyToken, getUser);
router.get("/users-by-login", verifyToken, getUserByLogin);
router.get("/users/:id",verifyToken, getUserById);
router.post("/users", verifyToken,createUser);
router.patch("/users/:id", verifyToken,updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

module.exports = router;
