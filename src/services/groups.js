const GroupModel = require('../models/group.js')

function create(data) {
  return GroupModel.create(data)
}

function findById(id) {
  return GroupModel.findById(id)
}

function update(data) {
  return GroupModel.update(data)
}

function remove(id) {
  return GroupModel.remove(id)
}

module.exports = {
  create,
  findById,
  remove,
  update,
}
