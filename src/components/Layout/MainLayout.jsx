import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import '../../styles/Layout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content d-flex flex-column flex-grow-1">
        <TopNavbar />
        <main className="flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
