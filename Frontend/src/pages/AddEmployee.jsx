import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';
import EmployeeForm from '../components/ui/EmployeeForm';
import { createEmployee } from '../services/employeeService';
import { getErrorMessage } from '../utils/errorHandler';

function AddEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (employeeData) => {
    try {
      setLoading(true);
      setError('');
      const created = await createEmployee(employeeData);
      // Pass the created employee and a flag so the list can refresh immediately
      navigate('/employees', {
        state: {
          success: 'Employee added successfully.',
          refresh: true,
          newEmployee: created,
        },
      });
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="stat-icon blue">
          <FiUserPlus />
        </div>
        <div>
          <h4 className="fw-bold mb-1">Add Employee</h4>
          <p className="text-muted mb-0">Fill in the details below to add a new employee</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <EmployeeForm
            onSubmit={handleSubmit}
            submitLabel="Add Employee"
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;