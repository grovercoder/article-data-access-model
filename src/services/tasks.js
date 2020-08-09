const TaskModel = require('../models/task.js')

function valid(data) {
  // We will leave validation to you to implement if you'd like
  return true
}

function create(data) {
  if (!valid(data)) {
    throw new Error('invalid data')
  }
  return TaskModel.create(data)
}

function findById(id) {
  return TaskModel.findById(id)
}

function update(data) {
  if (!valid(data)) {
    throw new Error('invalid data')
  }
  return TaskModel.update(data)
}

function remove(id) {
  return TaskModel.remove(id)
}

function markAllTasksCompleted() {
  return TaskModel.completeAll()
}

module.exports = {
  create,
  findById,
  markAllTasksCompleted,
  remove,
  update,
}
