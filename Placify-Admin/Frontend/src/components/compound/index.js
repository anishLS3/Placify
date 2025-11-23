import React, { memo, forwardRef, useRef, useImperativeHandle, useCallback } from 'react';

/**
 * Compound Components Pattern Implementation
 * Components that work together to form a complete UI pattern
 */

// ============ MODAL COMPOUND COMPONENT ============

const ModalContext = React.createContext();

// Main Modal Component
export const Modal = ({ children, isOpen, onClose, size = "md" }) => {
  if (!isOpen) return null;

  const contextValue = {
    onClose,
    size
  };

  return (
    <ModalContext.Provider value={contextValue}>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxHeight: '90vh',
            overflow: 'auto',
            width: size === 'sm' ? '400px' : size === 'lg' ? '800px' : '600px',
            maxWidth: '90vw'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

// Modal Header
Modal.Header = ({ children, showCloseButton = true }) => {
  const { onClose } = React.useContext(ModalContext);
  
  return (
    <div style={{
      padding: '20px 24px 16px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ fontSize: '18px', fontWeight: '600' }}>
        {children}
      </div>
      {showCloseButton && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

// Modal Body
Modal.Body = ({ children }) => (
  <div style={{ padding: '20px 24px' }}>
    {children}
  </div>
);

// Modal Footer
Modal.Footer = ({ children }) => (
  <div style={{
    padding: '16px 24px 20px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  }}>
    {children}
  </div>
);

// ============ TABS COMPOUND COMPONENT ============

const TabsContext = React.createContext();

export const Tabs = ({ children, defaultIndex = 0, onChange }) => {
  const [activeIndex, setActiveIndex] = React.useState(defaultIndex);

  const handleTabChange = useCallback((index) => {
    setActiveIndex(index);
    if (onChange) onChange(index);
  }, [onChange]);

  const contextValue = {
    activeIndex,
    onTabChange: handleTabChange
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

// Tab List
Tabs.List = ({ children }) => (
  <div style={{
    display: 'flex',
    borderBottom: '2px solid #e2e8f0',
    marginBottom: '20px'
  }}>
    {React.Children.map(children, (child, index) => 
      React.cloneElement(child, { index })
    )}
  </div>
);

// Individual Tab
Tabs.Tab = ({ children, index }) => {
  const { activeIndex, onTabChange } = React.useContext(TabsContext);
  const isActive = activeIndex === index;

  return (
    <button
      onClick={() => onTabChange(index)}
      style={{
        padding: '12px 16px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        borderBottom: isActive ? '2px solid #3182ce' : '2px solid transparent',
        color: isActive ? '#3182ce' : '#718096',
        fontWeight: isActive ? '600' : '400',
        fontSize: '14px'
      }}
    >
      {children}
    </button>
  );
};

// Tab Panels Container
Tabs.Panels = ({ children }) => {
  const { activeIndex } = React.useContext(TabsContext);
  
  return (
    <div>
      {React.Children.map(children, (child, index) => 
        index === activeIndex ? child : null
      )}
    </div>
  );
};

// Individual Tab Panel
Tabs.Panel = ({ children }) => <div>{children}</div>;

// ============ ACCORDION COMPOUND COMPONENT ============

const AccordionContext = React.createContext();

export const Accordion = ({ children, allowMultiple = false, defaultIndex = [] }) => {
  const [openPanels, setOpenPanels] = React.useState(
    Array.isArray(defaultIndex) ? defaultIndex : [defaultIndex]
  );

  const togglePanel = useCallback((index) => {
    setOpenPanels(prev => {
      if (allowMultiple) {
        return prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index];
      } else {
        return prev.includes(index) ? [] : [index];
      }
    });
  }, [allowMultiple]);

  const contextValue = {
    openPanels,
    togglePanel
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        {React.Children.map(children, (child, index) => 
          React.cloneElement(child, { index })
        )}
      </div>
    </AccordionContext.Provider>
  );
};

// Accordion Item
Accordion.Item = ({ children, index }) => {
  const { openPanels } = React.useContext(AccordionContext);
  const isOpen = openPanels.includes(index);

  return (
    <div style={{ 
      borderBottom: '1px solid #e2e8f0',
      ':last-child': { borderBottom: 'none' }
    }}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { index, isOpen })
      )}
    </div>
  );
};

// Accordion Button
Accordion.Button = ({ children, index }) => {
  const { togglePanel } = React.useContext(AccordionContext);

  return (
    <button
      onClick={() => togglePanel(index)}
      style={{
        width: '100%',
        padding: '16px 20px',
        border: 'none',
        background: '#f7fafc',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {children}
    </button>
  );
};

// Accordion Panel
Accordion.Panel = ({ children, isOpen }) => (
  <div style={{
    padding: isOpen ? '16px 20px' : '0 20px',
    maxHeight: isOpen ? '1000px' : '0',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    backgroundColor: 'white'
  }}>
    {children}
  </div>
);

// ============ CARD COMPOUND COMPONENT ============

export const Card = ({ children, variant = "elevated", size = "md" }) => {
  const baseStyles = {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const variantStyles = {
    elevated: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    outlined: {
      border: '1px solid #e2e8f0'
    },
    filled: {
      backgroundColor: '#f7fafc'
    }
  };

  const sizeStyles = {
    sm: { padding: '12px' },
    md: { padding: '20px' },
    lg: { padding: '24px' }
  };

  return (
    <div style={{
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size]
    }}>
      {children}
    </div>
  );
};

// Card Header
Card.Header = ({ children, actions }) => (
  <div style={{
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}>
    <div style={{ fontSize: '18px', fontWeight: '600' }}>
      {children}
    </div>
    {actions && <div>{actions}</div>}
  </div>
);

// Card Body
Card.Body = ({ children }) => (
  <div style={{ marginBottom: '16px' }}>
    {children}
  </div>
);

// Card Footer
Card.Footer = ({ children }) => (
  <div style={{
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  }}>
    {children}
  </div>
);

// ============ FORM COMPOUND COMPONENT ============

const FormContext = React.createContext();

export const Form = ({ children, onSubmit, validation = {} }) => {
  const [values, setValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validateField = useCallback((name, value) => {
    const rules = validation[name];
    if (!rules) return '';

    if (rules.required && (!value || value.toString().trim() === '')) {
      return rules.message || `${name} is required`;
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return `${name} must be at least ${rules.minLength} characters`;
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.message || `Invalid ${name} format`;
    }

    return '';
  }, [validation]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(validation).forEach(name => {
      const value = values[name] || '';
      const error = validateField(name, value);
      if (error) newErrors[name] = error;
    });

    setErrors(newErrors);

    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0 && onSubmit) {
      onSubmit(values);
    }
  }, [values, validation, validateField, onSubmit]);

  const contextValue = {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

// Form Field
Form.Field = ({ children, name, label }) => {
  const { errors, touched } = React.useContext(FormContext);
  const hasError = touched[name] && errors[name];

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label 
          style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '14px', 
            fontWeight: '500' 
          }}
        >
          {label}
        </label>
      )}
      {React.cloneElement(children, { name })}
      {hasError && (
        <div style={{ 
          color: '#e53e3e', 
          fontSize: '12px', 
          marginTop: '4px' 
        }}>
          {errors[name]}
        </div>
      )}
    </div>
  );
};

// Form Input
Form.Input = forwardRef(({ name, type = "text", ...props }, ref) => {
  const { values, setValue, setFieldTouched, validateField } = React.useContext(FormContext);
  const inputRef = useRef();

  useImperativeHandle(ref, () => inputRef.current);

  const handleChange = (e) => {
    setValue(name, e.target.value);
  };

  const handleBlur = () => {
    setFieldTouched(name);
    const error = validateField(name, values[name] || '');
    // Error is handled by the Form.Field component
  };

  return (
    <input
      ref={inputRef}
      type={type}
      value={values[name] || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      style={{
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        fontSize: '14px'
      }}
      {...props}
    />
  );
});

// Form Textarea
Form.Textarea = ({ name, ...props }) => {
  const { values, setValue, setFieldTouched } = React.useContext(FormContext);

  return (
    <textarea
      value={values[name] || ''}
      onChange={(e) => setValue(name, e.target.value)}
      onBlur={() => setFieldTouched(name)}
      style={{
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        fontSize: '14px',
        minHeight: '80px',
        resize: 'vertical'
      }}
      {...props}
    />
  );
};

// Form Select
Form.Select = ({ name, children, ...props }) => {
  const { values, setValue, setFieldTouched } = React.useContext(FormContext);

  return (
    <select
      value={values[name] || ''}
      onChange={(e) => setValue(name, e.target.value)}
      onBlur={() => setFieldTouched(name)}
      style={{
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        fontSize: '14px'
      }}
      {...props}
    >
      {children}
    </select>
  );
};

// Form Submit Button
Form.Submit = ({ children, ...props }) => (
  <button
    type="submit"
    style={{
      padding: '8px 16px',
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer'
    }}
    {...props}
  >
    {children}
  </button>
);

// ============ TABLE COMPOUND COMPONENT ============

export const Table = ({ children, striped = false, hoverable = false }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px'
    }}>
      {children}
    </table>
  </div>
);

// Table Header
Table.Header = ({ children }) => (
  <thead style={{ backgroundColor: '#f7fafc' }}>
    {children}
  </thead>
);

// Table Body
Table.Body = ({ children }) => (
  <tbody>
    {children}
  </tbody>
);

// Table Row
Table.Row = ({ children, onClick }) => (
  <tr
    onClick={onClick}
    style={{
      borderBottom: '1px solid #e2e8f0',
      cursor: onClick ? 'pointer' : 'default'
    }}
  >
    {children}
  </tr>
);

// Table Header Cell
Table.HeaderCell = ({ children, sortable, onSort, sortDirection }) => (
  <th
    onClick={sortable ? onSort : undefined}
    style={{
      padding: '12px 16px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#4a5568',
      cursor: sortable ? 'pointer' : 'default'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {children}
      {sortable && (
        <span style={{ fontSize: '10px' }}>
          {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : '⇅'}
        </span>
      )}
    </div>
  </th>
);

// Table Data Cell
Table.Cell = ({ children, align = 'left' }) => (
  <td style={{
    padding: '12px 16px',
    textAlign: align,
    verticalAlign: 'middle'
  }}>
    {children}
  </td>
);

// Memoized exports for performance
export const MemoModal = memo(Modal);
export const MemoTabs = memo(Tabs);
export const MemoAccordion = memo(Accordion);
export const MemoCard = memo(Card);
export const MemoForm = memo(Form);
export const MemoTable = memo(Table);