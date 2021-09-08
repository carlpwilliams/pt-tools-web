
import sqlite3 from 'sqlite3';
import config from '../config.json';

const sql = sqlite3.verbose();
export const getPositions = () => {
    return new Promise((resolve: any, reject: any) => {
        const db = new sql.Database(`${config.profitTrailerInstallationFolder}/data/ptdb.db`, sqlite3.OPEN_READWRITE, (err: any) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the chinook database.');
        });

        db.serialize(() => {
            db.all(`SELECT * from position_entity`, (err: any, data: any) => {
                if (err) {
                    reject(err);
                }
                resolve(data)
            });
        });

        db.close((err: any) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    })

}