import { useMemo, useState } from 'react';
import './SettingsForm.css';

const initialFormState = {
  fullName: '',
  email: '',
  theme: 'system',
  notifications: true,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name, value) {
  if (name === 'fullName') {
    return value.trim() ? '' : 'Full Name is required.';
  }

  if (name === 'email') {
    if (!value.trim()) {
      return 'Email is required.';
    }
    if (!emailPattern.test(value.trim())) {
      return 'Email must be in a valid format.';
    }
    return '';
  }

  return '';
}

export default function SettingsForm() {
  const [formState, setFormState] = useState(initialFormState);
  const [touched, setTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const errors = useMemo(() => {
    const nextErrors = {};
    Object.entries(formState).forEach(([field, value]) => {
      if (field === 'theme' || field === 'notifications') {
        return;
      }
      nextErrors[field] = validateField(field, value);
    });
    return nextErrors;
  }, [formState]);

  const isValid = !errors.fullName && !errors.email;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setFormState((prev) => ({ ...prev, [name]: nextValue }));
    setSuccessMessage('');
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ fullName: true, email: true });

    if (!isValid) {
      return;
    }

    setSuccessMessage('Settings saved successfully.');
  };

  const renderError = (fieldName) => {
    const shouldShowError = touched[fieldName] && errors[fieldName];
    if (!shouldShowError) {
      return null;
    }

    return (
      <p className="field-error" id={`${fieldName}-error`} role="alert">
        {errors[fieldName]}
      </p>
    );
  };

  return (
    <section className="settings-container" aria-labelledby="settings-heading">
      <header className="settings-header">
        <h1 id="settings-heading">Settings</h1>
        <p>Manage your profile preferences.</p>
      </header>

      {successMessage ? <p className="success-message">{successMessage}</p> : null}

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formState.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.fullName && errors.fullName)}
            aria-describedby={touched.fullName && errors.fullName ? 'fullName-error' : undefined}
            placeholder="Enter your full name"
          />
          {renderError('fullName')}
        </div>

        <div className="field-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
            placeholder="Enter your email"
          />
          {renderError('email')}
        </div>

        <div className="field-group">
          <label htmlFor="theme">Theme</label>
          <select id="theme" name="theme" value={formState.theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="field-group toggle-group">
          <label className="toggle-label" htmlFor="notifications">
            <input
              id="notifications"
              name="notifications"
              type="checkbox"
              checked={formState.notifications}
              onChange={handleChange}
            />
            <span className="toggle-slider" aria-hidden="true"></span>
            <span className="toggle-text">Notifications</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={!isValid}>
            Save
          </button>
        </div>
      </form>
    </section>
  );
}
