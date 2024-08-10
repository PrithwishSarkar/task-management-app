const Task = require('../models/task');
const xlsx = require('xlsx');
const fs = require('fs');

const task_index = async (req, res) => {

    try {
        const data = await Task.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const task_create_post = async (req, res) => {

    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const task_delete = async (req, res) => {

    try {
        const id = req.params.id;
        const afterDelete = await Task.findByIdAndDelete(id);
        res.json(afterDelete);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const task_update_status = async (req, res) => {
    try {
        const id = req.params.id;
        const newStatus = req.body.status;
        const updatedTask = await Task.findByIdAndUpdate(id, { status: newStatus }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}



const task_upload_excel = async (req, res) => {
    try {
        const file = req.file;
        const workbook = xlsx.readFile(file.path);
        const sheetNames = workbook.SheetNames;
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

        for (const row of data) {
            const { title, description, status, pdflink } = row;
            const newTask = new Task({ title, description, status, pdflink });
            await newTask.save();
        }

        res.send('Excel file uploaded, parsed, and tasks saved successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    task_index,
    task_update_status,
    task_create_post,
    task_delete,
    task_upload_excel
};