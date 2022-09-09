import { UserEntity } from '../entities/user.entity.js';
import {
  getFirestore,
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
} from 'firebase-admin/firestore';
import { cert, initializeApp } from 'firebase-admin/app';
import { PostEntity } from '../entities/post.entity.js';
import { getStorage } from 'firebase-admin/storage';
import config from '@conf' assert { type: 'json' };

initializeApp({
  credential: cert({
    projectId: config.projectId,
    clientEmail: config.clientEmail,
    privateKey: config.privateKey,
  }),
  storageBucket: 'igneous-study-341611.appspot.com',
});

const converter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: WithFieldValue<T>) => data as DocumentData,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) =>
  getFirestore().collection(collectionPath).withConverter(converter<T>());

const db = {
  users: dataPoint<UserEntity>('users'),
  posts: dataPoint<PostEntity>('posts'),
};

const bucket = getStorage().bucket();

export { db, bucket };
