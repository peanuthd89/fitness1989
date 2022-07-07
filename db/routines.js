/* eslint-disable no-useless-catch */
const client = require("./client");

const { mapActivities } = require("./utils");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
          INSERT INTO routines("creatorId", "isPublic", name, goal) 
          VALUES($1, $2, $3, $4)  
          RETURNING *;
          `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(routineId) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
          SELECT *
          FROM routines
          WHERE routines.id=$1
          `,
      [routineId]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM routines
      `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT 
        routines.id AS id,
        users.id AS "creatorId",
        users.username AS "creatorName",
        routines."isPublic" AS "isPublic",
        routines.name AS name,
        routines.goal AS goal,
        activities.id AS "activitiesId",
        routine_activities.sets AS "activitySets",
        routine_activities.reps AS "activityReps",
        routine_activities.duration AS "activityDuration"
    FROM routines
    LEFT JOIN users ON routines."creatorId" = users.id
    LEFT JOIN routine_activities ON routines.id = routine_activities."routineId"
    LEFT JOIN activities ON routine_activities."activityId" = activities.id
    `);
    return mapActivities(rows);
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT 
        routines.id AS id,
        users.id AS "creatorId",
        users.username AS "creatorName",
        routines."isPublic" AS "isPublic",
        routines.name AS name,
        routines.goal AS goal,
        activities.id AS "activityId",
        activities.name AS "activityName",
        activities.description AS "activityDescription",
        routine_activities.sets AS "activitySets",
        routine_activities.reps AS "activityReps",
        routine_activities.duration AS "activityDuration"
    FROM routines
    LEFT JOIN users ON routines."creatorId" = users.id
    LEFT JOIN routine_activities ON routines.id = routine_activities."routineId"
    LEFT JOIN activities ON routine_activities."activityId" = activities.id
    WHERE routines."isPublic"=true
    `);

    return mapActivities(rows);
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
    SELECT 
        routines.id AS id,
        users.id AS "creatorId",
        users.username AS "creatorName",
        routines."isPublic" AS "isPublic",
        routines.name AS name,
        routines.goal AS goal,
        activities.id AS "activityId",
        activities.name AS "activityName",
        activities.description AS "activityDescription",
        routine_activities.sets AS "activitySets",
        routine_activities.reps AS "activityReps",
        routine_activities.duration AS "activityDuration"
    FROM routines
    LEFT JOIN users ON routines."creatorId" = users.id
    LEFT JOIN routine_activities ON routines.id = routine_activities."routineId"
    LEFT JOIN activities ON routine_activities."activityId" = activities.id
    WHERE users.username=$1

    `,
      [username]
    );
    return mapActivities(rows);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT 
          routines.id AS id,
          users.id AS "creatorId",
          users.username AS "creatorName",
          routines."isPublic" AS "isPublic",
          routines.name AS name,
          routines.goal AS goal,
          activities.id AS "activityId",
        activities.name AS "activityName",
        activities.description AS "activityDescription",
        routine_activities.sets AS "activitySets",
        routine_activities.reps AS "activityReps",
          routine_activities.duration AS "activityDuration"
      FROM routines
      LEFT JOIN users ON routines."creatorId" = users.id
      LEFT JOIN routine_activities ON routines.id = routine_activities."routineId"
      LEFT JOIN activities ON routine_activities."activityId" = activities.id
      WHERE users.username=$1
      AND routines."isPublic"=true
      `,
      [username]
    );
    return mapActivities(rows);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(
      `
      SELECT 
          routines.id AS id,
          users.id AS "creatorId",
          users.username AS "creatorName",
          routines."isPublic" AS "isPublic",
          routines.name AS name,
          routines.goal AS goal,
          activities.id AS "activityId",
        activities.name AS "activityName",
        activities.description AS "activityDescription",
        routine_activities.sets AS "activitySets",
        routine_activities.reps AS "activityReps",
          routine_activities.duration AS "activityDuration"
      FROM routines
      LEFT JOIN users ON routines."creatorId" = users.id
      LEFT JOIN routine_activities ON routines.id = routine_activities."routineId"
      LEFT JOIN activities ON routine_activities."activityId" = activities.id
      WHERE activities.id=$1
      AND routines."isPublic"=true
      `,
      [id]
    );
    return mapActivities(rows);
  } catch (error) {
    throw error;
  }
}

async function updateRoutine(fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        UPDATE routines
        SET ${setString}
        WHERE id=${fields.id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        SELECT *
        FROM routines
        WHERE id=$1
        `,
      [id]
    );

    await client.query(
      `
    DELETE
    FROM routines
    WHERE id=$1;
    `,
      [id]
    );

    await client.query(
      `
    DELETE
    FROM routine_activities
    WHERE "routineId"=$1;
    `,
      [id]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRoutine,
  getRoutinesWithoutActivities,
  getRoutineById,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  updateRoutine,
  destroyRoutine,
};