/* eslint-disable no-useless-catch */
const client = require("./client");

async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password) 
        VALUES($1, $2)  
        RETURNING id, username;
        `,
      [username, password]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUsername(id, username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        UPDATE users
        SET username=$1
        WHERE id=$2
        RETURNING id, username;
      `, [username, id]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function updatePassword(id, password) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        UPDATE users
        SET password=$1
        WHERE id=$2
        RETURNING id, username;
      `, [password, id]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT id, username
    FROM users
    WHERE username = $1
    AND password = $2
  `,
      [username, password]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, username
      FROM users
      WHERE id=$1
    `,
      [userId]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username=$1
      `,
      [username]
    );

    if (!user) return null;

    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(
      `SELECT id, username
          FROM users;
        `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  updateUsername,
  updatePassword,
  getUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
};