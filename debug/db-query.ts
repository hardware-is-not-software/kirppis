import mongoose from 'mongoose';
import { config } from '../config/env';

async function queryDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${config.mongoUri}`);
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Get all collections
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in the database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Query each collection and show sample documents
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`\nDocuments in ${collectionName}:`);
      
      const documents = await mongoose.connection.db.collection(collectionName).find({}).limit(5).toArray();
      console.log(JSON.stringify(documents, null, 2));
      console.log(`Total documents in ${collectionName}: ${await mongoose.connection.db.collection(collectionName).countDocuments()}`);
    }

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

queryDatabase(); 