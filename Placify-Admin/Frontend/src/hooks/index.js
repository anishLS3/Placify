import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AppProvider';

/**
 * Hook Pattern Implementation for Custom Reusable Stateful Logic
 * Sharing stateful logic between components
 */

// Custom hook for experiences management
export const useExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const fetchExperiences = useCallback(async (newFilters = {}, newPagination = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        ...newFilters,
        page: newPagination.page || pagination.page,
        limit: newPagination.limit || pagination.limit
      });

      const response = await fetch(`/api/experiences?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch experiences');
      }

      const data = await response.json();
      setExperiences(data.experiences);
      setPagination(prev => ({
        ...prev,
        ...newPagination,
        total: data.total
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  const updateExperienceStatus = useCallback(async (id, status, reason) => {
    try {
      const response = await fetch(`/api/experiences/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setExperiences(prev => 
        prev.map(exp => 
          exp._id === id 
            ? { ...exp, status, moderationNotes: reason }
            : exp
        )
      );

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const bulkUpdateStatus = useCallback(async (experienceIds, status, reason) => {
    try {
      const response = await fetch('/api/experiences/bulk-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experienceIds, status, reason })
      });

      if (!response.ok) {
        throw new Error('Failed to bulk update');
      }

      // Refresh experiences
      await fetchExperiences();
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchExperiences]);

  return {
    experiences,
    loading,
    error,
    filters,
    pagination,
    fetchExperiences,
    updateExperienceStatus,
    bulkUpdateStatus,
    setFilters,
    setPagination
  };
};

// Custom hook for analytics data
export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (timeRange = '30d') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analytics/overview?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrends = useCallback(async (type = 'experiences', timeRange = '30d') => {
    try {
      const response = await fetch(`/api/analytics/trends?type=${type}&timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trends');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    fetchTrends
  };
};

// Custom hook for API calls with loading states
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const apiCall = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API call failed');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { apiCall, loading, error };
};

// Custom hook for form management
export const useForm = (initialValues = {}, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const validate = useCallback(() => {
    if (!validationSchema) return {};

    const validationErrors = {};
    Object.keys(validationSchema).forEach(field => {
      const rules = validationSchema[field];
      const value = values[field];

      if (rules.required && (!value || value.toString().trim() === '')) {
        validationErrors[field] = rules.message || `${field} is required`;
      } else if (rules.minLength && value && value.length < rules.minLength) {
        validationErrors[field] = rules.message || `${field} must be at least ${rules.minLength} characters`;
      } else if (rules.pattern && value && !rules.pattern.test(value)) {
        validationErrors[field] = rules.message || `${field} format is invalid`;
      } else if (rules.custom && value) {
        const customError = rules.custom(value, values);
        if (customError) {
          validationErrors[field] = customError;
        }
      }
    });

    setErrors(validationErrors);
    return validationErrors;
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validate,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Custom hook for pagination
export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNext) setPage(prev => prev + 1);
  }, [hasNext]);

  const prevPage = useCallback(() => {
    if (hasPrev) setPage(prev => prev - 1);
  }, [hasPrev]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    setPage,
    setLimit,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    reset
  };
};

// Custom hook for local storage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage:`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};