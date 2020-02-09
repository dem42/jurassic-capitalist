import Player from '../../shared/player';
import GameState from '../game_state';
import { formatMoney } from '../utils';

export interface PlayerView {
    moneyText: Node;
}

export const createPlayerHtml = (gameState: GameState) : PlayerView => {
    const moneyText = document.createElement('div');
    moneyText.textContent = `$${gameState.player.cash.toString()}`;
    return {
        moneyText: moneyText
    };
}

export const renderPlayer = (player: Player, playerView: PlayerView) => {
    playerView.moneyText.textContent = `$${formatMoney(player.cash)}`;
}