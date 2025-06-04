import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("db connected", conn.connection.host);
  } catch (err) {
    console.log("db connection failed", err);
    process.exit(1);
  }
};
export default dbConnect;
