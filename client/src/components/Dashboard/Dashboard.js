import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css";
import { backendBaseUrl } from "../../config/baseurl";
import addLogo from "../../assets/images/add.svg"
import collapseAllIcon from "../../assets/images/collapseAll.svg"
import ToDoModal from "../ToDoModal/ToDoModal";
import Card from "../Card/Card";
import FilterOptions from '../Filter/FilterOptions';
import DeleteCardModal from "../DeleteCard/DeleteCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DashboardContent() {
    const [userName, setUserName] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('thisWeek');
    const [tasks, setTasks] = useState([]);
    const [taskIdToDelete, setTaskIdToDelete] = useState(null);
    const [collapseAll, setCollapseAll] = useState(true);
    const [collapseAllBacklog, setCollapseAllBacklog] = useState(true);
    const [collapseAllProgress, setCollapseAllProgress] = useState(true);
    const [collapseAllDone, setCollapseAllDone] = useState(true);

    const filterOptionsRef = useRef(null);
    const handleFilter = (selectedFilter) => {
        setSelectedFilter(selectedFilter);
        setShowFilterOptions(false); // Close the popup after selecting an option
    };

    const toggleFilterOptions = () => {
        setShowFilterOptions(!showFilterOptions);
    };

    const handleClickOutside = (event) => {
        if (filterOptionsRef.current && !filterOptionsRef.current.contains(event.target)) {
            setShowFilterOptions(false);
        }
    };
    const updateTaskStatus = (taskId, newStatus) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task => {
                if (task._id === taskId) {
                    return { ...task, status: newStatus };
                }
                return task;
            });

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
            const response = await axios.get(`${backendBaseUrl}/tasksFilter?type=${selectedFilter}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data.tasks);

        } catch (error) {
            alert(error.response.data.error);
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        const name = localStorage.getItem("name");
        setUserName(name);
        fetchTasks();
    }, []);


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
            const response = await axios.get(`${backendBaseUrl}/tasksFilter?type=${selectedFilter}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data.tasks);

        } catch (error) {
            alert(error.response.data.error);
            console.error('Error fetching tasks:', error);
        }
    };

    const handleCardDeleted = async () => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`${backendBaseUrl}/deleteTask/${taskIdToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Card deleted", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: true,
            });
            setIsCloseModalOpen(false);
            fetchTasks();
        } catch (error) {
            alert(error.response.data.error);
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
                    <p className={styles.dashboardHeaderName}>Welcome! {userName}</p>
                    <p className={styles.dashboardDate}>{currentDate}</p>
                    <p className={styles.dashboardTitle}>Board</p>
                    <div className={styles.dashboardOptionDiv}>
                        <div className={styles.filterContainer} ref={filterOptionsRef}>
                            <button className={styles.filterButton} onClick={toggleFilterOptions}>
                                {selectedFilter === 'today' ? 'Today' : selectedFilter === 'thisWeek' ? 'This Week' : 'This Month'}
                                
                            </button>
                            <span className={styles.arrowDown}></span>
                            {showFilterOptions && <FilterOptions onFilter={handleFilter} selectedFilter={selectedFilter} />}
                        </div>
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
                                    onTaskAdded={handleTaskAdded} />
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
                                    onTaskAdded={handleTaskAdded} />
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
            <ToDoModal isOpen={isModalOpen} closeModal={toggleModal} onTaskAdded={handleTaskAdded} />
            <DeleteCardModal isOpen={isCloseModalOpen} closeModal={toggleCloseModal} onDeleteConfirm={handleCardDeleted} />
            <ToastContainer />
        </>
    );
}

export default DashboardContent;
