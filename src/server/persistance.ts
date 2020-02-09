import fs from 'fs';
import path from 'path';
import Business from '../shared/business';
import Player from '../shared/player';

interface DTO {
    businesses: Business[];
    player: Player;
}

const dbDir = "./db";

export default class Persistance {
    readonly username: string;
    readonly filename: string;
    
    constructor(username: string) {
        this.username = username;
        this.filename = path.join(dbDir, this.username);
        if (!fs.existsSync(dbDir)){
            fs.mkdirSync(dbDir);
        }
    }

    existsUser() : boolean {
        return fs.existsSync(this.filename);
    }

    save(player: Player, businesses: Business[]) {
        const dto = {
            player: player,
            businesses: businesses
        };
        let data = JSON.stringify(dto, null, 2);

        fs.writeFile(this.filename, data, (err) => {
            if (err) throw err;            
        });
    }

    getPlayerAndBusinesses() : [Player, Business[]] {
        const dataJson = JSON.parse(fs.readFileSync(this.filename, 'utf8'));
        const dto = dataJson as DTO;
        return [Player.from(dto.player), dto.businesses.map(Business.from)];
    }
}
