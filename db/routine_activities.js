/* eslint-disable no-useless-catch */
const client = require("./client");

async function getRoutineActivityById(id) {
  try {
    const { rows } = await client.query(
      `
        SELECT *
        FROM routine_activities
        WHERE id=$1
        `,
      [id]
    );

    if(!rows.length) return null

    return rows;
  } catch (error) {
    throw error;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  duration,
  sets,
  reps,
}) {
  try {
    const {
      rows: [routineActivities],
    } = await client.query(
      `
        INSERT INTO routine_activities("routineId", "activityId", duration, sets, reps)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
      [routineId, activityId, duration, sets, reps]
    );

    return routineActivities;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity(fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
        UPDATE routine_activities
        SET ${setString}
        WHERE id=${fields.id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows: [routineActivity] } = await client.query(
      `
        SELECT *
        FROM routine_activities
        WHERE id=$1
        `,
      [id]
    );

    await client.query(
      `
        DELETE 
        FROM routine_activities
        WHERE id=$1;
        `,
      [id]
    );

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(
      `
        SELECT *
        FROM routine_activities
        WHERE "routineId"=$1
        `,
      [id]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
};