var sqlite3 = require("sqlite3").verbose();
var schemas = require("./schemas");

const DBSOURCE = ":memory:";

const createPromotions = (db, callback) => {
  var insert = `
    INSERT INTO 
      promotion 
      (type, description) VALUES (?, ?)`;

  db.run(schemas.promotion_schema, err => {
    if (err) {
      // Tabela já existe
    } else {
      // Table just created, creating some rows
      if (process.env.NODE_ENV !== "test") {
        db.run(insert, ["pague1leve2", "Pague 1 e leve 2"], () => {
          // Only creates products after creating promotions,
          // gotta hate this async style
          db.run(insert, ["3por10", "Compre 3 e pague 10 reais"], callback());
        });
      } else {
        // when running tests will only create the products table
        callback(db)();
      }
    }
  });
};

const createProducts = db => () => {
  console.log('creating product')
  db.run(schemas.product_schema, err => {
    if (err) {
      // Tabela já existe
      // console.error(err);
    } else {
      if (process.env.NODE_ENV !== "test") {
        var insert =
          "INSERT INTO product (name, code, description, value, id_promotion) VALUES (?,?,?,?,?)";
        db.run(insert, [
          "Cerveja S/ Alcool",
          "b001",
          "Cerveja Sem Álcool, pra você beber muito e não passar mal SKAL",
          1000,
          null
        ]);

        db.all("select * from promotion", (err, data) => {
          db.run(insert, [
            "Pão de Alho P/ Churrasco",
            "p021",
            "Pao de Alho para Churrasco SALDIA",
            2000,
            data[0].id
          ]);
          db.run(insert, [
            "Dose de glicose",
            "p015",
            "Glicose para aplicar nos amigos que beberam demais",
            5000,
            data[1].id
          ]);
        });
      }
    }
  });
};

let db = new sqlite3.Database(DBSOURCE, err => {
  const { NODE_ENV } = process.env;
  if (err) {
    // Cannot open database
    console.error("Could not connect to the database");
    console.error(err);
  } else {
    console.log("Connected to the SQLite database.");
    db.run("PRAGMA foreign_keys = ON"); // enforces foreign key constraints

    createPromotions(db, createProducts);
  }
});

module.exports = db;
