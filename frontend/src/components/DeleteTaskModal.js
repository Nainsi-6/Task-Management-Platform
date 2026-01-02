"use client"

import { useState } from "react"
import api from "../config/api"

const DeleteTaskModal = ({ task, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setLoading(true)
    setError("")

    try {
      await api.delete(`/api/tasks/${task._id}`)
      onDelete()
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete task")
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Task</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <p style={{ marginBottom: "20px", color: "#6b7280" }}>
          Are you sure you want to delete the task "<strong>{task.title}</strong>"? This action cannot be undone.
        </p>

        {error && <div className="error">{error}</div>}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Task"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTaskModal
