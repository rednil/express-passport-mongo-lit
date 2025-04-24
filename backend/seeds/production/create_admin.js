const bcrypt = require('bcrypt')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  //await knex('users').del()
  const admin = await knex('users').where({role: 'ADMIN'}).first()
  if(admin) return
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'admin'
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  await knex('users').insert([
    {
      username, 
      password: hash, 
      role: 'ADMIN', 
      created_at: new Date().getTime()
    },
  ]);
};
