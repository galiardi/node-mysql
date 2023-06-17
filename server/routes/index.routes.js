import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// envía todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('select * from user;');
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.json({ message: 'error' });
  }
});

// envía un usuario según id
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`select * from user where id = ${id}`);
    if (!rows[0]) return res.json({ message: 'el usuario no existe' });
    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.json({ message: 'error' });
  }
});

// agrega un usuario
router.post('/users', async (req, res) => {
  const { name, age } = req.body;
  try {
    const response = await pool.query(
      `insert into user(name, age) values('${name}', ${age})`
    );
    console.log(response);
    res.status(201).json({ message: 'usuario agregado en la base de datos' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'error' });
  }
});

// borra un usuario según id
router.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await pool.query(`delete from user where id = ${id}`);
    if (!result.affectedRows) {
      return res.json({ message: 'el usuario no existe' });
    }
    res.json({ message: 'usuario eliminado' });
  } catch (error) {
    console.log(error);
    res.json({ message: 'error' });
  }
});

// actualiza un usuario
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;
    let response;

    if (!name && age) {
      response = await pool.query(
        `update user set age = ${age} where id = ${id}`
      );
    } else if (name && !age) {
      response = await pool.query(
        `update user set name = '${name}' where id = ${id}`
      );
    } else if (name && age) {
      response = await pool.query(
        `update user set name = '${name}', age = ${age} where id = ${id}`
      );
    } else {
      return res.json({ message: 'Debe ingresar nombre o edad' });
    }

    const result = response[0];

    if (!result.affectedRows) {
      return res.json({ message: 'el usuario no existe' });
    }
    res.json({ message: 'usuario actualizado' });
  } catch (error) {
    console.log(error);
    res.json({ message: 'error' });
  }
});

export default router;
