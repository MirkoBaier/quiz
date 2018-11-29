export class Game{
  matchId: string;
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
}
