import React, { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Container/Presentational Pattern Implementation (Enhanced)
 * Separating business logic (Container) from presentation (Presentational) components
 */

// ============ CONTAINER COMPONENTS (Business Logic) ============

// Experience List Container
export const ExperienceListContainer = ({ children }) => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    company: '',
    position: '',
    dateRange: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  // Fetch experiences with current filters and pagination
  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });

      const response = await fetch(`/api/admin/experiences?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch experiences');
      }

      const data = await response.json();
      
      setExperiences(data.experiences);
      setPagination(prev => ({
        ...prev,
        total: data.total
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Update experience status
  const updateExperienceStatus = useCallback(async (id, status, reason = '') => {
    try {
      const response = await fetch(`/api/admin/experiences/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedExperience = await response.json();
      
      // Update local state
      setExperiences(prev => 
        prev.map(exp => 
          exp._id === id ? { ...exp, ...updatedExperience } : exp
        )
      );

      return updatedExperience;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Bulk update statuses
  const bulkUpdateStatus = useCallback(async (experienceIds, status, reason = '') => {
    try {
      const response = await fetch('/api/admin/experiences/bulk-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experienceIds, status, reason })
      });

      if (!response.ok) {
        throw new Error('Failed to bulk update');
      }

      // Refresh the list
      await fetchExperiences();
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchExperiences]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterName, filterValue) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: filterValue
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Computed values
  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => {
      if (filters.status !== 'all' && exp.status !== filters.status) return false;
      if (filters.company && !exp.company.toLowerCase().includes(filters.company.toLowerCase())) return false;
      if (filters.position && !exp.position.toLowerCase().includes(filters.position.toLowerCase())) return false;
      return true;
    });
  }, [experiences, filters]);

  const stats = useMemo(() => {
    return {
      total: experiences.length,
      pending: experiences.filter(exp => exp.status === 'pending').length,
      approved: experiences.filter(exp => exp.status === 'approved').length,
      rejected: experiences.filter(exp => exp.status === 'rejected').length
    };
  }, [experiences]);

  // Effects
  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // Pass data and handlers to presentational component
  return children({
    experiences: filteredExperiences,
    loading,
    error,
    filters,
    pagination,
    stats,
    updateExperienceStatus,
    bulkUpdateStatus,
    handleFilterChange,
    handlePageChange,
    refresh: fetchExperiences
  });
};

// Analytics Dashboard Container
export const AnalyticsDashboardContainer = ({ children }) => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState('line');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      
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
  }, [timeRange]);

  const exportData = useCallback(async (format = 'csv') => {
    try {
      const response = await fetch(`/api/admin/analytics/export?format=${format}&timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timeRange}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return children({
    analytics,
    loading,
    error,
    timeRange,
    chartType,
    setTimeRange,
    setChartType,
    exportData,
    refresh: fetchAnalytics
  });
};

// User Management Container
export const UserManagementContainer = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        search: searchQuery,
        role: roleFilter,
        status: statusFilter
      });

      const response = await fetch(`/api/admin/users?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter]);

  const updateUserRole = useCallback(async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const updatedUser = await response.json();
      setUsers(prev => 
        prev.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const toggleUserStatus = useCallback(async (userId, isActive) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      setUsers(prev => 
        prev.map(user => 
          user._id === userId ? { ...user, isActive } : user
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(prev => prev.filter(user => user._id !== userId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && user.isActive) ||
                           (statusFilter === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return children({
    users: filteredUsers,
    loading,
    error,
    searchQuery,
    roleFilter,
    statusFilter,
    setSearchQuery,
    setRoleFilter,
    setStatusFilter,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    refresh: fetchUsers
  });
};

// Settings Management Container
export const SettingsContainer = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  }, []);

  const saveSettings = useCallback(async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setUnsavedChanges(false);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const resetToDefaults = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/settings/defaults', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to reset settings');
      }

      await fetchSettings();
      setUnsavedChanges(false);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  return children({
    settings,
    loading,
    saving,
    error,
    unsavedChanges,
    updateSetting,
    saveSettings,
    resetToDefaults,
    refresh: fetchSettings
  });
};

// Contact Management Container
export const ContactManagementContainer = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    dateRange: ''
  });

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/admin/contacts?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setContacts(data.contacts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateContactStatus = useCallback(async (contactId, status, response = '') => {
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, response })
      });

      if (!res.ok) {
        throw new Error('Failed to update contact status');
      }

      const updatedContact = await res.json();
      setContacts(prev => 
        prev.map(contact => 
          contact._id === contactId ? updatedContact : contact
        )
      );

      return updatedContact;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteContact = useCallback(async (contactId) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      setContacts(prev => prev.filter(contact => contact._id !== contactId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const markAsRead = useCallback(async (contactId) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}/read`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }

      setContacts(prev => 
        prev.map(contact => 
          contact._id === contactId ? { ...contact, isRead: true } : contact
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      if (filters.status !== 'all' && contact.status !== filters.status) return false;
      if (filters.priority !== 'all' && contact.priority !== filters.priority) return false;
      return true;
    });
  }, [contacts, filters]);

  const stats = useMemo(() => {
    return {
      total: contacts.length,
      unread: contacts.filter(c => !c.isRead).length,
      pending: contacts.filter(c => c.status === 'pending').length,
      resolved: contacts.filter(c => c.status === 'resolved').length
    };
  }, [contacts]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return children({
    contacts: filteredContacts,
    loading,
    error,
    filters,
    stats,
    setFilters,
    updateContactStatus,
    deleteContact,
    markAsRead,
    refresh: fetchContacts
  });
};