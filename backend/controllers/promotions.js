var express = require("express");
var db = require("../database/database");

const validators = require("../utils/validators");

var router = express.Router();

router.get("/", (req, res) => {
  var sql = "select * from promotion";
  var params = [];
  db.all(sql, params, (err, data) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(data);
  });
});

router.put("/:promotionId", (req, res) => {
  const sql = `update promotion 
              set 
                name = COALESCE(?, name),
                description = COALESCE(?, description),
                value = COALESCE(?, value)
              where id = ?`;
  const { name, description, value } = req.body;
  const params = [name, description, value, req.params.promotionId];
  db.all(sql, params, err => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(204);
  });
});

router.post("/", (req, res) => {
  const errors = validators.validate_promotion(req.body);
  if (errors.length == 0) {
    var sql =
      "INSERT INTO promotion (type, description, calculate ) VALUES (?,?,?)";
    var params = [req.body.type, req.body.description, req.body.calculate];
    db.run(sql, params, function (err, result) {
      if (err) {
        res
          .status(400)
          .json({
            message:
              err.errno == 19
                ? "Promoção já existe"
                : "Erro ao cadastrar promoção",
            ...err,
          });
        return;
      }
      res.json({
        id: this.lastID,
        ...req.body,
      });
    });
  } else {
    res.status(400).json(errors);
  }
});

router.delete("/:promotionId", (req, res) => {
  var sql = "delete from promotion where id = ?";
  var params = [req.params.promotionId];
  db.all(sql, params, (err, data) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(data);
  });
});

module.exports = router;
