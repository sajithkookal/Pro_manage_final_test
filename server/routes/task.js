const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');
const isLoggedIn = require("../middleware/requireAuth");

// Route to create a new task
router.post('/createTasks', isLoggedIn, async (req, res) => {
    try {
        const { title, priority, checklist } = req.body;

        const createdBy = req.user._id;
        if(req.body.dueDate){
            const { dueDate } = req.body;
            const task = new Task({ title, priority, checklist, dueDate, createdBy });
            await task.save();
        }else{
            const task = new Task({ title, priority, checklist, createdBy });
            await task.save();
        }
        
       
        res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Route to get edit data
router.get('/taskEditData/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId);
        res.status(200).json({ task });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to get task data' });
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
router.put('/tasks/:taskId/:checkListId', isLoggedIn, async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const checkListId = req.params.checkListId;
        const { isChecked } = req.body;

        // Find the task by ID and update the isChecked field of the checklist item
        const task = await Task.findByIdAndUpdate(
            taskId,
            {
                $set: { 'checklist.$[elem].isChecked': isChecked }
            },
            {
                new: true, // Return the updated document
                arrayFilters: [{ 'elem._id': checkListId }] // Match checklist item by its _id
            }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
       
        res.status(200).json({ message: 'Task updated successfully', task: task });

    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update checklist' });
    }
});

// Route to update task status
router.put('/taskStatusUpdate/:taskId', async (req, res) => {
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
            dueDate: await Task.countDocuments({ dueDate: { $ne: null }, createdBy: userId })
        };
        res.status(200).json({ counts });
    } catch (error) {
        console.error('Error fetching Analytics:', error);
        res.status(500).json({ error: 'Failed to get Analytics Data' });
    }
});

// Route for task filter
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
            case 'thisWeek':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);// 7 days ago
                break;
            case 'thisMonth':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);// 30 days ago
                break;
            default:
                return res.status(400).json({ error: 'Invalid period selected' });
        }
        const items = await Task.find({
            createdBy: userId,
            createdAt: { $gte: startDate }
        });
        if (!items) {
            items = [];
        }
        res.status(200).json({
            status: "success",
            results: items.length,
            tasks: items,

        });
    } catch (error) {
        console.error('Error filtering:', error);
        res.status(500).json({ error: 'Failed to get filter Data' });
    }
});
module.exports = router;