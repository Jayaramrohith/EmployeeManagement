import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiUserPlus, FiDatabase, FiLogOut } from 'react-icons/fi';

function Sidebar({ show, onClose }) {
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');
const isAdmin = user?.role === 'Admin';

const navigate = useNavigate();

const handleLogout = () => {
localStorage.removeItem('token');
localStorage.removeItem('user');
navigate('/login', { replace: true });
};

return (
<>
{show && <div className="sidebar-overlay" onClick={onClose}></div>}

```
  <aside className={`sidebar ${show ? 'show' : ''}`}>
    <nav className="sidebar-nav">
      <NavLink
        to={token ? '/dashboard' : '/login'}
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        onClick={onClose}
      >
        <FiGrid />
        Dashboard
      </NavLink>

      <NavLink
        to={token ? '/employees' : '/login'}
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        onClick={onClose}
      >
        <FiUsers />
        Employee List
      </NavLink>

      {isAdmin && (
        <NavLink
          to={token ? '/employees/add' : '/login'}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <FiUserPlus />
          Add Employee
        </NavLink>
      )}
    </nav>

    <div
      className="sidebar-footer px-3 py-3 border-top"
      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <div className="text-center mb-3 text-white">
        <div className="fw-bold">{user?.fullName || 'User'}</div>
        <small>{user?.role || 'Employee'}</small>
      </div>

      <button
        className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
        onClick={handleLogout}
      >
        <FiLogOut />
        Logout
      </button>

      <div className="text-center mt-3">
        <FiDatabase />
        <span className="ms-1">v1.0.0</span>
      </div>
    </div>
  </aside>
</>


);
}

export default Sidebar;
