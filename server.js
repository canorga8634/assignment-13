var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var dbUrl = 'mongodb+srv://chris:user@cluster0.ytgef.mongodb.net/Cluster0?retryWrites=true&w=majority'


var app = express()
app.use(express.static(__dirname))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
  if (err) console.log('MongoDB database connection error', err)
  else console.log('MongoDB database connection successful')
})

var Product = mongoose.model('product', {
  productId: String,
  category: String,
  price: Number,
  name: String,
})

app.get('/product/get/', (req, res) => {
  Product.find({}, (err, products) => {
    if (err) console.log('error: ', err)
    else res.send(products)
  })
})

app.post('/product/create/', (req, res) => {
  var { id, category, price, name, instock } = req.body
  let product = new Product({ productId: id, category, price, name })

  product.save(err => {
    if (err) {
      res.sendStatus(500)
      console.log('Error in saving data: ', err)
    } else {
      res.sendStatus(200)
    }
  })
})

app.delete('/product/delete/:productId', (req, res) => {
  Product.deleteOne({ productId: req.params.productId }, err => {
    if (err) console.log('Delete Error: ', err)
    else res.sendStatus(200)
  })
})

app.put('/product/update/:productId', (req, res) => {
  Product.findOneAndUpdate(
    { productId: req.params.productId },
    { upsert: false },
    err => {
      if (err) console.log('Update Error: ', err)
      else res.sendStatus(200)
    }
  )
})

var server = app.listen(3001, () => {
  console.log('server is listening on port', server.address().port)
})