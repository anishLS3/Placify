import React, { Component } from 'react';

/**
 * Higher-Order Component (HOC) Pattern Implementation
 * Reusing component logic and enhancing components with additional functionality
 */

// HOC for authentication
export const withAuth = (WrappedComponent) => {
  return class WithAuth extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isAuthenticated: false,
        user: null,
        loading: true
      };
    }

    async componentDidMount() {
      await this.checkAuthStatus();
    }

    checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.setState({ loading: false, isAuthenticated: false });
          return;
        }

        const response = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const userData = await response.json();
          this.setState({
            isAuthenticated: true,
            user: userData.user,
            loading: false
          });
        } else {
          localStorage.removeItem('token');
          this.setState({ loading: false, isAuthenticated: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        this.setState({ loading: false, isAuthenticated: false });
      }
    };

    render() {
      const { loading, isAuthenticated, user } = this.state;

      if (loading) {
        return (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}>
            Loading...
          </div>
        );
      }

      if (!isAuthenticated) {
        return (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column'
          }}>
            <h2>Authentication Required</h2>
            <p>Please log in to access this page.</p>
          </div>
        );
      }

      return (
        <WrappedComponent
          {...this.props}
          user={user}
          isAuthenticated={isAuthenticated}
          onLogout={() => {
            localStorage.removeItem('token');
            this.setState({ isAuthenticated: false, user: null });
          }}
        />
      );
    }
  };
};

// HOC for loading states
export const withLoading = (WrappedComponent) => {
  return class WithLoading extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        error: null
      };
    }

    setLoading = (loading) => {
      this.setState({ loading });
    };

    setError = (error) => {
      this.setState({ error });
    };

    clearError = () => {
      this.setState({ error: null });
    };

    render() {
      const { loading, error } = this.state;

      return (
        <WrappedComponent
          {...this.props}
          loading={loading}
          error={error}
          setLoading={this.setLoading}
          setError={this.setError}
          clearError={this.clearError}
        />
      );
    }
  };
};

// HOC for analytics tracking
export const withAnalytics = (eventName, additionalProps = {}) => (WrappedComponent) => {
  return class WithAnalytics extends Component {
    componentDidMount() {
      this.trackEvent('component_mount');
    }

    componentWillUnmount() {
      this.trackEvent('component_unmount');
    }

    trackEvent = (action, customProps = {}) => {
      try {
        // Analytics tracking logic
        const eventData = {
          event: eventName,
          action,
          component: WrappedComponent.name || 'Unknown',
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
          userAgent: navigator.userAgent,
          ...additionalProps,
          ...customProps
        };

        // Send to analytics service
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        }).catch(error => {
          console.warn('Analytics tracking failed:', error);
        });
      } catch (error) {
        console.warn('Analytics error:', error);
      }
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          trackEvent={this.trackEvent}
        />
      );
    }
  };
};

// HOC for data fetching
export const withDataFetcher = (fetchFunction, propName = 'data') => (WrappedComponent) => {
  return class WithDataFetcher extends Component {
    constructor(props) {
      super(props);
      this.state = {
        [propName]: null,
        loading: true,
        error: null,
        refreshing: false
      };
    }

    async componentDidMount() {
      await this.fetchData();
    }

    fetchData = async (force = false) => {
      if (force) {
        this.setState({ refreshing: true });
      } else {
        this.setState({ loading: true });
      }
      
      this.setState({ error: null });

      try {
        const data = await fetchFunction(this.props);
        this.setState({ 
          [propName]: data,
          loading: false,
          refreshing: false
        });
      } catch (error) {
        this.setState({ 
          error: error.message,
          loading: false,
          refreshing: false
        });
      }
    };

    refresh = () => {
      this.fetchData(true);
    };

    render() {
      const { loading, error, refreshing } = this.state;
      const data = this.state[propName];
      const dynamicProps = { [propName]: data };

      return (
        <WrappedComponent
          {...this.props}
          {...dynamicProps}
          loading={loading}
          error={error}
          refreshing={refreshing}
          refresh={this.refresh}
        />
      );
    }
  };
};

