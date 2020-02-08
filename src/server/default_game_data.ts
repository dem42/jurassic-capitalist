import Business from '../shared/business';
import Player from '../shared/player';
import Manager from '../shared/manager';
import Upgrade from '../shared/upgrade';

export default {
    initialBusinesses: [
        new Business("Dino Eggs", 1, 1, 1, new Manager(100), new Upgrade(200, 3)),
        new Business("Raptors", 100, 5, 100, new Manager(1000), new Upgrade(2000, 3)),
        new Business("Triceratops", 1000, 30, 1000, new Manager(10_000), new Upgrade(20_000, 3)),
        new Business("T-Rex", 10_000, 120, 10_000, new Manager(100_000), new Upgrade(200_000, 3)),
    ],
    initialPlayer: new Player(1000000),
}