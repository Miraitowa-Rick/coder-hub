const connection = require('../app/database');
const sqlFragement = `
SELECT
m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
JSON_OBJECT('id', u.id, 'name', u.name) author
FROM moment m
LEFT JOIN users u On m.user_id = u.id
`

class MomentService {
    async create(content, userId) {
        const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?);`;
        const [result] = await connection.execute(statement, [content, userId]);
        return result;
    }
    async getMomentById (id) {
        try {
              // const statement = `SELECT * FROM moment WHERE id = ?;`;
        const statement = `
        SELECT 
	m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
	JSON_OBJECT('id',u.id, 'name', u.name,'avatarUrl',u.avatar_url) author,
	IF(COUNT(l.id), JSON_ARRAYAGG(
			JSON_OBJECT('id',l.id,'name',l.name)
	), NULL) lables,
	(SELECT IF(COUNT(c.id), JSON_ARRAYAGG(
			JSON_OBJECT('id',c.id,'content',c.content, 'commentId',c.comment_id, 'createTime', c.createAt, 'user', JSON_OBJECT('id',cu.id,'name',cu.name,'avatarUrl',cu.avatar_url))
	),NULL) FROM comment c LEFT JOIN users cu ON c.user_id = cu.id  WHERE m.id = c.moment_id ) comments,
	(SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/',file.filename)) FROM file WHERE m.id = file.moment_id) images
FROM moment m
LEFT JOIN users u ON m.user_id = u.id
LEFT JOIN moment_lable ml ON m.id = ml.moment_id
LEFT JOIN lable l ON ml.lable_id = l.id
WHERE m.id =?
GROUP BY m.id;
        `;
        const [result] = await connection.execute(statement,[id]);
        return result[0];
        } catch (error) {
            console.log(error);
        }
      
    }
    async getMomentList(offset, size) {
        const statement = `
        SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name) author,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
        (SELECT COUNT(*) FROM moment_lable ml WHERE ml.moment_id = m.id) lableCount,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/',file.filename)) FROM file WHERE m.id = file.moment_id) images
        FROM moment m
        LEFT JOIN users u On m.user_id = u.id
        LIMIT ?, ?;
        `;
        const [result] = await connection.execute(statement,[offset,size]);
        return result;
    }
    async update(content, momentId) {
        const statement = `UPDATE moment SET content = ? WHERE id = ?;`;
        const [result] = await connection.execute(statement,[content,momentId]);
        return result;
    }
    async remove(momentId) {
        const statement = `DELETE FROM moment WHERE id = ?;`;
        const [result] = await connection.execute(statement,[momentId]);
        return result;
    }
    async hasLable(momentId,lableId) {
        const statement = `SELECT * FROM moment_lable WHERE moment_id = ? AND lable_id = ?;`;
        const [result] = await connection.execute(statement,[momentId,lableId]);
        return result[0] ? true: false;
    }
    async addLable(momentId,lableId) {
        const statement = `INSERT INTO moment_lable (moment_id,lable_id) VALUES (?, ?);`;
        const [result] = await connection.execute(statement,[momentId,lableId]);
        return result;
    }
}
module.exports = new MomentService();