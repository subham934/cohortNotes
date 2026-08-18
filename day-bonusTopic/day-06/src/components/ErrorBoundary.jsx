import React from 'react'

class ErrorBoundary extends React.Component {
  // Holds error state for this subtree
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // Called during render when a descendant throws.
  // Return updated state so the next render shows the fallback UI.
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  // Called after render when a descendant throws.
  // Use this for logging to an error reporting service.
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info.componentStack)
  }

  // Allow the user to retry after an error
  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-red-100 bg-white dark:bg-gray-900 dark:border-red-900 p-8 shadow-sm text-center">
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-5">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            {/* Heading */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Something went wrong
            </h2>

            {/* Error message */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>

            {/* Retry button */}
            <button
              onClick={this.handleReset}
              className="w-full h-10 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    // No error — render children normally
    return this.props.children
  }
}

export default ErrorBoundary