import { v4 as uuidv4 } from 'uuid';

export function getUniqIdValue() {
  // important: generate unique identifier for entities
  // note: this function does NOT check uniqueness in DB
  // nota bene: e-mail uniqueness is guaranteed by UNIQUE INDEX
  return uuidv4();
}
