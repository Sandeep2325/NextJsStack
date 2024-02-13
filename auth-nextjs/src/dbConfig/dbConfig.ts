import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDb connected successfully");
    });
    connection.on("error", (err) => {
      console.log(
        "MongoDb connection error. Please make sure Mongodb is runnin. " + err
      );
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong");
    console.error(error);
  }
}
