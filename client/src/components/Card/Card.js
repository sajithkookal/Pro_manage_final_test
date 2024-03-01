import React, { useState, useEffect } from 'react';
import styles from './Card.module.css';
import dotLogo from "../../assets/images/dots.svg"
import collapseDownIcon from "../../assets/images/collapsedown.svg"
import collapseUpIcon from "../../assets/images/collapseup.svg"
import ToDoEditModal from '../ToDoEditModal/ToDoEditModal';
import { BACKEND_URL } from '../../config/baseurl';
import axios from 'axios';

const Card = ({ task, updateTaskStatus, toggleCloseModal, collapseAll, onTaskAdded }) => {
    const { _id: taskId, title, priority, status, checklist: taskChecklist, dueDate } = task; // Renamed checklist to taskChecklist
    const [showOptions, setShowOptions] = useState(false);
    const [checklist, setChecklist] = useState([]);
    const [showChecklist, setShowChecklist] = useState(false);
    const [collapseIcon, setCollapseIcon] = useState(collapseDownIcon);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedTask, setEditedTask] = useState(null);

    const checkedTasks = taskChecklist.filter(task => task.isChecked).length; // Updated to use taskChecklist
    const totalTasks = taskChecklist.length; // Updated to use taskChecklist

    useEffect(() => {
        setShowChecklist(!collapseAll);
    }, [collapseAll]);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    // const toggleEditModal = () => {
    //     setIsEditModalOpen(!isEditModalOpen);
    //     setTaskIdToEdit(taskId); // Set the task ID to edit
    // };

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
            const response = await axios.put(`${BACKEND_URL}/tasks/${taskId}`, {
                isChecked: updatedChecklist[index].isChecked,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChecklist(updatedChecklist);
            console.log(response.data); // Log the response from the backend
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem('userToken');
            const taskId = task._id;
            const response = await axios.put(`${BACKEND_URL}/tasks/${taskId}/status`, {
                status: newStatus,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            updateTaskStatus(taskId, newStatus);
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const handleDeleteClick = () => {
        toggleOptions(); // Close options menu
        toggleCloseModal(taskId); // Open delete modal with taskId
    };

    const handleEditClick = () => {
        setEditedTask(task); // Set the task data to be edited
        setEditModalOpen(true); // Open the edit modal
        toggleOptions(); // Close options menu
    };

    // Function to render the mode buttons based on the current status
    const renderModeButtons = () => {
        switch (status) {
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
                            <div className={styles.optionBtn}>Share</div>
                            <div className={styles.optionBtnDelete} onClick={handleDeleteClick}>Delete</div>
                        </div>
                    )}
                </div>
                <div className={styles.title}>{title}</div>
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
