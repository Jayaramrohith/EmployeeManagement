import { Link } from 'react-router-dom';
import { FiHome, FiAlertOctagon } from 'react-icons/fi';

function NotFound() {
  return (
    <div className="empty-state py-5" style={{ minHeight: '70vh' }}>
      <div className="text-center">
        <div className="text-warning mb-3" style={{ fontSize: '4rem' }}>
          <FiAlertOctagon />
        </div>
        <h1 className="fw-bold display-4 mb-2">404</h1>
        <h4 className="fw-semibold mb-3">Page Not Found</h4>
        <p className="text-muted mb-4">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-icon px-4">
          <FiHome /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;