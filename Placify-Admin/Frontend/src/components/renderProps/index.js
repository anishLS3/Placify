import React from 'react';

/**
 * Render Props Pattern Implementation
 * Sharing code between components using props whose values are functions
 */

// Data fetcher with render props
export class DataFetcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      error: null
    };
  }

  async componentDidMount() {
    await this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    // Refetch if URL or dependencies change
    if (prevProps.url !== this.props.url || 
        JSON.stringify(prevProps.dependencies) !== JSON.stringify(this.props.dependencies)) {
      await this.fetchData();
    }
  }

  fetchData = async () => {
    const { url, options = {}, transform } = this.props;
    
    this.setState({ loading: true, error: null });

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data = await response.json();
      
      // Apply transformation if provided
      if (transform && typeof transform === 'function') {
        data = transform(data);
      }

      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  refetch = () => {
    this.fetchData();
  };

  render() {
    const { data, loading, error } = this.state;
    const { children, render } = this.props;

    const renderProps = {
      data,
      loading,
      error,
      refetch: this.refetch
    };

    // Support both children as function and render prop
    if (typeof children === 'function') {
      return children(renderProps);
    }

    if (typeof render === 'function') {
      return render(renderProps);
    }

    return null;
  }
}

// Form state manager with render props
export class FormState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: props.initialValues || {},
      errors: {},
      touched: {},
      isSubmitting: false
    };
  }

  setValue = (name, value) => {
    this.setState(prevState => ({
      values: { ...prevState.values, [name]: value },
      errors: { ...prevState.errors, [name]: null } // Clear error on change
    }));
  };

  setError = (name, error) => {
    this.setState(prevState => ({
      errors: { ...prevState.errors, [name]: error }
    }));
  };

  setTouched = (name, touched = true) => {
    this.setState(prevState => ({
      touched: { ...prevState.touched, [name]: touched }
    }));
  };

  validateField = (name, value) => {
    const { validation } = this.props;
    if (!validation || !validation[name]) return null;

    const rules = validation[name];

    if (rules.required && (!value || value.toString().trim() === '')) {
      return rules.message || `${name} is required`;
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return `${name} must be at least ${rules.minLength} characters`;
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.message || `Invalid ${name} format`;
    }

    if (rules.custom && typeof rules.custom === 'function') {
      return rules.custom(value, this.state.values);
    }

    return null;
  };

  handleFieldChange = (name) => (event) => {
    const value = event.target.value;
    this.setValue(name, value);
    
    // Validate on change if field was touched
    if (this.state.touched[name]) {
      const error = this.validateField(name, value);
      if (error) {
        this.setError(name, error);
      }
    }
  };

  handleFieldBlur = (name) => () => {
    this.setTouched(name, true);
    const value = this.state.values[name];
    const error = this.validateField(name, value);
    if (error) {
      this.setError(name, error);
    }
  };

  handleSubmit = (onSubmit) => async (event) => {
    event.preventDefault();
    
    // Validate all fields
    const errors = {};
    let hasErrors = false;

    Object.keys(this.state.values).forEach(name => {
      const value = this.state.values[name];
      const error = this.validateField(name, value);
      if (error) {
        errors[name] = error;
        hasErrors = true;
      }
    });

    // Also check for required fields not in values
    if (this.props.validation) {
      Object.keys(this.props.validation).forEach(name => {
        if (!this.state.values.hasOwnProperty(name)) {
          const error = this.validateField(name, '');
          if (error) {
            errors[name] = error;
            hasErrors = true;
          }
        }
      });
    }

    this.setState({ errors });

    if (hasErrors) return;

    this.setState({ isSubmitting: true });

    try {
      if (onSubmit && typeof onSubmit === 'function') {
        await onSubmit(this.state.values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  reset = () => {
    this.setState({
      values: this.props.initialValues || {},
      errors: {},
      touched: {},
      isSubmitting: false
    });
  };

  render() {
    const { values, errors, touched, isSubmitting } = this.state;
    const { children, render } = this.props;

    const renderProps = {
      values,
      errors,
      touched,
      isSubmitting,
      setValue: this.setValue,
      setError: this.setError,
      setTouched: this.setTouched,
      handleFieldChange: this.handleFieldChange,
      handleFieldBlur: this.handleFieldBlur,
      handleSubmit: this.handleSubmit,
      reset: this.reset,
      isValid: Object.keys(errors).length === 0
    };

    if (typeof children === 'function') {
      return children(renderProps);
    }

    if (typeof render === 'function') {
      return render(renderProps);
    }

    return null;
  }
}

// Modal state manager with render props
export class ModalState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.defaultOpen || false,
      data: null
    };
  }

  open = (data = null) => {
    this.setState({ isOpen: true, data });
  };

  close = () => {
    this.setState({ isOpen: false, data: null });
  };

  toggle = () => {
    this.setState(prevState => ({ 
      isOpen: !prevState.isOpen,
      data: prevState.isOpen ? null : prevState.data
    }));
  };

  render() {
    const { isOpen, data } = this.state;
    const { children, render } = this.props;

    const renderProps = {
      isOpen,
      data,
      open: this.open,
      close: this.close,
      toggle: this.toggle
    };

    if (typeof children === 'function') {
      return children(renderProps);
    }

    if (typeof render === 'function') {
      return render(renderProps);
    }

    return null;
  }
}

