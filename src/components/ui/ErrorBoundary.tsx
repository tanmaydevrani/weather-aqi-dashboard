'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: '#ef444410', border: '1px solid #ef444425' }}
        >
          <div className="text-3xl mb-3">⚠️</div>
          <h3 className="font-semibold text-base mb-1 text-red-400">Something went wrong</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-3)' }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors text-red-400"
            style={{ background: '#ef444420' }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
