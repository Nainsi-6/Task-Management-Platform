"use client"

import { useState, useEffect } from "react"
import api from "../config/api"
import Navbar from "../components/Navbar"
import "./Users.css"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/users")
      setUsers(response.data.users)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await api.post("/api/users", formData)
      setSuccess("User added successfully!")
      setFormData({ name: "", email: "", password: "", role: "user" })
      fetchUsers()
      setTimeout(() => {
        setShowAddModal(false)
        setSuccess("")
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add user")
    }
  }

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/api/users/${selectedUser._id}`)
      setSuccess("User deleted successfully!")
      fetchUsers()
      setTimeout(() => {
        setShowDeleteModal(false)
        setSelectedUser(null)
        setSuccess("")
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user")
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="users-header">
          <div>
            <h1>User Management</h1>
            <p className="users-subtitle">Manage system users and permissions</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <span className="btn-icon">+</span> Add New User
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <span className={`role-badge role-${user.role}`}>{user.role}</span>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setSelectedUser(user)
                    setShowDeleteModal(true)
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  className="input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  className="input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {error && <div className="error">⚠️ {error}</div>}
              {success && <div className="success">✓ {success}</div>}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete User</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                &times;
              </button>
            </div>

            <div style={{ padding: "32px" }}>
              <p style={{ fontSize: "16px", color: "#374151", marginBottom: "20px" }}>
                Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
              </p>

              {error && <div className="error">⚠️ {error}</div>}
              {success && <div className="success">✓ {success}</div>}

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDeleteUser}>
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
