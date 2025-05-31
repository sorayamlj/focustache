const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true           // chaque tâche appartient à un utilisateur
  },
  title: {
    type: String,
    required: true,          // titre obligatoire
    trim: true
  },
  description: {
    type: String,
    default: ''              // champ optionnel
  },
  dueDate: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['haute', 'moyenne', 'basse'],
    default: 'moyenne'
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true           // createdAt / updatedAt
});

module.exports = mongoose.model('Task', taskSchema);
