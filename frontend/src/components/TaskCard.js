"use client"
import { useAuth } from "../context/AuthContext"
import "./TaskCard.css"

const TaskCard = ({ task, onEdit, onDelete, onViewDetails, onStatusChange }) => {
  const { isAdmin, user } = useAuth()
  
  // Safety check for creator ID
  const isCreator = task.createdBy?._id === user?.id

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
        <span className={`status-badge status-${task.status}`}>{task.status}</span>
      </div>

      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <div className="task-meta-item">
          <strong>Due Date:</strong> <span>{formatDate(task.dueDate)}</span>
        </div>
        <div className="task-meta-item">
          <strong>Assigned To:</strong> <span>{task.assignedTo.name}</span>
        </div>
      </div>

      <div className="task-actions">
        <button className="btn-card btn-details" onClick={() => onViewDetails(task)}>
          Details
        </button>

        {task.status === "pending" ? (
          <button className="btn-card btn-complete" onClick={() => onStatusChange(task._id, "completed")}>
          ✓ DONE
          </button>
        ) : (
          <button className="btn-card btn-details" onClick={() => onStatusChange(task._id, "pending")}>
            Reopen
          </button>
        )}

        {(isAdmin || isCreator) && (
          <>
            <button className="btn-card btn-edit" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button className="btn-card btn-delete" onClick={() => onDelete(task)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default TaskCard