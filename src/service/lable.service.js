const connection = require('../app/database');

class LableService {
    async create(name) {
        const statement = `INSERT INTO lable (name) VALUES (?);`;
        const [result] = await connection.execute(statement,[name]);
        return result
    }
    async getLableByName(name) {
        const statement = `SELECT * FROM lable WHERE name = ?;`;
        const [result] = await connection.execute(statement,[name]);
        return result[0];
    }
    async getLables(offset,limit) {
        const statement = `SELECT * FROM lable LIMIT ?, ?`;
        const [result] = await connection.execute(statement,[offset,limit]);
        return result;
    }
}
module.exports = new LableService()