// Pagination with render props
export class PaginationState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: props.initialPage || 1,
      pageSize: props.pageSize || 10,
      totalItems: props.totalItems || 0
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.totalItems !== this.props.totalItems) {
      this.setState({ totalItems: this.props.totalItems });
    }
  }

  get totalPages() {
    return Math.ceil(this.state.totalItems / this.state.pageSize);
  }

  get hasNext() {
    return this.state.currentPage < this.totalPages;
  }

  get hasPrev() {
    return this.state.currentPage > 1;
  }

  get startIndex() {
    return (this.state.currentPage - 1) * this.state.pageSize;
  }

  get endIndex() {
    return Math.min(this.startIndex + this.state.pageSize, this.state.totalItems);
  }

  goToPage = (page) => {
    if (page >= 1 && page <= this.totalPages) {
      this.setState({ currentPage: page });
      if (this.props.onPageChange) {
        this.props.onPageChange(page, this.state.pageSize);
      }
    }
  };

  nextPage = () => {
    if (this.hasNext) {
      this.goToPage(this.state.currentPage + 1);
    }
  };

  prevPage = () => {
    if (this.hasPrev) {
      this.goToPage(this.state.currentPage - 1);
    }
  };

  setPageSize = (newPageSize) => {
    const newTotalPages = Math.ceil(this.state.totalItems / newPageSize);
    const newCurrentPage = Math.min(this.state.currentPage, newTotalPages) || 1;
    
    this.setState({ 
      pageSize: newPageSize,
      currentPage: newCurrentPage
    });

    if (this.props.onPageChange) {
      this.props.onPageChange(newCurrentPage, newPageSize);
    }
  };

  render() {
    const { currentPage, pageSize, totalItems } = this.state;
    const { children, render } = this.props;

    const renderProps = {
      currentPage,
      pageSize,
      totalItems,
      totalPages: this.totalPages,
      hasNext: this.hasNext,
      hasPrev: this.hasPrev,
      startIndex: this.startIndex,
      endIndex: this.endIndex,
      goToPage: this.goToPage,
      nextPage: this.nextPage,
      prevPage: this.prevPage,
      setPageSize: this.setPageSize
    };

    if (typeof children === 'function') {
      return children(renderProps);
    }

    if (typeof render === 'function') {
      return render(renderProps);
    }

    return null;
  }
}

// Search state manager with render props
export class SearchState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.initialQuery || '',
      filters: props.initialFilters || {},
      results: [],
      loading: false,
      error: null,
      totalResults: 0
    };
    this.searchTimeoutId = null;
  }

  setQuery = (query) => {
    this.setState({ query });
    
    // Debounce search
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }
    
    this.searchTimeoutId = setTimeout(() => {
      this.performSearch(query, this.state.filters);
    }, this.props.debounceMs || 300);
  };

  setFilter = (filterName, filterValue) => {
    const newFilters = { 
      ...this.state.filters, 
      [filterName]: filterValue 
    };
    this.setState({ filters: newFilters });
    this.performSearch(this.state.query, newFilters);
  };

  clearFilters = () => {
    this.setState({ filters: {} });
    this.performSearch(this.state.query, {});
  };

  performSearch = async (query, filters) => {
    const { onSearch } = this.props;
    
    if (!onSearch || typeof onSearch !== 'function') {
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const result = await onSearch(query, filters);
      this.setState({
        results: result.results || [],
        totalResults: result.total || 0,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false,
        results: []
      });
    }
  };

  reset = () => {
    this.setState({
      query: this.props.initialQuery || '',
      filters: this.props.initialFilters || {},
      results: [],
      loading: false,
      error: null,
      totalResults: 0
    });
  };

  render() {
    const { query, filters, results, loading, error, totalResults } = this.state;
    const { children, render } = this.props;

    const renderProps = {
      query,
      filters,
      results,
      loading,
      error,
      totalResults,
      setQuery: this.setQuery,
      setFilter: this.setFilter,
      clearFilters: this.clearFilters,
      search: this.performSearch,
      reset: this.reset
    };

    if (typeof children === 'function') {
      return children(renderProps);
    }

    if (typeof render === 'function') {
      return render(renderProps);
    }

    return null;
  }
}