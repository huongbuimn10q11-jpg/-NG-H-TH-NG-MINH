
export enum StageType {
  ANALOG = 'ANALOG',
  DIGITAL = 'DIGITAL',
  APPLICATION = 'APPLICATION'
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  stars: number;
  completedStages: string[];
}

export interface Question {
  id: string;
  stageId: number;
  type: 'select' | 'clock-adjust' | 'match' | 'activity';
  questionText: string;
  hour: number;
  minute: number;
  options?: any[];
  correctAnswer: any;
  hint: string;
  imageUrl?: string;
}

export interface GameState {
  currentPlayer: Player | null;
  currentStage: number;
  currentQuestionIndex: number;
  score: number;
  isGameOver: boolean;
}
