import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import titlelogo from "../../assets/images/titlelogo.svg";
import boardlogo from "../../assets/images/boardlogo.svg";
import analyticslogo from "../../assets/images/analyticslogo.svg";
import settinglogo from "../../assets/images/settinglogo.svg";
import logoutlogo from "../../assets/images/logoutlogo.svg";
import Logout from "../Logout/Logout";

function Sidebar() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState('');
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);


  const navigateToSettings = () => {
   // event.preventDefault();
    console.log("page  setting");
    setActiveMode('setting');
    navigate('/setting');

  };
  const navigateToAnalytics = () => {
    //event.preventDefault();
    console.log("page  analytics");
    setActiveMode('analytics');
    navigate('/analytics');

  };
  const navigateToDashboarde = () => {
   // event.preventDefault();
    console.log("page  ");
    
    navigate('/dashboard');
    setActiveMode('dashboard');

  };

  const confirmLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  }

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };


  return (
    <>
      <div>
        <div className={styles.sideBar}>
          <div className={styles.logo}>
            <img src={titlelogo} alt="logo" className={styles.titlelogo} />
            <p className={styles.dashboardTitleM}>Pro Manage</p>
          </div>
          <div className={styles.modesContainer}>
            <div >

              <div
                style={{ backgroundColor: activeMode === 'dashboard' ? '#4391ED1A' : '#FFFFFF' }} className={styles.mode}

                onClick={navigateToDashboarde}
              >
                <img src={boardlogo} alt="logo" className={styles.titlelogo} />
                <p className={styles.dashboardMode}>Board</p>
              </div>
              <div
                className={styles.mode} onClick={navigateToAnalytics}
                style={{ backgroundColor: activeMode === 'analytics' ? '#4391ED1A' : '#FFFFFF' }} >
                <img
                  src={analyticslogo}
                  alt="logo"
                  className={styles.titlelogo}
                />
                <p className={styles.dashboardMode}>Analytics</p>
              </div>
              <div
                className={styles.mode} style={{ backgroundColor: activeMode === 'setting' ? '#4391ED1A' : '#FFFFFF' }}
                onClick={navigateToSettings}
              >
                <img src={settinglogo} alt="logo" className={styles.titlelogo} />
                <p className={styles.dashboardMode}>Settings</p>
              </div>
            </div>
            <div className={styles.logo} onClick={handleLogout}>
              <img src={logoutlogo} alt="logo" className={styles.titlelogo} />
              <p className={styles.dashboardTitle}>Log out</p>
            </div>
          </div>
        </div>
      </div>
      <Logout
        isOpen={logoutModalOpen}
        closeModal={() => setLogoutModalOpen(false)}
        isConfirmLogout={confirmLogout}
      />
    </>
  );
}

export default Sidebar;
