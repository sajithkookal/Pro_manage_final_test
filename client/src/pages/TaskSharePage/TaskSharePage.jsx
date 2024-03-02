
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendBaseUrl } from "../../config/baseurl";
import axios from "axios";
import TaskShare from "../../components/TaskShare/TaskShare.jsx"; // Import TaskCard component

const TaskSharePage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`${backendBaseUrl}/taskEditData/${taskId}`);
                console.log(response.data);
                setTask(response.data.task);
            } catch (error) {
                alert(error.response.data.error);
                console.error("Error fetching task:", error);
            }
        };
        fetchTask();
    }, [taskId]);

    return (
        <div>
            {task && <TaskShare task={task} />} {/* Render TaskCard with fetched task data */}
        </div>
    );
};

export default TaskSharePage;