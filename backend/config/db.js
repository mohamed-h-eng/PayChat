import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  try{
    await mongoose.connect(env.mongoUri);
    console.log(`Database connected: ${mongoose.connection.host}`);
  }catch(error){
    console.log("error")
  }
}
