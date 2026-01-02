"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Navbar.css"

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          Task Manager
        </Link>
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>
          <Link to="/priorities" className="navbar-link">
            Priority Board
          </Link>
          {isAdmin && (
            <Link to="/users" className="navbar-link">
              Users
            </Link>
          )}
          <div className="navbar-user">
            <div className="user-info">
              <span className="navbar-username">{user?.name}</span>
              <span className="navbar-email">{user?.email}</span>
            </div>
            {/* Role badge shows admin or user status */}
            {isAdmin ? (
              <span className="navbar-badge admin-badge">Admin</span>
            ) : (
              <span className="navbar-badge user-badge">User</span>
            )}
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
