export default class Manager {
    readonly price: number;
    isOwned: boolean;
    deactivated: boolean;

    constructor(price: number) {
        this.price = price;
        this.isOwned = false;
        this.deactivated = false;
    }

    static from(m: Manager) : Manager {
        const nm = new Manager(m.price);
        nm.deactivated = m.deactivated;
        nm.isOwned = m.isOwned;
        return nm;
    }
}