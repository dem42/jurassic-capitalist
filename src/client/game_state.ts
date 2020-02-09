import Player from "../shared/player";
import Business from "../shared/business";

export default class GameState {
    readonly player: Player;
    readonly businesses: Business[];
    timeS: number;
    isDirty: boolean;

    constructor(player: Player, businesses: Business[], serverStartTimeS: number) {
        this.player = player;
        this.businesses = businesses;
        this.isDirty = false;
        this.timeS = serverStartTimeS;
    }
}