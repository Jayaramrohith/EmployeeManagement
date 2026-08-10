import { useState } from 'react';
import { FiUser, FiMail, FiBriefcase, FiDollarSign, FiSave, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const COMMON_DEPARTMENTS = [
  'IT',
  'HR',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'Legal',
  'Engineering',
  'Customer Support',
  'Administration',
];

function EmployeeForm({ initialData = {}, onSubmit, submitLabel = 'Save', loading = false, error = '' }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    department: initialData.department || '',
    salary: initialData.salary !== undefined && initialData.salary !== null ? String(initialData.salary) : '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required.';
    }

    const salaryValue = Number(formData.salary);
    if (formData.salary === '' || formData.salary === null || formData.salary === undefined) {
      newErrors.salary = 'Salary is required.';
    } else if (isNaN(salaryValue)) {
      newErrors.salary = 'Salary must be a valid number.';
    } else if (salaryValue <= 0) {
      newErrors.salary = 'Salary must be greater than 0.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      salary: Number(formData.salary),
    };

    onSubmit(payload);
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h5 className="mb-0 fw-bold">{submitLabel === 'Save' ? 'Employee Information' : 'Employee Details'}</h5>
      </div>
      <div className="card-body p-4">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-4">
            {/* Name */}
            <div className="col-12">
              <label htmlFor="name" className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FiUser />
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter employee name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>

            {/* Email */}
            <div className="col-12">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FiMail />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="employee@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            {/* Department */}
            <div className="col-md-6">
              <label htmlFor="department" className="form-label">Department</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FiBriefcase />
                </span>
                <input
                  type="text"
                  id="department"
                  name="department"
                  list="department-suggestions"
                  className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                  placeholder="e.g. IT, HR, Finance"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={loading}
                />
                <datalist id="department-suggestions">
                  {COMMON_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
                {errors.department && <div className="invalid-feedback">{errors.department}</div>}
              </div>
            </div>

            {/* Salary */}
            <div className="col-md-6">
              <label htmlFor="salary" className="form-label">Salary (USD)</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FiDollarSign />
                </span>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                  placeholder="e.g. 50000"
                  min="0"
                  step="0.01"
                  value={formData.salary}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end">
            <Link to="/employees" className="btn btn-outline-secondary btn-icon">
              <FiArrowLeft /> Cancel
            </Link>
            <button type="submit" className="btn btn-primary btn-icon px-4" disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
              <FiSave /> {loading ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;