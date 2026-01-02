import express from "express"
import { getUsers, createUser, deleteUser } from "../controllers/userController.js"
import { authenticate, isAdmin } from "../middleware/auth.js"

const router = express.Router()

router.get("/", authenticate, getUsers)
router.post("/", authenticate, isAdmin, createUser)
router.delete("/:id", authenticate, isAdmin, deleteUser)

export default router
