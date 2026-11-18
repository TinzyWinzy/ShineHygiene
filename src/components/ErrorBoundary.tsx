import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Phase 2 replaces this with structured error reporting.
    console.error('[shine] uncaught render error', error, info.componentStack)
  }

  private reload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-dvh bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Something went wrong</h1>
          <p className="text-sm text-gray-600 mt-2">
            The quote screen hit an unexpected error. Any quote you saved is still on this device.
          </p>
          <button
            onClick={this.reload}
            className="mt-5 w-full py-3 rounded-xl bg-brand-ink text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            Reload the page
          </button>
          <a
            href="https://wa.me/263774449064"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-brand-ink hover:text-brand-dark underline underline-offset-2"
          >
            Or message us on WhatsApp
          </a>
        </div>
      </div>
    )
  }
}
