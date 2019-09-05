import React, { ErrorInfo } from 'react';

interface ErrorBoundaryState {
    error?: Error,
    info?: ErrorInfo
}

class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
    constructor(props: {}) {
        super(props);
        this.state = { };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      this.setState({error, info: errorInfo});
    }

    render() {
      if (this.state.error) {
        // You can render any custom fallback UI
        const { error, info } = this.state
        return <div>
            <h1>
            {error.message}
            </h1>
            <pre>
                {error.stack}
            </pre>
            <pre>
                {info && info.componentStack}
            </pre>
        </div>;
      }
      return this.props.children;
    }
}

export default ErrorBoundary