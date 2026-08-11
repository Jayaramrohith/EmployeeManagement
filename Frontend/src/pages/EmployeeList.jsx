import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUserPlus, FiEdit2, FiTrash2, FiSearch, FiUsers } from 'react-icons/fi';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Pagination from '../components/ui/Pagination';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { getEmployees, deleteEmployee } from '../services/employeeService';
import { getErrorMessage } from '../utils/errorHandler';

const PAGE_SIZE = 5;

function EmployeeList() {
const navigate = useNavigate();
const location = useLocation();

const [employees, setEmployees] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const [departmentFilter, setDepartmentFilter] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [deleteTarget, setDeleteTarget] = useState(null);
const [deleteLoading, setDeleteLoading] = useState(false);
const [successMessage, setSuccessMessage] = useState('');

const user = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = user.role === "Administrator";

const fetchEmployees = async () => {
try {
setLoading(true);
setError('');
const data = await getEmployees();
const list = Array.isArray(data) ? data : data.items || data.data || [];
setEmployees(list);
} catch (err) {
setError(getErrorMessage(err));
setEmployees([]);
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchEmployees();
}, [location.pathname]);

useEffect(() => {
if (location.state && location.state.success) {
setSuccessMessage(location.state.success);
window.history.replaceState({}, document.title);
const timer = setTimeout(() => setSuccessMessage(''), 4000);
return () => clearTimeout(timer);
}


if (location.state && location.state.newEmployee) {
  setEmployees((prev) => {
    const exists = prev.some((emp) => emp.id === location.state.newEmployee.id);
    if (exists) return prev;
    return [location.state.newEmployee, ...prev];
  });
}


}, [location.state]);

const departments = useMemo(() => {
const deps = new Set(employees.map((emp) => emp.department).filter(Boolean));
return Array.from(deps).sort();
}, [employees]);

const filteredEmployees = useMemo(() => {
let result = employees;


if (searchTerm.trim()) {
  const term = searchTerm.trim().toLowerCase();
  result = result.filter(
    (emp) =>
      (emp.name && emp.name.toLowerCase().includes(term)) ||
      (emp.email && emp.email.toLowerCase().includes(term))
  );
}

if (departmentFilter) {
  result = result.filter((emp) => emp.department === departmentFilter);
}

return result;


}, [employees, searchTerm, departmentFilter]);

const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
const safePage = Math.min(currentPage, totalPages);
const paginatedEmployees = filteredEmployees.slice(
(safePage - 1) * PAGE_SIZE,
safePage * PAGE_SIZE
);

const formatSalary = (salary) => {
const value = Number(salary);
if (isNaN(value)) return '-';
return new Intl.NumberFormat('en-US', {
style: 'currency',
currency: 'USD',
maximumFractionDigits: 0,
}).format(value);
};

const getInitials = (name) => {
if (!name) return '?';
return name
.split(' ')
.map((part) => part[0])
.join('')
.toUpperCase()
.slice(0, 2);
};

const handleSearchChange = (e) => {
setSearchTerm(e.target.value);
setCurrentPage(1);
};

const handleDepartmentChange = (e) => {
setDepartmentFilter(e.target.value);
setCurrentPage(1);
};

const handleDeleteClick = (employee) => {
setDeleteTarget(employee);
};

const handleConfirmDelete = async () => {
if (!deleteTarget) return;


const employee = deleteTarget;

try {
  setDeleteLoading(true);
  setError('');

  await deleteEmployee(employee.id);

  setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id));

  setDeleteTarget(null);

  await fetchEmployees();

  setSuccessMessage(`${employee.name} deleted successfully.`);
} catch (err) {
  console.error(err);
  setError(getErrorMessage(err));
} finally {
  setDeleteLoading(false);
}


};

return ( <div> <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3"> <div> <h4 className="fw-bold mb-1">Employee List</h4> <p className="text-muted mb-0">
{filteredEmployees.length} employee
{filteredEmployees.length !== 1 ? 's' : ''} found </p> </div>


    {isAdmin && (
      <Link to="/employees/add" className="btn btn-primary btn-icon">
        <FiUserPlus /> Add Employee
      </Link>
    )}
  </div>

  {error && (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  )}

  {successMessage && (
    <div className="alert alert-success" role="alert">
      {successMessage}
    </div>
  )}

  <div className="card table-card mb-4">
    <div className="card-body py-3">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <FiSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={departmentFilter}
            onChange={handleDepartmentChange}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || departmentFilter) && (
          <div className="col-md-2 d-flex align-items-center">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('');
                setCurrentPage(1);
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  </div>

  <div className="card table-card">
    <div className="table-responsive">
      {loading ? (
        <LoadingSpinner message="Loading employees..." />
      ) : filteredEmployees.length === 0 ? (
        <div className="empty-state">
          <FiUsers />
          <h6 className="mt-3 fw-semibold">No employees found</h6>
          <p className="mb-3">
            {employees.length === 0
              ? 'There are no employees in the system yet.'
              : 'No employees match your search criteria.'}
          </p>

          {employees.length === 0 && isAdmin && (
            <Link to="/employees/add" className="btn btn-primary btn-icon">
              <FiUserPlus /> Add Your First Employee
            </Link>
          )}
        </div>
      ) : (
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th className="ps-4">Employee</th>
              <th>Email</th>
              <th>Department</th>
              <th className="text-end">Salary</th>
              <th className="text-end pe-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedEmployees.map((emp) => (
              <tr key={emp.id}>
                <td className="ps-4">
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar">{getInitials(emp.name)}</div>
                    <span className="fw-semibold">{emp.name}</span>
                  </div>
                </td>

                <td>{emp.email || '-'}</td>

                <td>
                  <span className="badge bg-primary-subtle text-primary-emphasis px-3 py-2">
                    {emp.department || 'Unassigned'}
                  </span>
                </td>

                <td className="text-end fw-semibold">
                  {formatSalary(emp.salary)}
                </td>

                <td className="text-end pe-4">
                  <div className="d-flex gap-2 justify-content-end">
                    {isAdmin && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-primary btn-icon"
                          title="Edit"
                          onClick={() => navigate(`/employees/edit/${emp.id}`)}
                        >
                          <FiEdit2 /> Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger btn-icon"
                          title="Delete"
                          onClick={() => handleDeleteClick(emp)}
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    {!loading && filteredEmployees.length > 0 && (
      <div className="card-footer bg-white py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
        <small className="text-muted">
          Showing page {safePage} of {totalPages} | {filteredEmployees.length}{' '}
          total
        </small>

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    )}
  </div>

  <ConfirmationModal
    show={!!deleteTarget}
    title="Delete Employee"
    message={
      deleteTarget
        ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
        : ''
    }
    confirmText="Delete"
    cancelText="Cancel"
    loading={deleteLoading}
    onConfirm={handleConfirmDelete}
    onCancel={() => setDeleteTarget(null)}
  />
</div>

);
}

export default EmployeeList;
