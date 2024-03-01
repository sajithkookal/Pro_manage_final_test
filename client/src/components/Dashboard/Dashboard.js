import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css";
import { BACKEND_URL } from "../../config/baseurl";
import addLogo from "../../assets/images/add.svg"
import collapseAllIcon from "../../assets/images/collapseAll.svg"
import ToDoModal from "../ToDoModal/ToDoModal";
import Card from "../Card/Card";
import DeleteCardModal from "../DeleteCard/DeleteCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DashboardContent() {
    const [userName, setUserName] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [taskIdToDelete, setTaskIdToDelete] = useState(null);
    const [collapseAll, setCollapseAll] = useState(true);
    const [collapseAllBacklog, setCollapseAllBacklog] = useState(true);
    const [collapseAllProgress, setCollapseAllProgress] = useState(true);
    const [collapseAllDone, setCollapseAllDone] = useState(true);

    const updateTaskStatus = (taskId, newStatus) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task => {
                if (task._id === taskId) {
                    return { ...task, status: newStatus };
                }
                return task;
            });
    
            countStatuses(updatedTasks);
            countPriorities(updatedTasks);
            return updatedTasks;
        });
    };

    useEffect(() => {
        const currentDate = new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            year: 'numeric',
            month: 'long'
        });
        setCurrentDate(currentDate);
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get(`${BACKEND_URL}/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data.tasks);
            countStatuses(response.data.tasks); 
            countPriorities(response.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem("userId");
            try {
                const token = localStorage.getItem('userToken'); // Get the JWT token from localStorage
                const response = await axios.get(`${BACKEND_URL}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Set the Authorization header with the token
                    }
                });
                setUserName(response.data.user.name)
            } catch (error) {
                console.error("Error fetching user name:", error);
            }
        };
        fetchUserData();
    }, []);

    // Count the number of tasks with each status
    const countStatuses = (tasks) => {
        const counts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});
        localStorage.setItem('statusCounts', JSON.stringify(counts)); // Store counts in localStorage
    };

    const countPriorities = (tasks) => {
        const counts = tasks.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        }, {});
        localStorage.setItem("priorityCounts", JSON.stringify(counts)); // Store counts in localStorage
    };

    // Function to handle opening and closing of modal
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleCloseModal = (taskId) => { // Update to pass taskId to delete modal
        setIsCloseModalOpen(!isCloseModalOpen);
        setTaskIdToDelete(taskId); // Set taskId to delete
    };


    const handleTaskAdded = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get(`${BACKEND_URL}/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data.tasks);
            countStatuses(response.data.tasks); 
            countPriorities(response.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleCardDeleted = async () => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`${BACKEND_URL}/tasks/${taskIdToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Card deleted successfully", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
            setIsCloseModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    }

    const handleCollapseAll = () => {
        setCollapseAll(!collapseAll);
    };
    const handleCollapseAllBacklog = () => {
        setCollapseAllBacklog(!collapseAllBacklog);
    };
    const handleCollapseAllProgress = () => {
        setCollapseAllProgress(!collapseAllProgress);
    };
    const handleCollapseAllDone = () => {
        setCollapseAllDone(!collapseAllDone);
    };

    return (
        <>
            <div className={styles.dashboardScreen}>
                <div className={styles.dashboardHeader}>
                    <h1 className={styles.dashboardHeaderName}>Welcome! {userName}</h1>
                    <p className={styles.dashboardDate}>{currentDate}</p>
                    <h1 className={styles.dashboardTitle}>Board</h1>
                    <div className={styles.dashboardOptionDiv}>
                        <select className={styles.dashboardOptions}>
                            <option className={styles.optionList} value="today">Today</option>
                            <option className={styles.optionList} value="week">This Week</option>
                            <option className={styles.optionList} value="month">This Month</option>
                        </select>
                    </div>
                </div>
                <div className={styles.dashboardData}>
                    <div className={styles.dashboardBlock}>
                        <div className={styles.backlogBlockHeader}>
                            <h2 className={styles.blockHeader}>Backlog</h2>
                            <div className={styles.BtnDiv}>
                                <button className={styles.addButton} onClick={handleCollapseAllBacklog}><img src={collapseAllIcon} alt="collapse logo" /></button>
                            </div>
                        </div>
                        <div className={styles.backlogContent}>
                            {tasks.map((task) => (
                                task.status === 'backlog' && 
                                <Card 
                                key={task._id} 
                                task={task} 
                                updateTaskStatus={updateTaskStatus} 
                                toggleCloseModal={toggleCloseModal} 
                                collapseAll={collapseAllBacklog}
                                onTaskAdded={handleTaskAdded}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.dashboardBlock}>
                        <div className={styles.todoBlockHeader}>
                            <h2 className={styles.blockHeader}>To Do</h2>
                            <div className={styles.BtnDiv}>
                                <button className={styles.addButton} onClick={toggleModal}><img src={addLogo} alt="add logo" /></button>
                                <button className={styles.addButton} onClick={handleCollapseAll}><img src={collapseAllIcon} alt="collapse logo" /></button>
                            </div>
                        </div>

                        <div className={styles.toDoContent}>
                            {tasks.map((task) => (
                                task.status === 'todo' && 
                                <Card 
                                key={task._id} 
                                task={task} 
                                updateTaskStatus={updateTaskStatus} 
                                toggleCloseModal={toggleCloseModal} 
                                collapseAll={collapseAll}
                                onTaskAdded={handleTaskAdded}/>
                            ))}
                        </div>
                    </div>

                    <div className={styles.dashboardBlock}>
                        <div className={styles.progressBlockHeader}>
                            <h2 className={styles.blockHeader}>In Progress</h2>
                            <div className={styles.BtnDiv}>
                                <button className={styles.addButton} onClick={handleCollapseAllProgress}><img src={collapseAllIcon} alt="collapse logo" /></button>
                            </div>
                        </div>
                        <div className={styles.progressContent}>
                            {tasks.map((task) => (
                                task.status === 'progress' && 
                                <Card 
                                key={task._id} 
                                task={task} 
                                updateTaskStatus={updateTaskStatus} 
                                toggleCloseModal={toggleCloseModal} 
                                collapseAll={collapseAllProgress}
                                onTaskAdded={handleTaskAdded}/>
                            ))}
                        </div>
                    </div>

                    <div className={styles.dashboardBlock}>
                        <div className={styles.doneBlockHeader}>
                            <h2 className={styles.blockHeader}>Done</h2>
                            <div className={styles.BtnDiv}>
                                <button className={styles.addButton} onClick={handleCollapseAllDone}><img src={collapseAllIcon} alt="collapse logo" /></button>
                            </div>
                        </div>
                        <div className={styles.doneContent}>
                            {tasks.map((task) => (
                                task.status === 'done' && 
                                <Card 
                                key={task._id} 
                                task={task} 
                                updateTaskStatus={updateTaskStatus} 
                                toggleCloseModal={toggleCloseModal} 
                                collapseAll={collapseAllDone}
                                onTaskAdded={handleTaskAdded}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <ToDoModal isOpen={isModalOpen} closeModal={toggleModal} onTaskAdded={handleTaskAdded}/>
            <DeleteCardModal isOpen={isCloseModalOpen} closeModal={toggleCloseModal} onDeleteConfirm={handleCardDeleted}/>
            <ToastContainer />
        </>
    );
}

export default DashboardContent;
