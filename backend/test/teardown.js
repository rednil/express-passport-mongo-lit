const knex = require("../helpers/knex")

after(async () => {  
  await knex.destroy()
})