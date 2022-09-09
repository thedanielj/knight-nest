export class NotificationEntity {
  id = '';
  type = '';
  value = '';

  constructor(init: Partial<NotificationEntity>) {
    Object.assign(this, init);
  }
}
