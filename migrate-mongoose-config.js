
require("dotenv").config()


module.exports = {
    mongodb: {
      url: process.env.MONGO_URL, 
      options: {},
    },
    migrationsDir: './migrations', 
  };
  