// src/ErrorBoundary.jsx  <-- CHANGE THIS LINE
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">¡Algo salió mal!</h1>
          <p className="text-lg text-gray-700 mb-4">
            Parece que encontramos un problema inesperado. Por favor, intenta de nuevo más tarde o contacta a soporte.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-sm text-gray-500 mt-4 p-2 bg-red-100 rounded">
              <summary>Detalles del error</summary>
              <pre className="text-left whitespace-pre-wrap break-words">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition duration-300 ease-in-out"
          >
            Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;