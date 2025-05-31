const Task = require('../models/task');

/** GET /api/tasks
 * Retourne toutes les tâches de l’utilisateur connecté */
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort('-createdAt');
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

/** POST /api/tasks
 * Crée une nouvelle tâche pour l’utilisateur connecté */
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      user: req.userId,
      title: req.body.title,
      description: req.body.description,
      dueDate:  req.body.dueDate,
      priority: req.body.priority
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

/** GET /api/tasks/:id
 * Récupère une tâche spécifique */
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/tasks/:id
 * Met à jour une tâche existante */
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/tasks/:id
 * Supprime une tâche */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    next(err);
  }
};
