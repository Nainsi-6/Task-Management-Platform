"use client"
import { useState, useEffect } from "react"
import api from "../config/api"
import Navbar from "../components/Navbar"
import "./PriorityBoard.css"

const PriorityBoard = () => {
  const [tasks, setTasks] = useState({ low: [], medium: [], high: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/tasks", { params: { limit: 100 } })

      const grouped = {
        low: response.data.tasks.filter((t) => t.priority === "low"),
        medium: response.data.tasks.filter((t) => t.priority === "medium"),
        high: response.data.tasks.filter((t) => t.priority === "high"),
      }

      setTasks(grouped)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      await api.put(`/api/tasks/${taskId}`, { priority: newPriority })
      fetchTasks()
    } catch (error) {
      console.error("Failed to update task priority:", error)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit"
    })
  }

  const renderPriorityColumn = (priority, label) => (
    <div className="priority-column">
      <div className={`priority-column-header p-header-${priority}`}>
        <h2>{label}</h2>
        <span className="task-count-badge">{tasks[priority].length} Tasks</span>
      </div>
      
      <div className="priority-column-content">
        {tasks[priority].length === 0 ? (
          <div className="empty-state">
             <p>No {label.toLowerCase()} tasks</p>
          </div>
        ) : (
          tasks[priority].map((task) => (
            <div key={task._id} className="priority-task-card">
              <div className="priority-task-header">
                <h3>{task.title}</h3>
                <span className={`status-pill pill-${task.status}`}>{task.status}</span>
              </div>
              
              <p className="priority-task-description">{task.description}</p>
              
              <div className="priority-task-meta">
                <div className="meta-item"><strong>Due:</strong> {formatDate(task.dueDate)}</div>
                <div className="meta-item"><strong>For:</strong> {task.assignedTo?.name || "Unassigned"}</div>
              </div>

              <div className="priority-task-actions">
                {priority !== "low" && (
                  <button
                    className="priority-move-btn move-down-vibrant"
                    onClick={() => handlePriorityChange(task._id, priority === "high" ? "medium" : "low")}
                  >
                    Reduce ↓
                  </button>
                )}
                {priority !== "high" && (
                  <button
                    className="priority-move-btn move-up-vibrant"
                    onClick={() => handlePriorityChange(task._id, priority === "low" ? "medium" : "high")}
                  >
                    Raise ↑
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="board-page-wrapper">
      <Navbar />
      <div className="board-container">
        <header className="board-intro">
          <h1>Priority Board</h1>
          <p>Strategic Task Distribution</p>
        </header>

        {loading ? (
          <div className="board-loading-container">
            <p>Gathering your tasks...</p>
          </div>
        ) : (
          <div className="priority-board-grid">
            {renderPriorityColumn("high", "Urgent")}
            {renderPriorityColumn("medium", "Medium")}
            {renderPriorityColumn("low", "Low")}
          </div>
        )}
      </div>
    </div>
  )
}

export default PriorityBoard;