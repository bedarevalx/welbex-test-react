const db = require('../db');

class RowController {
  async createRow(req, res) {
    console.log('create');
    const { count, date, distance, name } = req.body;
    const newRow = await db.query(
      'INSERT INTO row (count, date, distance, name) values ($1, $2, $3, $4) RETURNING *',
      [count, date, distance, name],
    );
    res.json(newRow.rows[0]);
  }

  async getRows(req, res) {
    console.log('get');
    const page = req.query.page;
    const paginationStep = 10;
    try {
      //составляем запрос из параметров
      let query = '';
      let countQuery = '';
      let filterType;

      switch (req.query?.filterType) {
        case 'equal':
          filterType = '=';
          break;
        case 'moreThan':
          filterType = '>';
          break;
        case 'lessThan':
          filterType = '>';
          break;
        case 'contain':
          filterType = 'LIKE';
          break;
        default:
          filterType = '';
      }
      //если есть параметры фильтрации
      if (req.query?.filterBy) {
        query += ` WHERE ${req.query.filterBy} ${filterType} '${
          filterType === 'LIKE' && '%'
        }${req.query.value}${filterType === 'LIKE' && '%'}' `;
        countQuery += ` WHERE ${req.query.filterBy} ${filterType} '${req.query.value}' `;
      }
      const totalCount = await db.query(
        `SELECT count(*) FROM row ${countQuery}`,
      );
      const totalPages = Math.ceil(totalCount.rows[0].count / paginationStep);

      console.log(filterType);

      req.query.sortBy
        ? (query += `ORDER BY ${req.query.sortBy} `)
        : (query += 'ORDER BY id');
      req.query.sortType ? (query += req.query.sortType) : (query += ' asc');

      console.log(query);

      const rows = await db.query(
        `SELECT * FROM row ${query} offset $1 limit $2 `,
        [paginationStep * (page - 1), paginationStep],
      );
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json({
        data: rows.rows,
        currentPage: page,
        totalPages: totalPages,
      });
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }

  async getOneRow(req, res) {
    console.log('one');
    const id = req.params.id;
    const oneRow = await db.query('SELECT * FROM row WHERE id = $1', [id]);
    res.json(oneRow.rows[0]);
  }

  async updateRow(req, res) {
    const { id, count, date, distance, name } = req.body;
    const row = await db.query(
      'UPDATE row  SET count = $2, date = $3, distance = $4, name = $5 where id = $1  RETURNING *',
      [id, count, date, distance, name],
    );
    res.json(row.rows[0]);
  }

  async deleteRow(req, res) {
    const id = req.params.id;
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
      const deletedRow = await db.query('DELETE FROM row WHERE id = $1', [id]);
      res.json(deletedRow.rows[0]);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  }
}

module.exports = new RowController();
