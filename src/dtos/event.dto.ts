export class EventDto {
  id = '';
  value: any;

  constructor(init: Partial<EventDto>) {
    Object.assign(this, init);
  }
}
