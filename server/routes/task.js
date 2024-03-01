const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');
const isLoggedIn = require("../middleware/requireAuth");

// Route to create a new task
router.post('/tasks', isLoggedIn, async (req, res) => {
    try {
        const { title, priority, checklist, dueDate } = req.body;
        const createdBy = req.user._id;
        const task = new Task({ title, priority, checklist, dueDate, createdBy });
        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Route to fetch all tasks
router.get('/tasks', isLoggedIn, async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id });
        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to get tasks' });
    }
});

// Route to update completed checklist
router.put('/tasks/:taskId', isLoggedIn, async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { isChecked } = req.body;

        // Update the task's isChecked status
        const updatedTask = await Task.findByIdAndUpdate(taskId, { isChecked }, { new: true });

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Route to update task status
router.put('/tasks/:taskId/status', async (req, res) => {
    const taskId = req.params.taskId;
    const { status } = req.body;

    try {
        // Find the task by ID
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Update the task status
        task.status = status;

        await task.save();

        res.json({ message: 'Task status updated successfully', task });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Task update failed' });
    }
});

// Route to update a task by ID
router.put('/updateTasks/:taskId', isLoggedIn, async (req, res) => {
    const taskId = req.params.taskId;
    const { title, priority, checklist, dueDate } = req.body;

    try {
        // Find the task by ID
        let task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        // Update task fields
        task.title = title;
        task.priority = priority;
        task.checklist = checklist;
        task.dueDate = dueDate;

        await task.save();

        // Response with updated task
        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to delete task
router.delete('/deleteTask/:taskId', isLoggedIn, async (req, res) => {
    try {
        const taskId = req.params.taskId;

        // find id and delete
        const item = await Task.findByIdAndDelete(taskId);
        if (!item) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task Deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Route for Analytics
router.get('/tasksAnalytics', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const counts = {
            backlog: await Task.countDocuments({ status: "backlog", createdBy: userId }),
            todo: await Task.countDocuments({ status: "todo", createdBy: userId }),
            inProgress: await Task.countDocuments({ status: "progress", createdBy: userId }),
            completed: await Task.countDocuments({ status: "done", createdBy: userId }),
            lowPriority: await Task.countDocuments({ priority: 'Low', createdBy: userId }),
            moderatePriority: await Task.countDocuments({ priority: 'Moderate', createdBy: userId }),
            highPriority: await Task.countDocuments({ priority: 'High', createdBy: userId }),
            dueDate: await Task.countDocuments({ dueDate: { $exists: true }, createdBy: userId })
        };
        res.status(200).json({ counts });
    } catch (error) {
        console.error('Error fetching Analytics:', error);
        res.status(500).json({ error: 'Failed to get Analytics Data' });
    }
});

// Route for Analytics
router.get('/tasksFilter', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const { type } = req.query;
        let startDate;

        switch (type) {
            case 'today':
                endDate = new Date(); // Current date and time
                startDate = new Date(endDate.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago
                break;
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);// 7 days ago
                break;
            case 'month':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);// 30 days ago
                break;
            default:
                return res.status(400).json({ error: 'Invalid period' });
        }
        const items = await Task.find({
            createdBy: userId,
            createdAt: { $gte: startDate }
        });
        res.status(200).json({
            status: "success",
            results: items.length,
            data: {
                items,
            },
        });
    } catch (error) {
        console.error('Error filtering:', error);
        res.status(500).json({ error: 'Failed to get filter Data' });
    }
});
module.exports = router;