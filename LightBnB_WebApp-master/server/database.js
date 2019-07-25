const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

pool.connect((error) => {
  if (error) throw error;
  console.log('Connected to the LightBnB database');
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  const queryConfig = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email]
  }

  return pool.query(queryConfig)
    .then((response) => {
      if (response.rows[0]) {
        return response.rows[0];
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error('query error', error.stack);
    });

  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  const queryConfig = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [id]
  }

  return pool.query(queryConfig)
    .then((response) => {
      if (response.rows[0]) {
        return response.rows[0];
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error('query error', error.stack);
    });

  return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {

  const queryConfig = {
    text: 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;',
    values: [user.name, user.email, user.password]
  }

  return pool.query(queryConfig)
    .then((response) => {
      if (response.rows[0]) {
        console.log('successfully added new user to lightbnb');
        return response.rows[0];
      } else {
        return null
      }
    })
    .catch((error) => {
      console.error('query error', error.stack);
    });

  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryConfig = {
    text: `
    SELECT properties.*, reservations.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1 
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
    `,
    values: [guest_id, limit]
  }

  return pool.query(queryConfig)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.error('query error', error.stack);
    })


  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) {
  const queryConfig = {
    text: 'SELECT * FROM properties LIMIT $1',
    values: [limit]
  }

  return pool.query(queryConfig)
    .then((response) => {
      return response.rows;
    })
    .catch((error) => {
      console.error('query error', error.stack);
    });

  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;