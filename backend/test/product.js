let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let db = require("../database/database");
let should = chai.should();

chai.use(chaiHttp);

describe("Products", () => {
  // beforeEach(done => {
  //   db.run("delete from product", done);
  // });

  describe("/GET product", () => {
    it("Should get all the Products", done => {
      chai
        .request(server)
        .get("/produto")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe("/POST product", () => {
    let product = {
      name: "Produto",
      description: "Produto Desc",
      code: "code"
    };

    it("Should not create a product without a value", done => {
      chai
        .request(server)
        .post("/produto")
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("value")
            .eql("Valor deve existir e não pode ser negativo");
          done();
        });
    });

    it("Should not create a product with a negative value", done => {
      product.value = -1000;

      chai
        .request(server)
        .post("/produto")
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("value")
            .eql("Valor deve existir e não pode ser negativo");
          done();
        });
    });

    it("Should not create a product with a invalid promotion", done => {
      product.value = 1000;
      product.id_promotion = 321;
      chai
        .request(server)
        .post("/produto")
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("error")
            .eql("SQLITE_CONSTRAINT: FOREIGN KEY constraint failed");
          done();
        });
    });

    it("Should not create a product without a code", done => {
      product.value = 1000;
      delete product.code;
      delete product.id_promotion;
      chai
        .request(server)
        .post("/produto")
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("code")
            .eql("Produto deve ter um código");
          done();
        });
    });

    it("Should create product that has AT LEAST name, code, value", done => {
      product.value = 1000;
      product.code = "AB4321";
      delete product.description;

      chai
        .request(server)
        .post("/produto")
        .send(product)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          done();
        });
    });
  });

  describe("/PUT product", () => {
    it("Should update product successfully", done => {
      const chai_req = chai.request(server);

      chai_req.get("/produto").end((err, res) => {
        const produtos = res.body;
        let produto = produtos[0];
        produto.should.be.a("object");

        let copyObj = obj => JSON.parse(JSON.stringify(obj));
        let oldProduct = copyObj(produto);
        chai_req.put(`/produto/${oldProduct.id}`).send({
          ...oldProduct, 
          name: 'Novo nome', 
          code: 'Novo code',
          value: 77700,
        }).end((err, res) => {
          done()
        })
      });
    });
    

    it("Should update product successfully", done => {
      const chai_req = chai.request(server);

      chai_req.get("/produto").end((err, res) => {
        const produtos = res.body;
        let produto = produtos[0];
        produto.should.be.a("object");

        let copyObj = obj => JSON.parse(JSON.stringify(obj));
        let oldProduct = copyObj(produto);
        chai_req.put(`/produto/${oldProduct}`).send({
          ...oldProduct, 
          name: 'Novo nome'
        }).end((err, res) => {
          console.log(err, res.body);
          done()
        })
      });
    });
  });

  describe("/DELETE product", () => {
    it("Should delete a product successfully", done => {
      let chai_req = chai.request(server);

      chai_req.get("/produto").end((err, res) => {
        const idToDelete = res.body[0].id;
        chai_req.delete(`/produto/${idToDelete}`).end((err, res) => {
          res.should.have.status(200);
          chai_req.get("/produto").end((err, res) => {
            res.body.length.should.eql(0);
            done();
          });
        });
      });
    });
  });
});
