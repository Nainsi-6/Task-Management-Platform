"use client"
import { useAuth } from "../context/AuthContext"
import "./TaskCard.css"

const TaskCard = ({ task, onEdit, onDelete, onViewDetails, onStatusChange }) => {
  const { isAdmin, user } = useAuth()
  const isCreator = task.createdBy._id === user.id
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
          <strong>Due Date:</strong> {formatDate(task.dueDate)}
        </div>
        <div className="task-meta-item">
          <strong>Assigned To:</strong> {task.assignedTo.name}
        </div>
        <div className="task-meta-item">
          <strong>Created By:</strong> {task.createdBy.name}
        </div>
      </div>

      <div className="task-actions">
        <button className="btn btn-secondary btn-sm" onClick={() => onViewDetails(task)}>
          View Details
        </button>

        {task.status === "pending" ? (
          <button className="btn btn-success btn-sm" onClick={() => onStatusChange(task._id, "completed")}>
            Mark Complete
          </button>
        ) : (
          <button className="btn btn-secondary btn-sm" onClick={() => onStatusChange(task._id, "pending")}>
            Mark Pending
          </button>
        )}

        {(isAdmin || isCreator) && (
          <>
            <button className="btn btn-primary btn-sm" onClick={() => onEdit(task)}>
              Edit
            </button>

            <button className="btn btn-danger btn-sm" onClick={() => onDelete(task)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default TaskCard
