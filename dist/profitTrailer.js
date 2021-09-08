"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hitDB = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sql = sqlite3_1.default.verbose();
const hitDB = () => {
    return new Promise((resolve, reject) => {
        const db = new sql.Database('/var/opt/bots/1.Binance/data/ptdb.db', sqlite3_1.default.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the chinook database.');
        });
        db.serialize(() => {
            db.all(`SELECT * from position_entity`, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    });
};
exports.hitDB = hitDB;
//# sourceMappingURL=profitTrailer.js.map