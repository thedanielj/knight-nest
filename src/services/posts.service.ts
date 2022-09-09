import { Injectable } from '@nestjs/common';
import { db } from '../utils/firebase.js';
import { QuerySnapshot, FieldValue } from 'firebase-admin/firestore';
import { PostEntity } from '../entities/post.entity.js';
import { UserEntity } from '../entities/user.entity.js';

@Injectable()
export class PostsService {
  async get(
    limit: number,
    before: string,
    sort: string,
    reverse: boolean | undefined,
  ): Promise<PostEntity[]> {
    let collection;

    if (!sort) {
      collection = db.posts;
    } else {
      collection = db.posts.orderBy(sort, reverse ? 'desc' : 'asc');
    }

    let snapshot: QuerySnapshot;

    if (!before) {
      snapshot = await collection.limit(limit).get();
    } else {
      const beforePost = await db.posts.doc(before).get();
      snapshot = await collection.startAfter(beforePost).limit(limit).get();
    }

    const posts: PostEntity[] = [];

    snapshot.forEach((doc) => {
      posts.push(doc.data() as PostEntity);
    });

    return posts;
  }

  async create(userId: string, content: string) {
    const collection = db.posts;
    const docs = await collection.listDocuments();
    const id = (docs.length + 1).toString();

    const post: PostEntity = {
      author: userId,
      content: content,
      created_at: Math.round(new Date().getTime() / 1000),
      edited_at: null,
      id: id,
      likes: [],
    };

    await collection.doc(id).set(post);
    await db.users.doc(userId).update('posts', FieldValue.arrayUnion(id));
  }

  async getById(id: string): Promise<PostEntity | undefined> {
    const doc = await db.posts.doc(id).get();
    return doc.data() as PostEntity;
  }

  async like(user: UserEntity, post: PostEntity) {
    await db.posts.doc(post.id).update('likes', FieldValue.arrayUnion(user.id));
    await db.users.doc(user.id).update('likes', FieldValue.arrayUnion(post.id));
  }

  async unlike(user: UserEntity, post: PostEntity) {
    await db.posts
      .doc(post.id)
      .update('likes', FieldValue.arrayRemove(user.id));
    await db.users
      .doc(user.id)
      .update('likes', FieldValue.arrayRemove(post.id));
  }

  async delete(userId: string, postId: string) {
    await db.posts.doc(postId).delete();
    await db.users.doc(userId).update('posts', FieldValue.arrayRemove(postId));
  }

  async edit(id: string, content: string) {
    const editedPost = {
      content: content,
      edited_at: Math.round(new Date().getTime() / 1000),
    };

    await db.posts.doc(id).update(editedPost);
  }
}
