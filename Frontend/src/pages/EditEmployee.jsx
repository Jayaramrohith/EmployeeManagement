import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmployeeForm from '../components/ui/EmployeeForm';
import { getEmployeeById, updateEmployee } from '../services/employeeService';
import { getErrorMessage } from '../utils/errorHandler';

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getEmployeeById(id);
        setEmployee(data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        } else {
          setError(getErrorMessage(err));
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const handleSubmit = async (employeeData) => {
    try {
      setSaving(true);
      setError('');
      await updateEmployee(id, employeeData);
      // Pass refresh flag so the list reloads immediately
      navigate('/employees', {
        state: {
          success: 'Employee updated successfully.',
          refresh: true,
        },
      });
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  if (notFound) {
    return (
      <div className="empty-state py-5">
        <div className="text-center">
          <h4 className="fw-bold mb-3">Employee Not Found</h4>
          <p className="text-muted mb-4">The employee you are trying to edit does not exist or has been deleted.</p>
          <Link to="/employees" className="btn btn-primary btn-icon">
            <FiArrowLeft /> Back to Employee List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="stat-icon green">
          <FiEdit2 />
        </div>
        <div>
          <h4 className="fw-bold mb-1">Edit Employee</h4>
          <p className="text-muted mb-0">Update the details for this employee</p>
        </div>
      </div>

      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {loading ? (
            <LoadingSpinner message="Loading employee details..." />
          ) : (
            <EmployeeForm
              initialData={employee}
              onSubmit={handleSubmit}
              submitLabel="Update Employee"
              loading={saving}
              error={loading ? '' : error}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditEmployee;