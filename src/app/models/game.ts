import { IModus } from './IModus';
import { IVocList } from './IVocList';

export class Game{
  matchId: string;
  startedFrom: string;
  user: string;
  enemy: string;
  pointsEnemy: number;
  pointsUser: number;
  round: number;
  started: boolean;
  userTurn: boolean;
  playing: boolean;
  voc: string[];
  trans: string[];
  finished: boolean;
  isCorrect: boolean[];
  showedGameStats: boolean;
  result: string;
  vocName: string;
  time: any;
  enemyUID: string;
  // modus?: IModus;
  placeholderVoc?: string[];
  allVoc?: IVocList[];
}
