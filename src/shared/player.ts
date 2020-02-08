export default class Player {
    cash: number;    

    constructor (cash: number) {
        this.cash = cash;
    }

    static from(p: Player) : Player {
        const np = new Player(p.cash);
        return np;
    }
}