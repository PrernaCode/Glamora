import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="text-6xl mb-4">💥</div>
            <h1 className="text-3xl font-bold mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                className="block w-full border-2 border-black text-black py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Go to Home
              </Link>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left bg-red-50 p-4 rounded">
                <summary className="cursor-pointer font-semibold text-red-800">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 text-sm text-red-700 overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;