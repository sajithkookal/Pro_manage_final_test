import React, { useState, useEffect } from 'react';
import styles from './Card.module.css';
import dotLogo from "../../assets/images/dots.svg"
import collapseDownIcon from "../../assets/images/collapsedown.svg"
import collapseUpIcon from "../../assets/images/collapseup.svg"
import ToDoEditModal from '../ToDoEditModal/ToDoEditModal';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendBaseUrl, frontEndBaseUrl } from '../../config/baseurl';
import axios from 'axios';

const Card = ({ task, updateTaskStatus, toggleCloseModal, collapseAll, onTaskAdded }) => {
    const { _id: taskId, title, priority, status, checklist: taskChecklist, dueDate } = task; // Renamed checklist to taskChecklist
    const [showOptions, setShowOptions] = useState(false);
    const [checklist, setChecklist] = useState([]);
    const [showChecklist, setShowChecklist] = useState(false);
    const [collapseIcon, setCollapseIcon] = useState(collapseDownIcon);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedTask, setEditedTask] = useState(task);

    const checkedTasks = taskChecklist.filter(task => task.isChecked).length; // Updated to use taskChecklist
    const totalTasks = taskChecklist.length; // Updated to use taskChecklist

    // Function to truncate the title if it exceeds 10 characters
    const truncatedTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;

    useEffect(() => {
        setShowChecklist(false);
        setCollapseIcon(collapseDownIcon);
    }, [collapseAll]);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };


    const toggleChecklist = () => {
        setShowChecklist(!showChecklist); // Toggle checklist visibility
        setCollapseIcon(showChecklist ? collapseDownIcon : collapseUpIcon);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'rgb(255, 0, 225)';
            case 'Moderate':
                return 'rgb(0, 200, 255)';
            case 'Low':
                return 'rgb(0, 255, 60)';
            default:
                return 'gray';
        }
    };

    const handleChecklistToggle = async (index) => {
        const updatedChecklist = [...taskChecklist]; // Updated to use taskChecklist
        updatedChecklist[index].isChecked = !updatedChecklist[index].isChecked;
        setChecklist(updatedChecklist);

        try {
            const token = localStorage.getItem('userToken');
            const taskId = updatedChecklist[index]._id;
            const response = await axios.put(`${backendBaseUrl}/tasks/${task._id}/${taskId}`, {
                isChecked: updatedChecklist[index].isChecked,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChecklist(updatedChecklist);
            console.log(response.data); // Log the response from the backend
        } catch (error) {
            alert(error.response.data.error);
            console.error('Error updating task:', error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem('userToken');
            const taskId = task._id;
            console.log(taskId+" newStatusn  "+newStatus);
            const response = await axios.put(`${backendBaseUrl}/taskStatusUpdate/${taskId}`, {
                status: newStatus,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            updateTaskStatus(taskId, newStatus);
        } catch (error) {
            alert(error.response.data.error);
            console.error('Error updating task status:', error);
        }
    };

    const handleDeleteClick = () => {
        toggleOptions(); // Close options menu
        toggleCloseModal(taskId); // Open delete modal with taskId
    };
    const handleShareClick = () => {
        toggleOptions();
        let taskLink = `${frontEndBaseUrl}/taskShared/${editedTask._id}`
        navigator.clipboard.writeText(taskLink);
        toast.success("Link Copied to Clipboard", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
        });
    }

    const handleEditClick = () => {
        setEditedTask(task); // Set the task data to be edited
        setEditModalOpen(true); // Open the edit modal
        toggleOptions(); // Close options menu
    };

    // Function to render the mode buttons based on the current status
    const renderModeButtons = () => {
        switch (editedTask.status) {
            case 'todo':
                return (
                    <>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('backlog')}>Backlog</button>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('progress')}>Progress</button>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('done')}>Done</button>
                    </>
                );
            case 'backlog':
                return (
                    <>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('todo')}>To-Do</button>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('progress')}>Progress</button>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('done')}>Done</button>
                    </>
                );
            case 'progress':
                return (
                    <>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('backlog')}>Backlog</button>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('todo')}>To-Do</button>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('done')}>Done</button>
                    </>
                );
            case 'done':
                return (
                    <>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('backlog')}>Backlog</button>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('todo')}>To-Do</button>
                        <button className={styles.modeBtn} onClick={() => handleStatusChange('progress')}>Progress</button>
                    </>
                );
            default:
                return null;
        }
    };
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero for accurate date comparison
  
    const isDueDatePassed = new Date(task.dueDate) < currentDate;
    const isTaskCompleted = task.status === "done";

    const getDateButtonStyle = () => {
        if (isTaskCompleted) {
          return { backgroundColor: "#63C05B", color: "#fff" }; // Completed tasks have this style
        } else if (isDueDatePassed) {
          return { backgroundColor: "#CF3636", color: "#fff" }; // Overdue tasks have this style
        } else {
          return {backgroundColor: "#a4a0a0", color: "#fff" }; // Default style for other cases
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
    const formattedDate = formatDate(task.dueDate);

    return (
        <>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.priorityDiv}>
                        <div className={styles.colorDiv} style={{ backgroundColor: getPriorityColor(priority) }}></div>
                        <div className={styles.priorityIndicator}>{priority} Priority</div>
                    </div>
                    <div className={styles.optionsMenu}>
                        <div className={styles.dots} onClick={toggleOptions}>
                            <img src={dotLogo} alt='dot logo' />
                        </div>
                    </div>
                </div>
                <div className={styles.optionsDiv}>
                    {showOptions && (
                        <div className={styles.options}>
                            <div className={styles.optionBtn} onClick={handleEditClick}>Edit</div>
                            <div className={styles.optionBtn} onClick={handleShareClick}>Share</div>
                            <div className={styles.optionBtnDelete} onClick={handleDeleteClick}>Delete</div>
                        </div>
                    )}
                </div>
                <div className={styles.title}>{truncatedTitle}</div>
                <div className={styles.checklist}>
                    <div className={styles.checklistData}>
                        Checklist ({checkedTasks}/{totalTasks})
                    </div>
                    <div className={styles.collapseImg} onClick={toggleChecklist}>
                        <img src={collapseIcon} alt='collapse icon' />
                    </div>
                </div>
                {showChecklist && (
                    <div className={styles.checklistInput}>
                        {taskChecklist.map((task, index) => (
                            <div key={index} className={styles.taskItem}>
                                <input
                                    type="checkbox"
                                    checked={task.isChecked}
                                    onChange={() => handleChecklistToggle(index)}
                                    className={styles.checkBox}
                                />
                                <span>{task.text}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div className={styles.modesBtn}>
                    {task.dueDate && (
                        <button className={styles.modeBtn}  style={getDateButtonStyle()}>{formattedDate}</button>
                    )}
                    {renderModeButtons()}
                </div>
            </div>
            <ToDoEditModal
                isOpen={editModalOpen}
                closeModal={() => setEditModalOpen(false)}
                task={editedTask}
                onTaskAdded={onTaskAdded}
            />
        </>
    );
};

export default Card;
