import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to an error reporting service in production
    if (import.meta.env.PROD) {
      console.error('Error caught by boundary:', error, errorInfo);
      // You can send this to a logging service like Sentry
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              textAlign: 'center',
            }}
          >
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <ErrorOutlineIcon 
                sx={{ fontSize: 80, color: 'error.main', mb: 2 }} 
              />
              <Typography variant="h4" gutterBottom color="error">
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                We're sorry for the inconvenience. Please try refreshing the page or go back to the home page.
              </Typography>
              
              {import.meta.env.DEV && this.state.error && (
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    bgcolor: 'grey.100',
                    textAlign: 'left',
                    maxHeight: 200,
                    overflow: 'auto'
                  }}
                >
                  <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Paper>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  onClick={this.handleReload}
                  color="primary"
                >
                  Refresh Page
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={this.handleGoHome}
                >
                  Go to Home
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
