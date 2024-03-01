import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import titlelogo from "../../assets/images/titlelogo.svg";
import boardlogo from "../../assets/images/boardlogo.svg";
import analyticslogo from "../../assets/images/analyticslogo.svg";
import settinglogo from "../../assets/images/settinglogo.svg";
import logoutlogo from "../../assets/images/logoutlogo.svg";

function Sidebar() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(null);

  const navigateToDashboard = () => {
    navigate("/dashboard");
    setActiveMode("dashboard");
  };

  const navigateToAnalytics = () => {
    navigate("/analytics");
    setActiveMode("analytics");
  };

  const navigateToSetting = () => {
    navigate("/setting");
    setActiveMode("setting");
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div>
      <div className={styles.sideBar}>
        <div className={styles.logo}>
          <img src={titlelogo} alt="logo" className={styles.titlelogo} />
          <p className={styles.dashboardTitle}>Pro Manage</p>
        </div>
        <div className={styles.modesContainer}>
          <div className={styles.modes}>
            <div
              className={`${styles.mode} ${
                activeMode === "dashboard" ? styles.activeMode : ""
              }`}
              onClick={navigateToDashboard}
            >
              <img src={boardlogo} alt="logo" className={styles.titlelogo} />
              <p className={styles.dashboardMode}>Board</p>
            </div>
            <div
              className={`${styles.mode} ${
                activeMode === "analytics" ? styles.activeMode : ""
              }`}
              onClick={navigateToAnalytics}
            >
              <img
                src={analyticslogo}
                alt="logo"
                className={styles.titlelogo}
              />
              <p className={styles.dashboardMode}>Analytics</p>
            </div>
            <div
              className={`${styles.mode} ${
                activeMode === "setting" ? styles.activeMode : ""
              }`}
              onClick={navigateToSetting}
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
  );
}

export default Sidebar;
