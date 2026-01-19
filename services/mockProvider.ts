
import { Player, Question } from '../types';
import { SEED_PLAYERS, INITIAL_QUESTIONS } from '../constants';

const STORAGE_KEYS = {
  PLAYERS: 'hoc_xem_gio_players',
  QUESTIONS: 'hoc_xem_gio_questions',
};

export const dataProvider = {
  getPlayers: (): Player[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(SEED_PLAYERS));
      return SEED_PLAYERS;
    }
    return JSON.parse(stored);
  },

  savePlayer: (player: Player) => {
    const players = dataProvider.getPlayers();
    const index = players.findIndex(p => p.id === player.id);
    if (index >= 0) {
      players[index] = player;
    } else {
      players.push(player);
    }
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  },

  deletePlayer: (id: string) => {
    const players = dataProvider.getPlayers().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  },

  clearPlayers: () => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify([]));
  },

  resetPlayers: () => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(SEED_PLAYERS));
  },

  getQuestions: (): Question[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
      return INITIAL_QUESTIONS;
    }
    return JSON.parse(stored);
  },

  updateQuestions: (questions: Question[]) => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }
};
