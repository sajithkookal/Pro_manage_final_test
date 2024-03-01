import React from "react";
import styles from "./MainLayout.module.css"
import Sidebar from "../Sidebar/Sidebar";

function MainLayout({ children }) {
  return (
    <>
      <div className={styles.dashboardSection}>
        <Sidebar />
        {children}
      </div>
    </>
  );
}

export default MainLayout;
