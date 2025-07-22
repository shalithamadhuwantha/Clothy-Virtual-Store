import mongoose from 'mongoose';

// TODO: Replace with your actual MongoDB URI
const MONGODB_URI = 'mongodb+srv://web256:Test_852@cluster1.tpzrea5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect; 