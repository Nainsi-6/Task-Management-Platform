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
    <div className="task-modal-overlay" onClick={onClose}>
      {/* Added task-modal-content and modal-large for better width */}
      <div className="task-modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER: Matches Create Modal exactly */}
        <div className="task-modal-header">
          <div className="header-text">
            <h2>Task Details</h2>
            <p>Complete information for this task</p>
          </div>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>

        {/* BODY: Uses form-inner-body for consistent padding and scrolling */}
        <div className="form-inner-body">
          
          {/* Section: Basic Info */}
          <div className="task-input-group" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
            <label>Basic Information</label>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>TITLE</span>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginTop: '4px' }}>{task.title}</div>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>DESCRIPTION</span>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                {task.description}
              </p>
            </div>
          </div>

          {/* Section: Status & Priority in a Row */}
          <div className="task-input-row" style={{ marginTop: '20px' }}>
            <div className="task-input-group">
              <label>Status</label>
              <span className={`status-badge status-${task.status}`} style={{ display: 'inline-block' }}>
                {task.status.toUpperCase()}
              </span>
            </div>
            <div className="task-input-group">
              <label>Priority</label>
              <span className={`priority-badge priority-${task.priority}`} style={{ display: 'inline-block' }}>
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Section: Dates */}
          <div className="task-input-row">
             <div className="task-input-group">
                <label>Due Date</label>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{formatDate(task.dueDate)}</div>
             </div>
             <div className="task-input-group">
                <label>Created At</label>
                <div style={{ fontSize: '14px', color: '#64748b' }}>{formatDate(task.createdAt)}</div>
             </div>
          </div>

          {/* Section: Assignment Info */}
          <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="task-input-group">
              <label>Assigned To</label>
              <div className="task-assignee-info" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '700', color: '#1e293b' }}>{task.assignedTo.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{task.assignedTo.email}</div>
              </div>
            </div>
            <div className="task-input-group">
              <label>Created By</label>
              <div className="task-assignee-info" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '700', color: '#1e293b' }}>{task.createdBy.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{task.createdBy.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER: Fixed at bottom */}
        <div className="task-modal-footer">
          <button className="task-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailsModal