const {
  createProfile,
  updateProfile,
  deleteProfile,
  login,
} = require("./Profile");
const { createClient, updateClient, deleteClient } = require("./Client");
const { createProject, updateProject, deleteProject } = require("./Project");
const {
  createSubproject,
  updateSubproject,
  deleteSubproject,
} = require("./Subproject");
const { createJournal, updateJournal, deleteJournal } = require("./Journal");

module.exports = {
  createProfile,
  updateProfile,
  deleteProfile,
  login,
  createClient,
  updateClient,
  deleteClient,
  createProject,
  updateProject,
  deleteProject,
  createSubproject,
  updateSubproject,
  deleteSubproject,
  createJournal,
  updateJournal,
  deleteJournal,
};
