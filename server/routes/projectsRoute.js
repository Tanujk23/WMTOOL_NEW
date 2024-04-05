const router = require("express").Router();
const Project = require("../models/projectModel");
const authMiddleware = require("../middlewares/authMiddleware");

//create a project
router.post("/create-project", authMiddleware, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.send({
      success: true,
      data: newProject,
      message: "Project created succesfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//get all projects
router.post("/get-all-projects", authMiddleware, async (req, res) => {
  try {
    const filters = req.body.filters;
    const projects = await Project.find(filters || {}).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//get projects by role
router.post("/get-projects-by-role", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const projects = await Project.find({ "members.user": userId }).sort({
      createdAt: -1,
    });
    res.send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//edit a project
router.post("/edit-project", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      success: true,
      message: "Project updated successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//delete a project
router.post("/delete-project", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

module.exports = router;
