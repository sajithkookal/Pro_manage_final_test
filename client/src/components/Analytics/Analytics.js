import React, { useState, useEffect } from "react";
import styles from "./Analytics.module.css";
import axios from 'axios';
import { backendBaseUrl } from "../../config/baseurl"

function AnalyticsContent() {
    
     const [counts, setCounts] = useState({});
   

    const fetchTaskCountData = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get(`${backendBaseUrl}/tasksAnalytics`,
            {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data);
            console.log("response.data");

            setCounts(response.data.counts);

        } catch (error) {
             alert(error.response.data.error);
            console.error('Error fetching task:', error);
        }
    };

    useEffect(() => {
        // const storedCounts = localStorage.getItem("statusCounts");
        // const storedPriorityCounts = localStorage.getItem("priorityCounts");
        // if (storedCounts) {
        //     setStatusCounts(JSON.parse(storedCounts));
        // }
        // if (storedPriorityCounts) {
        //     const parsedPriorityCounts = JSON.parse(storedPriorityCounts);
        //     setPriorityCounts(parsedPriorityCounts);

        //     // Calculate the sum of all priorities for due date tasks
        //     const sumOfPriorities = Object.values(parsedPriorityCounts).reduce((acc, count) => acc + count, 0);
        //     setDueDateTasks(sumOfPriorities);
        // }
        fetchTaskCountData();
    }, []);

    return (
        <div className={styles.analyticsScreen}>
        <h1 className={styles.analyticsTitle}>Analytics</h1>
        <div className={styles.analyticsContent}>
            <div className={styles.analyticsData}>
                <div className={styles.analyticsRow}>
                    <div className={styles.dataName}>
                        <div className={styles.bullet}></div>
                        <p>Backlog Tasks</p>
                    </div>
                    <p className={styles.analyticsNumbers}>{counts.backlog || 0}</p>
                </div>
                <div className={styles.analyticsRow}>
                    <div className={styles.dataName}>
                        <div className={styles.bullet}></div>
                        <p>To-do Tasks</p>
                    </div>
                    <p className={styles.analyticsNumbers}>{counts.todo || 0}</p>
                </div>
                <div className={styles.analyticsRow}>
                    <div className={styles.dataName}>
                        <div className={styles.bullet}></div>
                        <p>In-Progress Tasks</p>
                    </div>
                    <p className={styles.analyticsNumbers}>{counts.inProgress || 0}</p>
                </div>
                <div className={styles.analyticsRow}>
                    <div className={styles.dataName}>
                        <div className={styles.bullet}></div>
                        <p>Completed Tasks</p>
                    </div>
                    <p className={styles.analyticsNumbers}>{counts.completed || 0}</p>
                </div>

            </div>
            <div className={styles.analyticsData}>
            <div className={styles.analyticsRow}>
                    <div className={styles.dataName}>
                        <div className={styles.bullet}></div>
                        <p>Low Priority</p>
                    </div>
                    <p className={styles.analyticsNumbers}>{counts.lowPriority  || 0}</p>
                </div>
                <div className={styles.analyticsRow}>
                    <div className={styles.dataName}>
                        <div className={styles.bullet}></div>
                        <p>Moderate Priority</p>
                    </div>
                    <p className={styles.analyticsNumbers}>{counts.moderatePriority || 0}</p>
                </div>
                <div className={styles.analyticsRow}>
                    <div className={styles.dataName}>
                        <div className={styles.bullet}></div>
                        <p>High Priority</p>
                    </div>
                    <p className={styles.analyticsNumbers}>{counts.highPriority || 0}</p>
                </div>
                <div className={styles.analyticsRow}>
                    <div className={styles.dataName}>
                        <div className={styles.bullet}></div>
                        <p>Due Date Tasks</p>
                    </div>
                    <p className={styles.analyticsNumbers}>{counts.dueDate}</p>
                </div>
            </div>
        </div>
    </div>
    );
}

export default AnalyticsContent;
