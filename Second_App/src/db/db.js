import "dotenv/config";
import { Sequelize } from "sequelize";

//configure the sequelize with mysql database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, //use for terminal to print or not sql queries
  }
);
const connectDB = async () => {
  try {
    await sequelize.authenticate(); //use authentication method for check if database is connected or not
    console.log("Database connected to server: ", process.env.DB_HOST);
    return sequelize;
  } catch (error) {
    console.error("Failed to connect to MySQL database:", error.message || error);
    process.exit(1);
  }
};

export default connectDB;
export { sequelize };
