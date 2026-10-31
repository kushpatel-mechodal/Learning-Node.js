import "dotenv/config";
import connectDB from "./db/db.js";
import app from "./app.js";
import user from "./models/user.models.js";

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    await user.describe(); //use describe for the read the table column infromation
    console.log(
      "user and video model connected with existing table successfully"
    );

    const port = process.env.PORT || 8000;

    app.on("error", (error) => {
      console.log("App is not connect to database", error.message);
      process.exit(1); //if any error then stop execution
    });

    app.listen(port, () => {
      console.log(`Server is running on PORT: ${port}`);
    });
  } catch (error) {
    console.log("Failed to connect database: ", error.message || error);
    process.exit(1); //if any error then stop execution
  }
};

startServer();
