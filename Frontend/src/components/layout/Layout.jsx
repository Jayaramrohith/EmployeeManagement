import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-wrapper">
      <Sidebar show={sidebarOpen} onClose={closeSidebar} />
      <Navbar onToggleSidebar={toggleSidebar} />
      <main className="main-content">
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;