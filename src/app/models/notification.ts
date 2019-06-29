import { IVocList } from './IVocList';

export class Notification{
  requestedMatch: boolean;
  round: number;
  enemyUID: string;
  matchId: string;
  user: string;
  enemy: string;
  status: string;
  vocabluar?: IVocList[];
}
