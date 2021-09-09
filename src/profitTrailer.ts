
import sqlite3 from 'sqlite3';
import config from '../config.json';

const sql = sqlite3.verbose();

export class ProfitTrailer {

    public settings: any = {};
    public loaded: (pt: ProfitTrailer) => void;
    private db: any;

    constructor(onLoadEvent?: (pt: ProfitTrailer) => void) {
        this.loaded = onLoadEvent;
        this.init();
    }

    onLoaded: () => void;

    async init() {
        await this.getSettings();

        if (this.loaded) this.loaded(this);
    }

    private connect() {
        this.db = new sql.Database(`${config.profitTrailerInstallationFolder}/data/ptdb.db`, sqlite3.OPEN_READWRITE, (err: any) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the PT database.');
        });
    }

    private disconnect() {
        this.db.close((err: any) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }

    getPositions(): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            this.connect();
            this.db.serialize(() => {
                this.db.all(`SELECT * from position_entity`, (err: any, data: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data)
                });
            });
            this.disconnect();
        })
    }

    getTradeDurations(): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            this.connect();
            this.db.serialize(() => {
                this.db.all(`
                        select  phe.CURRENCY_PAIR,
                            (phe.SOLD_DATE - phe.FIRST_BOUGHT_DATE )/1000/60 AS trade_duration_mins,
                            datetime(ROUND(phe.first_bought_date / 1000), 'unixepoch') AS firstbought,
                            datetime(ROUND(phe.sold_date / 1000), 'unixepoch') AS sold_date_unix
                        from position_history_entity PHE where phe.history_type='SELL_HISTORY' ORDER BY 1,3
                `, (err: any, data: any) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data)
                });
            });
            this.disconnect();
        })
    }



    getSettings(): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            this.connect();
            this.db.serialize(() => {
                this.db.all(`SELECT * from setting_entity`, (err: any, settings: any) => {
                    if (err) {
                        console.info('could not get settings from PT DB');
                        reject(err);
                    }
                    for (const setting of settings) {
                        this.settings[setting.name] = setting.value;
                    }
                    resolve(this.settings);
                });
            });
            this.disconnect();
        });
    }
}
// export const getPositions = () => {
//     return new Promise((resolve: any, reject: any) => {
//         const db = new sql.Database(`${config.profitTrailerInstallationFolder}/data/ptdb.db`, sqlite3.OPEN_READWRITE, (err: any) => {
//             if (err) {
//                 console.error(err.message);
//             }
//             console.log('Connected to the PT database.');
//         });

//         db.serialize(() => {
//             db.all(`SELECT * from position_entity`, (err: any, data: any) => {
//                 if (err) {
//                     reject(err);
//                 }
//                 resolve(data)
//             });
//         });

//         db.close((err: any) => {
//             if (err) {
//                 console.error(err.message);
//             }
//             console.log('Close the database connection.');
//         });
//     })
// }