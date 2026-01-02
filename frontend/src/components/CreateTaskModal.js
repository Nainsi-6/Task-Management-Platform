"use client"

import { useState, useEffect } from "react"
import api from "../config/api"
import { useAuth } from "../context/AuthContext"
import "./Modal.css"
import { useNavigate } from "react-router-dom" // Add this

const CreateTaskModal = ({ onClose, onCreate }) => {
  const { user, isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const navigate = useNavigate() // Add this
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignedTo: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    } else if (user?._id) {
      setFormData((prev) => ({ ...prev, assignedTo: user._id }))
    }
  }, [isAdmin, user])

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users")
      if (response.data && response.data.users) {
        setUsers(response.data.users)
      }
    } catch (err) {
      setError("Failed to load users.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const taskData = {
        ...formData,
        assignedTo: isAdmin ? formData.assignedTo : user._id,
      }
      await api.post("/api/tasks", taskData)
      onCreate() 

    
    // 2. Navigate back to the dashboard
    navigate("/dashboard") 
    
    // 3. Ensure the modal closes (if onCreate doesn't already do it)
    onClose()
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <div className="header-text">
            <h2>Create New Task</h2>
            <p>Fill in the details below</p>
          </div>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="task-modal-form">
          <div className="form-inner-body">
            <div className="task-input-group">
              <label>Task Title *</label>
              <input
                type="text"
                name="title"
                className="task-custom-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="What needs to be done?"
                required
              />
            </div>

            <div className="task-input-group">
              <label>Description *</label>
              <textarea
                name="description"
                className="task-custom-input"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the details..."
                required
              />
            </div>

            <div className="task-input-row">
              <div className="task-input-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  className="task-custom-input"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="task-input-group">
                <label>Priority *</label>
                <select name="priority" className="task-custom-input" value={formData.priority} onChange={handleChange}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>

            {isAdmin ? (
              <div className="task-input-group">
                <label>Assign To *</label>
                <select name="assignedTo" className="task-custom-input" value={formData.assignedTo} onChange={handleChange} required>
                  <option value="">Select Team Member</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {/* This line now shows the name and the email together */}
                      {u.name} {u.email ? `(${u.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="task-assignee-info">
                <span>👤 Assigned to: <strong>{user?.name} (You)</strong></span>
              </div>
            )}

            {error && <div className="task-error-msg">{error}</div>}
          </div>

          <div className="task-modal-footer">
            <button type="button" className="task-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="task-btn-primary" 
              disabled={loading || (isAdmin && users.length === 0)}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTaskModal