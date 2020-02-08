import Business from '../../shared/business';
import Player from '../../shared/player';
import GameState from '../game_state';

export interface UpgradesSelectionView {
    upgradesList: HTMLUListElement;
    upgradeEntries: HTMLLIElement[];
}

export const createUpgradesHtml = (gameState: GameState) : UpgradesSelectionView => {
    const upgradesList = document.createElement('ul') as HTMLUListElement;
    const upgradeEntries: HTMLLIElement[] = [];
    
    for (let business of gameState.businesses) {        
        const upgradeEntry = document.createElement('li');        
        upgradeEntry.textContent = `${business.name} upgrade: $${business.upgrade.cost}`;

        upgradeEntry.addEventListener("click", () => {
            console.log("upgraded");
            if (gameState.player.cash >= business.upgrade.cost) {
                gameState.player.cash -= business.upgrade.cost;
                business.upgrade.isUpgraded = true;
                gameState.isDirty = true;
            }
        });
        upgradesList.appendChild(upgradeEntry);
        upgradeEntries.push(upgradeEntry as HTMLLIElement);
    }

    return {
        upgradesList: upgradesList,
        upgradeEntries: upgradeEntries
    };
}

export const renderUpgradesList = (businesses: Business[], upgradesView: UpgradesSelectionView) => {
    for (let i=0; i<businesses.length; i++) {
        if (businesses[i].upgrade.isUpgraded && !businesses[i].upgrade.deactivated) {
            businesses[i].upgrade.deactivated = true;
            upgradesView.upgradeEntries[i].classList.add("inactive");
        }
    }
}