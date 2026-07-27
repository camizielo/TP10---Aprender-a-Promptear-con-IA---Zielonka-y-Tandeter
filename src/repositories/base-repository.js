import Db from './db-pg.js';

export default class BaseRepository {
    constructor(tabla) {
        console.log(`Estoy en: BaseRepository.constructor(${tabla})`);
        this.tabla = tabla;
        this.db = new Db();
    }

    getAllAsync = async () => {
        console.log(`BaseRepository[${this.tabla}].getAllAsync()`);
        const sql = `SELECT * FROM ${this.tabla}`;
        return await this.db.queryAll(sql);
    }

    getByIdAsync = async (id) => {
        console.log(`BaseRepository[${this.tabla}].getByIdAsync(${id})`);
        const sql = `SELECT * FROM ${this.tabla} WHERE id=$1`;
        return await this.db.queryOne(sql, [id]);
    }

    deleteByIdAsync = async (id) => {
        console.log(`BaseRepository[${this.tabla}].deleteByIdAsync(${id})`);
        const sql = `DELETE FROM ${this.tabla} WHERE id=$1`;
        return await this.db.queryRowCount(sql, [id]);
    }
}