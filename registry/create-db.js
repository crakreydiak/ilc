const knex = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

(async () => {
  try {
    await knex.raw("CREATE DATABASE IF NOT EXISTS ilc");
    console.log("db created");
  } catch (err) {
    console.error(err);
  } finally {
    await knex.destroy();
  }
})();
