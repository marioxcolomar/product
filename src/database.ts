import Mongoose from "mongoose";
import "dotenv/config";

Mongoose.connect(process.env.MONGO_URI!);

Mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

export default Mongoose