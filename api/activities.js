const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");
const { requireUser } = require("./utils");

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();

    res.send(allActivities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const activitiesData = {
      name,
      description,
    };
    const activities = await createActivity(activitiesData);

    res.send(activities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  const updateFields = {
    id: activityId,
    name,
    description,
  };

  try {
    const updatedActivity = await updateActivity(updateFields);

    res.send(updatedActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;

  const activityObj = {
    id: activityId,
  };

  try {
    const activities = await getPublicRoutinesByActivity(activityObj);

    res.send(activities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = activitiesRouter;