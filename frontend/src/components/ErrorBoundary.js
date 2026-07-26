import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.iconCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FB7185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />
              </svg>
            </div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.message}>
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button onClick={this.handleRetry} className="bb-btn bb-btn-primary" style={{ marginTop: "1rem" }}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    textAlign: "center",
    maxWidth: "420px",
    width: "100%",
    padding: "2.5rem",
    background: "rgba(17, 24, 39, 0.85)",
    border: "1px solid rgba(251, 113, 133, 0.25)",
    borderRadius: "16px",
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "rgba(251, 113, 133, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: "0.5rem",
  },
  message: {
    fontSize: "0.9rem",
    color: "#94A3B8",
    lineHeight: "1.5",
  },
};
