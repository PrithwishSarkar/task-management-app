const express = require('express');
const taskController = require('../controllers/taskController')
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/', taskController.task_index);

router.post('/', taskController.task_create_post);

router.delete('/:id', taskController.task_delete);

router.patch('/:id', taskController.task_update_status);

router.post('/upload', upload.single('file'), taskController.task_upload_excel);

module.exports = router;