import mysql from "mysql2/promise"; //import mysql package

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Database connected to server:", connection.config.host);
  } catch (error) {
    console.log("Failed to connect mongodb", error.message);
    process.exit(1);
  }
};

export default connectDB;
