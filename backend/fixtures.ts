import mongoose from "mongoose";
import config from "./config";
import crypto from "crypto";
import User from "./models/User";
import Post from "./models/Post";

const dropCollection = async (db: mongoose.Connection, collectionName: string) => {
  try {
    await db.dropCollection(collectionName);
  } catch (e) {
    console.log(`Collection ${collectionName} was missing, skipping drop...`);
  }
};

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  const collections = ['users', 'posts'];

  for (const collectionName of collections) {
    await dropCollection(db, collectionName);
  }

  const [user1, user2, admin1, admin2] = await User.create(
    {
      email: 'user1@posts.com',
      password: '123456',
      token: crypto.randomUUID(),
      displayName: 'User1',
      role: 'user',
    }, {
      email: 'user2@posts.com',
      password: '123456',
      token: crypto.randomUUID(),
      displayName: 'User2',
      role: 'user',
    }, {
      email: 'admin1@posts.com',
      password: '123456',
      token: crypto.randomUUID(),
      displayName: 'Admin1',
      role: 'admin',
    }, {
      email: 'admin2@posts.com',
      password: '123456',
      token: crypto.randomUUID(),
      displayName: 'Admin2',
      role: 'admin',
    },
  );

  await Post.create({
      user: admin1._id,
      image: 'fixtures/flower.jpg',
      name: 'flower',
      published: true,
    }, {
      user: user1._id,
      image: 'fixtures/tiger.jpg',
      name: 'wild cat',
      published: true,
    }, {
      user: user1._id,
      image: 'fixtures/puppy.jpg',
      name: 'hommy',
      published: false,
    }, {
      user: user2._id,
      image: 'fixtures/lion.jpg',
      name: 'wild nature',
      published: true,
    }, {
      user: user2._id,
      image: 'fixtures/see.jpg',
      name: 'beautiful nature',
      published: true,
    }, {
      user: user2._id,
      image: 'fixtures/mountain.jpg',
      name: 'snow mountain',
      published: false,
    }
  );

  await db.close();
};

run().catch(console.error);
