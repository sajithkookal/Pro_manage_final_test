import React from "react";
import styles from "./TaskShare.module.css";
import logo from "../../assets/images/codesandbox.png";

const TaskShare = ({ task }) => {
  if (!task) {
    return null; // Render nothing if task is not provided
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#FF2473"; // High priority color
      case "Moderate":
        return "#18B0FF"; // Moderate priority color
      case "Low":
        return "#63C05B"; // Low priority color
      default:
        return "#000000"; // Default color (black) if priority is not recognized
    }
  };
  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };
   const formatDate = (dueDate) => {
    const date = new Date(dueDate);
    const month = date.toLocaleString('en-us', { month: 'short' });
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    return `${month} ${day}${suffix}`;
  };
  const priorityColor = getPriorityColor(task.priority);
  const formattedDate = formatDate(task.dueDate);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={logo} alt="Pro Manage Logo" />
        Pro Manage
      </div>
      <div className={styles.taskCard}>
        <div className={styles.header}>
          <div
            className={styles.priorityDot}
            style={{ backgroundColor: priorityColor }}
          ></div>
          <span>{task.priority} PRIORITY</span>
        </div>
        <h2 className={styles.title}>{task.title}</h2>
        <div className={styles.checklistStatus}>
          {task.checklist
            ? `Checklist (${
                task.checklist.filter((item) => item.isChecked).length
              }/${task.checklist.length})`
            : "No checklist items"}
        </div>
        <div className={styles.checklist}>
          {task.checklist &&
            task.checklist.map((item, index) => (
              <div key={index} className={styles.checklistItem}>
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  className={styles.checkbox}
                  readOnly
                />
                <span className={styles.checklistTitle}>{item.text}</span>
              </div>
            ))}
        </div>
        <div className={styles.cardbottom}>
        {task.dueDate && <p>Due Date</p>}
          <div>
            {task.dueDate && (
              <button
                className={styles.formattedDate}
                // style={getDateButtonStyle()}
              >
                {formattedDate}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskShare;