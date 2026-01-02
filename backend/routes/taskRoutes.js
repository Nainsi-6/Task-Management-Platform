import express from "express"
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../controllers/taskController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.get("/", authenticate, getTasks)
router.get("/:id", authenticate, getTaskById)
router.post("/", authenticate, createTask)
router.put("/:id", authenticate, updateTask)
router.delete("/:id", authenticate, deleteTask)
router.patch("/:id/status", authenticate, updateTaskStatus)

export default router
