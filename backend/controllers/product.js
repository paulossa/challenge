const express = require("express");
const db = require("../database/database");

const validators = require('../utils/validators');
const { validate_product_schema } = validators;

const router = express.Router();

router.get("/", (req, res) => {
  var sql = "select * from product";
  var params = [];
  db.all(sql, params, (err, data) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(data);
  });
});

router.put("/:productId", validate_product_schema, (req, res) => {
  const sql = `update product 
              set 
                name = COALESCE(?, name),
                code = COALESCE(?, code),
                description = COALESCE(?, description),
                value = COALESCE(?, value),
                id_promotion = ?
              where id = ?`;
  const { name, code, description, value, id_promotion } = req.body;
  const params = [name, code, description, value, id_promotion, req.params.productId];
  db.run(sql, params, (err, data) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(data);
  });
});

router.post("/", (req, res) => {
  const errors = validators.validate_product(req.body)
  if (Object.keys(errors).length == 0) {
    var sql = 'INSERT INTO product (code, name, description, value, id_promotion) VALUES (?,?,?,?,?)'
    const {code, name, description, value, id_promotion} = req.body;
    var params = [code, name, description, value, id_promotion]
    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ "error": err.message })
        return;
      }
      res.json({
        ...req.body,
        "id": this.lastID
      })
    });
  } else {
    res.status(400).json(errors)
  }
})

router.delete("/:productId", (req, res) => {
  var sql = "delete from product where id = ?";
  var params = [req.params.productId];
  db.all(sql, params, (err, data) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(data);
  });
});



module.exports = router;
