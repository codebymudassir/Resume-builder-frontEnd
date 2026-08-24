import React, { useEffect, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import api from './config/api.js'
import { login, setLoading } from './app/features/authSlice.js'
import PageNotFound from './pages/PageNotFound.jsx'

// ✅ Lazy load for initial bundle split
const Home = React.lazy(() => import('./pages/Home.jsx'))
const Layout = React.lazy(() => import('./pages/Layout.jsx'))
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'))
const ResumeBuilder = React.lazy(() => import('./pages/ResumeBuilder.jsx'))
const ResumeAnalyzer = React.lazy(() => import('./components/ResumeAnalyzer.jsx'))
const Preview = React.lazy(() => import('./pages/Preview.jsx'))
const Login = React.lazy(() => import('./pages/Login.jsx'))
const InterviewAgent = React.lazy(() => import('./components/InterviewAgent.jsx'))

// ✅ All route chunks listed here — add any new ones too
const prefetchRoutes = () => {
  import('./pages/Dashboard.jsx')
  import('./pages/Layout.jsx')
  import('./pages/ResumeBuilder.jsx')
  import('./pages/Preview.jsx')
  import('./pages/Login.jsx')
  import('./components/ResumeAnalyzer.jsx')
  import('./components/InterviewAgent.jsx')
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent" />
  </div>
)

const App = () => {
  const dispatch = useDispatch()

  const getUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (data.user) dispatch(login({ user: data.user, token }))
      }
    } catch (error) {
      console.log('Error fetching user data:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
      }
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    getUserData()

    // ✅ After the current route renders and the browser goes idle,
    // silently prefetch every other route chunk in the background.
    // By the time the user clicks Login or Dashboard, the JS is already cached.
    if ('requestIdleCallback' in window) {
      requestIdleCallback(prefetchRoutes)
    } else {
      // Safari fallback — small delay so it doesn't compete with initial paint
      setTimeout(prefetchRoutes, 1000)
    }
  }, [])

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='app' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='builder/:resumeId' element={<ResumeBuilder />} />
          </Route>
          <Route path='view/:resumeId' element={<Preview />} />
          <Route path='/analyze-resume' element={<ResumeAnalyzer />} />
          <Route path='/interview-agent' element={<InterviewAgent />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App