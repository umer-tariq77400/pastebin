import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import UserProfile from './components/UserProfile'
import SnippetDetail from './components/SnippetDetail'
import Dashboard from './components/Dashboard'
import SharedSnippetAccess from './components/SharedSnippetAccess'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div style={{display:'flex', alignItems:'center'}}>
            <span className="material-icons" style={{marginRight:'10px'}}>code</span>
            <h1>Snippet Manager</h1>
        </div>
        <UserProfile />
      </nav>
      <div className="app-container">
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
            path="/"
            element={
                <ProtectedRoute>
                <Dashboard />
                </ProtectedRoute>
            }
            />
            <Route
            path="/snippets/:id"
            element={
                <ProtectedRoute>
                <SnippetDetail />
                </ProtectedRoute>
            }
            />
            <Route
            path="/shared/:uuid"
            element={
                <ProtectedRoute>
                    <SharedSnippetAccess />
                </ProtectedRoute>
            }
            />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
