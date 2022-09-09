import { Injectable } from '@nestjs/common';
import { db } from '../utils/firebase.js';
import { Title } from '../enums/title.enum.js';

@Injectable()
export class ModService {
  async clearTitle(id: string) {
    await db.users.doc(id).update('title', null);
  }

  async updateTitle(id: string, title: Title) {
    await db.users.doc(id).update('title', title);
  }
}
