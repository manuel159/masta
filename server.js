const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const config = require("./config");

const hbs = require("express-handlebars");
const Product = require("./models/product");
const app = express();

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine(".hbs", hbs({ defaultLayout: "index", extname: "hbs" }));
app.set("view engine", ".hbs");
app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/product", (req, res) => {
  res.render("product");
});

app.get("/products", (req, res) => {
  res.render("products");
});

app.get("/api/product/:productId", (req, res) => {
  let productId = req.params.productId;
  Product.findById(productId, (err, products) => {
    // Product.find({price:productId},(err,todoo)=>{ //psss
    if (err)
      return res
        .status(500)
        .send({ message: `Error al realizar la petición ${err}` });
    if (!products)
      return res.status(404).send({ message: `El producto no existe` });
    //res.status(200).send({product:todoo})
    res.render("Editar", { products });
  }).lean();
});

app.post("/api/product", (req, res) => {
  let product = new Product();
  product.name = req.body.name;
  product.picture = req.body.picture;
  product.price = req.body.price;
  product.category = req.body.category;
  product.description = req.body.description;

  product.save((err, productStored) => {
    if (err)
      res.status(500).send({ message: `Error al salvar en la DB ${err}` });
    res.status(200).send({ product: productStored });
  });
});

app.get("/api/product", (req, res) => {
  Product.find({}, (err, products) => {
    if (err)
      return res
        .status(500)
        .send({ message: `Error al realizar la petición ${err}` });
    if (!products)
      return res.status(404).send({ message: `No existen productos` });
    //res.status(200).send( {products:[products]})
    res.render("products", { products });
  }).lean();
});

app.put("/api/product/:productId", (req, res) => {
  let productId = req.params.productId;
  console.log(`EL producto es: ${productId}`);

  let update = req.body;
  console.log(update);

  Product.findOneAndUpdate({ _id: productId }, update, (err, products) => {
    if (err)
      res.status(500).send({
        message: `Error al actualizar el producto ${err}`,
      });
    //res.status(200).send({product: products})
    res.redirect("/api/product");
  });
});

app.delete("/api/product/:productId", (req, res) => {
  let productId = req.params.productId;

  Product.findById(productId, (err, product) => {
    if (err)
      res.status(500).send({ message: `Error al borrar el producto ${err}` });

    product.remove((err) => {
      if (err)
        res.status(500).send({ message: `Error al borrar el producto ${err}` });
      res.status(200).send({ message: "El producto ha sido eliminado" });
    });
  });
});

mongoose.connect(config.db, config.urlParser, (err, res) => {
  if (err) {
    return console.log(`Error al conectar con la DB: ${err}`);
  }
  console.log("Conexion exitosa a la DB");

  // =>: Function Arrow
  app.listen(config.port, () => {
    console.log(`API-REST ejecutándose en: http://localhost:${config.port}`);
  });
});


//GUIA PARA SABER QUE PEDO

// para deploy : heroku login
// git init
//heroku git:remote -a api-rest-pgj
// git add .
// git commit -am 'preparing to heroku'
// git push heroku master
