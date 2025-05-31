const express = require('express');
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Toutes les routes suivent authMiddleware pour être protégées
router.use(authMiddleware);

router
  .route('/')
  .get(getTasks)      // GET /api/tasks
  .post(createTask);  // POST /api/tasks

router
  .route('/:id')
  .get(getTaskById)   // GET /api/tasks/:id
  .put(updateTask)    // PUT /api/tasks/:id
  .delete(deleteTask);// DELETE /api/tasks/:id

module.exports = router;
