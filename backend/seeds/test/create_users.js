const bcrypt = require('bcrypt')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await insertUser(knex, 'admin', 'adminpass', 'ADMIN')
  await insertUser(knex, 'user', 'userpass')
};

async function insertUser(knex, username, password, role='USER'){
  await knex('users').insert([
    {
      username,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
      role
    },
  ])
}