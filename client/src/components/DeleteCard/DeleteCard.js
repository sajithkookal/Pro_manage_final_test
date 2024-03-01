import React from 'react';
import styles from './DeleteCard.module.css';

const DeleteCard = ({ isOpen, closeModal, onDeleteConfirm }) => {
    return (
        <>
            {isOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.text}>Are you sure you want to delete?</h3>
                        <div className={styles.buttons}>
                            <button className={styles.deleteBtn} onClick={onDeleteConfirm}>Yes, Delete</button>
                            <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteCard;
