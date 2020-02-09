import Business from '../../shared/business';
import GameState from '../game_state';
import { setHtmlElementActive, formatMoney } from '../utils';

export interface ManagerSelectionView {
    managersList: HTMLUListElement;
    managerEntries: HTMLLIElement[];
}

export const createManagersHtml = (gameState: GameState) : ManagerSelectionView => {
    const managersList = document.createElement('ul') as HTMLUListElement;
    const managerEntries: HTMLLIElement[] = [];
    
    for (let business of gameState.businesses) {        
        const managerEntry = document.createElement('li');        
        managerEntry.textContent = `${business.name} manager: $${formatMoney(business.manager.price)}`;

        managerEntry.addEventListener("click", () => {
            console.log("bought manager");
            if (gameState.player.cash >= business.manager.price) {
                gameState.player.cash -= business.manager.price;
                business.manager.isOwned = true;
                gameState.isDirty = true;
            }
        });
        managersList.appendChild(managerEntry);
        if (business.manager.isOwned && business.manager.deactivated) {
            setHtmlElementActive(managerEntry, false);
        }
        managerEntries.push(managerEntry as HTMLLIElement);
    }

    return {
        managersList: managersList,
        managerEntries: managerEntries
    };
}

export const renderManagersList = (businesses: Business[], managersView: ManagerSelectionView) => {
    for (let i=0; i<businesses.length; i++) {
        if (businesses[i].manager.isOwned && !businesses[i].manager.deactivated) {
            businesses[i].manager.deactivated = true;
            managersView.managerEntries[i].classList.add("inactive");
        }
    }
}