"use client"

import { useState, useEffect, useCallback } from "react"
import api from "../config/api"
import Navbar from "../components/Navbar"
import TaskCard from "../components/TaskCard"
import CreateTaskModal from "../components/CreateTaskModal"
import EditTaskModal from "../components/EditTaskModal"
import TaskDetailsModal from "../components/TaskDetailsModal"
import DeleteTaskModal from "../components/DeleteTaskModal"
import { useAuth } from "../context/AuthContext"
import "./Dashboard.css"

const Dashboard = () => {
  const { isAdmin, user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [priorityFilter, setPriorityFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const params = { page, limit: 10 }
      if (priorityFilter) params.priority = priorityFilter
      if (statusFilter) params.status = statusFilter

      const response = await api.get("/api/tasks", { params })
      setTasks(response.data.tasks)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }, [page, priorityFilter, statusFilter])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setShowEditModal(true)
  }

  const handleUpdateTask = () => {
    setShowEditModal(false)
    setSelectedTask(null)
    fetchTasks()
  }

  const handleViewDetails = (task) => {
    setSelectedTask(task)
    setShowDetailsModal(true)
  }

  const handleDeleteTask = (task) => {
    setSelectedTask(task)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    setShowDeleteModal(false)
    setSelectedTask(null)
    fetchTasks()
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status: newStatus })
      fetchTasks()
    } catch (error) {
      console.error("Failed to update task status:", error)
    }
  }

  const myCreatedTasks = tasks.filter((task) => {
    return task.createdBy && user && task.createdBy._id === user.id
  })

  const assignedByAdminTasks = tasks.filter((task) => {
    return (
      task.createdBy && task.assignedTo && user && task.createdBy._id !== user.id && task.assignedTo._id === user.id
    )
  })

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>{isAdmin ? "All Tasks" : "My Tasks"}</h1>
            <p className="dashboard-subtitle">
              {isAdmin ? "Manage all tasks and assign to users" : "View and manage your assigned tasks"}
            </p>
          </div>
          <button className="btn btn-primary create-task-btn" onClick={() => setShowCreateModal(true)}>
            <span className="btn-icon">+</span> Create New Task
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Priority:</label>
            <select
              className="input filter-select"
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <select
              className="input filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tasks found</h3>
            <p>Create your first task to get started</p>
          </div>
        ) : (
          <>
            {isAdmin ? (
              <div className="tasks-grid">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onViewDetails={handleViewDetails}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <>
                {myCreatedTasks.length > 0 && (
                  <div className="task-section">
                    <div className="section-header">
                      <h2>My Created Tasks</h2>
                      <p className="section-subtitle">Tasks you created - Full control (Edit, Delete, Mark Complete)</p>
                    </div>
                    <div className="tasks-grid">
                      {myCreatedTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          onViewDetails={handleViewDetails}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {assignedByAdminTasks.length > 0 && (
                  <div className="task-section">
                    <div className="section-header">
                      <h2>Tasks Assigned by Admin</h2>
                      <p className="section-subtitle">Tasks assigned to you - View details and mark complete only</p>
                    </div>
                    <div className="tasks-grid">
                      {assignedByAdminTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          onViewDetails={handleViewDetails}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {myCreatedTasks.length === 0 && assignedByAdminTasks.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No tasks found</h3>
                    <p>Create your first task to get started</p>
                  </div>
                )}
              </>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button className="btn btn-secondary" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  ← Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button className="btn btn-secondary" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showCreateModal && <CreateTaskModal onClose={() => setShowCreateModal(false)} onCreate={fetchTasks} />}

      {showEditModal && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => {
            setShowEditModal(false)
            setSelectedTask(null)
          }}
          onUpdate={handleUpdateTask}
        />
      )}

      {showDetailsModal && selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedTask(null)
          }}
        />
      )}

      {showDeleteModal && selectedTask && (
        <DeleteTaskModal
          task={selectedTask}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedTask(null)
          }}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  )
}

export default Dashboard
