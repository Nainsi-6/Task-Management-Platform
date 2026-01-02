import Task from "../models/Task.js"

export const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, priority, status } = req.query
    const query = {}

    if (req.user.role !== "admin") {
      query.assignedTo = req.user._id
    }

    if (priority) query.priority = priority
    if (status) query.status = status

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Task.countDocuments(query)

    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalTasks: count,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    // Check access permissions
    if (req.user.role !== "admin" && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" })
    }

    res.json({ task })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body

    const finalAssignedTo = req.user.role === "admin" ? assignedTo : req.user._id

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo: finalAssignedTo,
      createdBy: req.user._id,
    })

    await task.save()
    await task.populate("assignedTo", "name email")
    await task.populate("createdBy", "name email")

    res.status(201).json({ message: "Task created successfully", task })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo } = req.body

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    if (req.user.role !== "admin" && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied. You can only edit tasks you created." })
    }

    // Update fields
    if (title) task.title = title
    if (description) task.description = description
    if (dueDate) task.dueDate = dueDate
    if (priority) task.priority = priority
    if (status) task.status = status
    if (assignedTo && req.user.role === "admin") task.assignedTo = assignedTo

    await task.save()
    await task.populate("assignedTo", "name email")
    await task.populate("createdBy", "name email")

    res.json({ message: "Task updated successfully", task })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    if (req.user.role !== "admin" && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied. You can only delete tasks you created." })
    }

    await Task.findByIdAndDelete(req.params.id)

    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    // Check permissions
    if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" })
    }

    task.status = status
    await task.save()
    await task.populate("assignedTo", "name email")
    await task.populate("createdBy", "name email")

    res.json({ message: "Task status updated successfully", task })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
