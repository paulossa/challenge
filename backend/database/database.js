var sqlite3 = require("sqlite3").verbose();
var schemas = require("./schemas");

const DBSOURCE = ":memory:";

let db = new sqlite3.Database(DBSOURCE, err => {
  const { NODE_ENV } = process.env;
  if (err) {
    // Cannot open database
    console.error("Could not connect to the database");
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run("PRAGMA foreign_keys = ON"); // enforces foreign key constraints

    db.run(schemas.promotion_schema, err => {
      if (err) {
        // Tabela já existe
      } else {
        // Table just created, creating some rows
        if (NODE_ENV !== "test") {
          var insert = "INSERT INTO promotion (type, description) VALUES (?,?)";
          db.run(insert, ["pague1leve2", "Pague 1 e leve 2"]);
          db.run(insert, ["3por10", "Compre 3 e pague 10 reais"]);
        }
      }
    });

    db.run(schemas.product_schema, err => {
      if (err) {
        // Tabela já existe
        // console.error(err);
      } else {
        if (NODE_ENV !== "test") {
          var insert =
            "INSERT INTO product (name, code, description, value, id_promotion) VALUES (?,?,?,?,?)";
          db.run(insert, [
            "Cerveja S/ Alcool",
            "b001",
            "Cerveja Sem Álcool, pra você beber muito e não passar mal SKAL",
            1000,
            null
          ]);
          db.run(insert, [
            "Pão de Alho P/ Churrasco",
            "p021",
            "Pao de Alho para Churrasco SALDIA",
            2000,
            1
          ]);
          db.run(insert, [
            "Dose de glicose",
            "p015",
            "Glicose para aplicar nos amigos que beberam demais",
            5000,
            2
          ]);
        }
      }
    });
  }
});

module.exports = db;
