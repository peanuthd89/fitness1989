/* eslint-disable no-useless-catch */
const client = require("./client");

async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        INSERT INTO activities(name, description) 
        VALUES($1, $2)  
        RETURNING *;
        `,
      [name, description]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(activityId) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        SELECT *
        FROM activities
        WHERE id=$1
      `,
      [activityId]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  try {
    const { rows } = await client.query(
      `SELECT *
          FROM activities;
        `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function updateActivity(fields = {}) {

  const setString = Object.keys(fields)
  .map((key, index) => `"${key}"=$${index + 1}`)
  .join(", ");
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const {
        rows: [activity],
      } = await client.query(
        `
          UPDATE activities
          SET ${setString}
          WHERE id=${fields.id}
          RETURNING *;
        `, Object.values(fields)
      );
  
      return activity;
    } catch (error) {
      throw error;
    }
}

module.exports = {
  createActivity,
  getActivityById,
  getAllActivities,
  updateActivity,
};