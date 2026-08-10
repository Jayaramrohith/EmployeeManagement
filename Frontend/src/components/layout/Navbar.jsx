import { FiMenu, FiUser } from 'react-icons/fi';

function Navbar({ onToggleSidebar }) {
  return (
    <nav className="navbar navbar-custom navbar-expand-lg px-3">
      <div className="container-fluid">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-secondary btn-sm d-lg-none"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FiMenu />
          </button>
          <h6 className="mb-0 text-dark fw-bold text-truncate">Employee Management System</h6>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="avatar">
              <FiUser />
            </div>
            <div className="d-none d-sm-block">
              <small className="text-muted d-block">Administrator</small>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;