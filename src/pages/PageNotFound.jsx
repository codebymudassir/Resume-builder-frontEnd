import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa'

const PageNotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.errorCode}>404</div>
        <h1 style={styles.title}>Page Not Found</h1>
        <p style={styles.description}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={styles.actions}>
          <Link to="/" style={styles.primaryButton}>
            <FaHome style={styles.icon} />
            Go to Home
          </Link>
        </div>
      </div>
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Need help? <Link to="/contact" style={styles.link}>Contact Support</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    padding: '20px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  errorCode: {
    fontSize: '120px',
    fontWeight: 'bold',
    color: '#22c55e',
    lineHeight: 1,
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(34, 197, 94, 0.2)',
  },
  title: {
    fontSize: '32px',
    color: '#166534',
    marginBottom: '16px',
    fontWeight: '600',
  },
  description: {
    fontSize: '18px',
    color: '#15803d',
    marginBottom: '32px',
    lineHeight: 1.6,
  },
  actions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    backgroundColor: '#22c55e',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(34, 197, 94, 0.3)',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    backgroundColor: 'white',
    color: '#22c55e',
    border: '2px solid #22c55e',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  icon: {
    fontSize: '16px',
  },
  footer: {
    marginTop: '48px',
    textAlign: 'center',
  },
  footerText: {
    color: '#15803d',
    fontSize: '14px',
  },
  link: {
    color: '#22c55e',
    textDecoration: 'none',
    fontWeight: '500',
  },
}

export default PageNotFound
