import React, { useState, useEffect } from 'react';
import styles from './ToDoModal.module.css';
import axios from 'axios';
import { backendBaseUrl } from "../../config/baseurl"
import deleteIcon from "../../assets/images/delete.svg"
import addLogo from "../../assets/images/add.svg"
import DatePicker from 'react-datepicker';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

const ToDoModal = ({ isOpen, closeModal, onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [checklist, setChecklist] = useState([]);
    const [dateShowInButton, setDateShowInButton] = useState('Select Due Date');
    const [calenderDate, setCalenderDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(null);
    const [selectedChecklist, setSelectedChecklist] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);
    // const [tasks, setTasks] = useState([]);

    const handleChange = (e) => {
        setShowCalendar(!showCalendar);
        setDueDate(e);
        setCalenderDate(e);
        setDateShowInButton(format(calenderDate, 'dd/MM/yyyy'));
    };
    const handleClick = (e) => {
        e.preventDefault();
        setShowCalendar(!showCalendar);
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleAddChecklist = () => {
        setChecklist([...checklist, { text: '', isChecked: false }]);
    };

    const handleRemoveChecklist = (index) => {
        const updatedChecklist = [...checklist];
        const removedItem = updatedChecklist.splice(index, 1)[0];
        if (removedItem.isChecked) {
            setSelectedChecklist((prevCount) => prevCount - 1);
        }
        setChecklist(updatedChecklist);
    };

    const handleChecklistChange = (index, newText) => {
        const updatedChecklist = [...checklist];
        updatedChecklist[index].text = newText;
        setChecklist(updatedChecklist);
        const selected = updatedChecklist.filter((item) => item.isChecked).length;
        setSelectedChecklist(selected);
    };

    const handleChecklistToggle = (index) => {
        const updatedChecklist = [...checklist];
        updatedChecklist[index].isChecked = !updatedChecklist[index].isChecked;
        setChecklist(updatedChecklist);
        const selected = updatedChecklist.filter((item) => item.isChecked).length;
        setSelectedChecklist(selected);
    };

    useEffect(() => {
        // const fetchTasks = async () => {
        //     try {
        //         const token = localStorage.getItem('userToken');
        //         const response = await axios.get(`${backendBaseUrl}/tasks`, {
        //             headers: { Authorization: `Bearer ${token}` },
        //         });
        //     } catch (error) {
        //         console.error('Error fetching tasks:', error);
        //     }
        // };

        // fetchTasks();
    }, []);


    const handleSave = async () => {
        try {
            if(!title|| !priority || !checklist){
                toast.success("Please fill mandatory fields", {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    draggable: true,
                });
                return;
            }
            const token = localStorage.getItem("userToken");
            var body;
            if (dueDate) {
                body = {
                    title,
                    priority,
                    checklist,
                    dueDate
                }
            } else {
                body = {
                    title,
                    priority,
                    checklist
                };
            }
            console.log("body  "+body);
            const response = await axios.post(
                `${backendBaseUrl}/createTasks`,body,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            onTaskAdded();
            closeModal();
            console.log(response.data);
            toast.success("Task created successfully", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
            // alert("Task created");
        } catch (error) {
            toast.error("Failed to edit task. Make sure check list name added.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: true,
            });
            console.error('Error saving tasks:', error);
        }
    };

    return (
        <>
            <div className={isOpen ? styles.modalOpen : styles.modalClosed}>
                <div className={styles.modalContent}>
                    <div className={styles.topDiv}>
                        <div className={styles.modalTitleDiv}>
                            <p className={styles.modalTitle}>Title *</p>
                            <input
                                type="text"
                                placeholder="Enter Task Title"
                                className={styles.titleInput}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className={styles.priorityButtons}>
                            <span className={styles.modalPriority}>Select Priority * </span>
                            <button
                                className={priority === 'High' ? styles.selectedPriority : styles.priorityBtn}
                                onClick={() => setPriority('High')}
                            >
                                <div className={styles.colorDiv1}></div>
                                High Priority
                            </button>
                            <button
                                className={priority === 'Moderate' ? styles.selectedPriority : styles.priorityBtn}
                                onClick={() => setPriority('Moderate')}
                            >
                                <div className={styles.colorDiv2}></div>
                                Moderate Priority
                            </button>
                            <button
                                className={priority === 'Low' ? styles.selectedPriority : styles.priorityBtn}
                                onClick={() => setPriority('Low')}
                            >
                                <div className={styles.colorDiv3}></div>
                                Low Priority
                            </button>
                        </div>
                    </div>
                    <div className={styles.checklistData}>
                        <span className={styles.modalChecklist}>Checklist ({selectedChecklist}/{checklist.length})*</span>
                        <div className={styles.checklistInput}>
                            {checklist.map((item, index) => (
                                <div key={index} className={styles.inputDiv}>
                                    <input
                                        type="checkbox"
                                        checked={item.isChecked}
                                        onChange={() => handleChecklistToggle(index)}
                                        className={styles.checkBox}
                                    />
                                    <input
                                        type="text"
                                        value={item.text}
                                        onChange={(e) => handleChecklistChange(index, e.target.value)}
                                        className={styles.inputBox}
                                    />
                                    <img src={deleteIcon} alt='delete icon' onClick={() => handleRemoveChecklist(index)} className={styles.deleteIconBox} />
                                </div>
                            ))}
                            <button className={styles.addButton} onClick={handleAddChecklist}><img src={addLogo} alt="add logo" />
                                <p className={styles.addNew}>Add New</p>
                            </button>
                        </div>
                    </div>
                    <div className={styles.buttonDiv}>
                        <button onClick={handleClick} className={styles.dueDateBtn}>{dateShowInButton}</button>
                        <div className={styles.saveCancelBtn}>
                            <button onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
                            <button onClick={handleSave} className={styles.saveBtn}>Save</button>
                        </div>
                    </div>
                </div>
                <div className={styles.dateDiv}>
                    {showCalendar && (
                        <DatePicker
                            showIcon
                            selected={calenderDate}
                            onChange={handleChange}
                            inline
                            icon="fa fa-calender"
                        />
                    )}
                </div>
            </div >
        </>
    );
};

export default ToDoModal;
