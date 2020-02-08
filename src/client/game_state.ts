import Player from "../shared/player";
import Business from "../shared/business";

export default class GameState {
    readonly player: Player;
    readonly businesses: Business[];
    isDirty: boolean;

    constructor(player: Player, businesses: Business[]) {
        this.player = player;
        this.businesses = businesses;
        this.isDirty = false;
    }
}