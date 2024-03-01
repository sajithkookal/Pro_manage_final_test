import React, { useState, useEffect } from 'react';
import styles from './ToDoEditModal.module.css';
import axios from 'axios';
import { BACKEND_URL } from "../../config/baseurl"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import deleteIcon from "../../assets/images/delete.svg"
import addLogo from "../../assets/images/add.svg"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ToDoEditModal = ({ isOpen, closeModal, onTaskAdded, task }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [checklist, setChecklist] = useState([]);
    const [dueDate, setDueDate] = useState(new Date());
    const [selectedChecklist, setSelectedChecklist] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setPriority(task.priority || '');
            setChecklist(task.checklist || []);
            setDueDate(task.dueDate ? new Date(task.dueDate) : new Date());
            const selected = (task.checklist || []).filter((item) => item.isChecked).length;
            setSelectedChecklist(selected);
        }
    }, [task]);

    const handleDateChange = (date) => {
        setDueDate(date);
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

    const handleEdit = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.put(
                `${BACKEND_URL}/tasks/${task._id}`,
                {
                    title,
                    priority,
                    checklist,
                    dueDate,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log("Respooncseeeeeeee",response.data);
            onTaskAdded();
            closeModal();
            toast.success("Task edited successfully", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
        } catch (error) {
            console.error('Error editing task:', error);
            toast.error("Failed to edit task. Please try again.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    return (
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
                    {showCalendar && (
                        <DatePicker
                            showIcon
                            selected={dueDate}
                            onChange={handleDateChange}
                            icon="fa fa-calender"
                        />
                    )}
                    <button onClick={toggleCalendar} className={styles.dueDateBtn}>Select Due Date</button>
                    <div className={styles.saveCancelBtn}>
                        <button onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
                        <button onClick={handleEdit} className={styles.saveBtn}>Save</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div >
    );
};

export default ToDoEditModal;
