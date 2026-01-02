"use client"
import "./Modal.css"

const TaskDetailsModal = ({ task, onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Task Details</h2>
            <p className="modal-subtitle">Complete task information</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="task-details">
          <div className="detail-section">
            <h3 className="detail-section-title">Basic Information</h3>

            <div className="detail-row">
              <strong>Title:</strong>
              <span className="detail-value">{task.title}</span>
            </div>

            <div className="detail-row">
              <strong>Description:</strong>
              <p className="detail-description">{task.description}</p>
            </div>

            <div className="detail-row">
              <strong>Due Date:</strong>
              <span className="detail-value">{formatDate(task.dueDate)}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">Status & Priority</h3>

            <div className="detail-row">
              <strong>Priority:</strong>
              <span className={`priority-badge priority-${task.priority}`}>{task.priority.toUpperCase()}</span>
            </div>

            <div className="detail-row">
              <strong>Status:</strong>
              <span className={`status-badge status-${task.status}`}>{task.status}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">Assignment & Tracking</h3>

            <div className="detail-row">
              <strong>Assigned To:</strong>
              <div className="detail-user-info">
                <span className="detail-user-name">{task.assignedTo.name}</span>
                <span className="detail-user-email">{task.assignedTo.email}</span>
              </div>
            </div>

            <div className="detail-row">
              <strong>Created By:</strong>
              <div className="detail-user-info">
                <span className="detail-user-name">{task.createdBy.name}</span>
                <span className="detail-user-email">{task.createdBy.email}</span>
              </div>
            </div>

            <div className="detail-row">
              <strong>Created At:</strong>
              <span className="detail-value">{formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailsModal
