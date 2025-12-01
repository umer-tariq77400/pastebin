import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSnippets } from './api/snippet'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import UserProfile from './components/UserProfile'
import SnippetDetail from './components/SnippetDetail'

function Home() {
  const [snippets, setSnippets] = useState([])

  useEffect(() => {
    // Fetch snippets when component loads
    getSnippets()
      .then(response => {
        console.log('Snippets received:', response.data)
        setSnippets(response.data.results)
      })
      .catch(err => {
        console.error('Error fetching snippets:', err)
      })}, [])

  const truncateCode = (code, maxLength = 100) => {
    if (code.length <= maxLength) return code;
    return code.substring(0, maxLength) + '...';
  };

  return (
    <>
      <h1>Code Snippets</h1>
      <p>Total Snippets: {snippets.length}</p>
      <div className="snippets-list">
        {snippets.map(snippet => (
          <div key={snippet.id} className="snippet-card">
            <h3>{snippet.title || 'Untitled'}</h3>
            <pre className="snippet-preview">
              {truncateCode(snippet.code)}
            </pre>
            <Link to={`/snippets/${snippet.id}`} className="read-more">
              Read more
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h1>📝 Snippet Manager</h1>
        <UserProfile />
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
