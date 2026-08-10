import { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiDollarSign, FiUserPlus, FiArrowRight } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getEmployees } from '../services/employeeService';
import { getErrorMessage } from '../utils/errorHandler';

function Dashboard() {
const [employees, setEmployees] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

const location = useLocation();

const fetchEmployees = async () => {
try {
setLoading(true);
setError('');


  const list = await getEmployees();
  setEmployees(Array.isArray(list) ? list : []);
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

const departments = {};

employees.forEach((emp) => {
const dept = emp.department || 'Unassigned';
departments[dept] = (departments[dept] || 0) + 1;
});

const totalEmployees = employees.length;
const departmentCount = Object.keys(departments).length;

const totalSalary = employees.reduce(
(sum, emp) => sum + (Number(emp.salary) || 0),
0
);

let topDepartment = 'No employees yet';

if (departmentCount > 0) {
topDepartment = Object.keys(departments).reduce((a, b) =>
departments[a] > departments[b] ? a : b
);
}

const formattedSalary = new Intl.NumberFormat('en-US', {
style: 'currency',
currency: 'USD',
maximumFractionDigits: 0,
}).format(totalSalary);

return ( <div className="container-fluid py-4"> <div className="d-flex justify-content-between align-items-center mb-4"> <div> <h2 className="fw-bold mb-1">Dashboard</h2> <p className="text-muted mb-0">
Welcome to the Employee Management System </p> </div>


    <Link to="/employees/add" className="btn btn-primary">
      <FiUserPlus className="me-2" />
      Add Employee
    </Link>
  </div>

  {error && (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  )}

  {loading ? (
    <LoadingSpinner message="Loading dashboard statistics..." />
  ) : (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon={<FiUsers />}
            color="blue"
            value={totalEmployees}
            label="Total Employees"
          />
        </div>

        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon={<FiBriefcase />}
            color="green"
            value={departmentCount}
            label="Departments"
          />
        </div>

        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon={<FiDollarSign />}
            color="orange"
            value={formattedSalary}
            label="Total Salaries"
          />
        </div>

        <div className="col-sm-6 col-xl-3">
          <StatCard
            icon={<FiUsers />}
            color="purple"
            value={topDepartment}
            label="Top Department"
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Department Distribution</h5>

          <Link to="/employees" className="btn btn-sm btn-outline-primary">
            View Employees
            <FiArrowRight className="ms-1" />
          </Link>
        </div>

        <div className="card-body">
          {departmentCount === 0 ? (
            <p className="text-muted mb-0">No employees found.</p>
          ) : (
            Object.entries(departments).map(([dept, count]) => {
              const percentage =
                totalEmployees > 0
                  ? Math.round((count / totalEmployees) * 100)
                  : 0;

              return (
                <div key={dept} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{dept}</span>
                    <span>
                      {count} ({percentage}%)
                    </span>
                  </div>

                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  )}
</div>


);
}

export default Dashboard;