// HOC for form validation
export const withFormValidation = (validationRules) => (WrappedComponent) => {
  return class WithFormValidation extends Component {
    constructor(props) {
      super(props);
      this.state = {
        values: {},
        errors: {},
        touched: {},
        isValid: false
      };
    }

    validateField = (fieldName, value) => {
      const rules = validationRules[fieldName];
      if (!rules) return null;

      if (rules.required && (!value || value.toString().trim() === '')) {
        return rules.messages?.required || `${fieldName} is required`;
      }

      if (rules.minLength && value && value.length < rules.minLength) {
        return rules.messages?.minLength || `${fieldName} must be at least ${rules.minLength} characters`;
      }

      if (rules.pattern && value && !rules.pattern.test(value)) {
        return rules.messages?.pattern || `${fieldName} format is invalid`;
      }

      if (rules.custom && value) {
        return rules.custom(value, this.state.values);
      }

      return null;
    };

    validateForm = () => {
      const errors = {};
      let isValid = true;

      Object.keys(validationRules).forEach(fieldName => {
        const value = this.state.values[fieldName];
        const error = this.validateField(fieldName, value);
        
        if (error) {
          errors[fieldName] = error;
          isValid = false;
        }
      });

      this.setState({ errors, isValid });
      return isValid;
    };

    handleFieldChange = (fieldName, value) => {
      this.setState(prevState => {
        const newValues = { ...prevState.values, [fieldName]: value };
        const fieldError = this.validateField(fieldName, value);
        const newErrors = { ...prevState.errors };
        
        if (fieldError) {
          newErrors[fieldName] = fieldError;
        } else {
          delete newErrors[fieldName];
        }

        const isValid = Object.keys(newErrors).length === 0;

        return {
          values: newValues,
          errors: newErrors,
          isValid
        };
      });
    };

    handleFieldBlur = (fieldName) => {
      this.setState(prevState => ({
        touched: { ...prevState.touched, [fieldName]: true }
      }));
    };

    render() {
      const { values, errors, touched, isValid } = this.state;

      return (
        <WrappedComponent
          {...this.props}
          formValues={values}
          formErrors={errors}
          formTouched={touched}
          formIsValid={isValid}
          onFieldChange={this.handleFieldChange}
          onFieldBlur={this.handleFieldBlur}
          validateForm={this.validateForm}
        />
      );
    }
  };
};

// HOC for responsive design
export const withResponsive = (WrappedComponent) => {
  return class WithResponsive extends Component {
    constructor(props) {
      super(props);
      this.state = {
        screenSize: this.getCurrentScreenSize(),
        isMobile: false,
        isTablet: false,
        isDesktop: false
      };
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
      this.updateDeviceType();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    getCurrentScreenSize = () => {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };

    updateDeviceType = () => {
      const { width } = this.state.screenSize;
      
      this.setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    handleResize = () => {
      const screenSize = this.getCurrentScreenSize();
      this.setState({ screenSize }, this.updateDeviceType);
    };

    render() {
      const { screenSize, isMobile, isTablet, isDesktop } = this.state;

      return (
        <WrappedComponent
          {...this.props}
          screenSize={screenSize}
          isMobile={isMobile}
          isTablet={isTablet}
          isDesktop={isDesktop}
          deviceType={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
        />
      );
    }
  };
};

// HOC for error boundary
export const withErrorBoundary = (fallbackComponent = null) => (WrappedComponent) => {
  return class WithErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hasError: false,
        error: null,
        errorInfo: null
      };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      this.setState({
        error,
        errorInfo
      });

      // Log error to service
      console.error('Error boundary caught an error:', error, errorInfo);
      
      // Send to error tracking service
      fetch('/api/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.toString(),
          errorInfo: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
          userAgent: navigator.userAgent
        })
      }).catch(err => {
        console.warn('Error logging failed:', err);
      });
    }

    render() {
      if (this.state.hasError) {
        if (fallbackComponent) {
          return React.createElement(fallbackComponent, {
            error: this.state.error,
            errorInfo: this.state.errorInfo,
            retry: () => this.setState({ hasError: false, error: null, errorInfo: null })
          });
        }

        return (
          <div style={{
            padding: '20px',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            backgroundColor: '#fff5f5',
            color: '#c53030',
            textAlign: 'center'
          }}>
            <h2>Something went wrong</h2>
            <p>We apologize for the inconvenience. The error has been logged.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              style={{
                padding: '10px 20px',
                backgroundColor: '#c53030',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Try Again
            </button>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};