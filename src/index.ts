import Express from 'express'
import Mongoose from './database'

const app = Express()

app.use(Express.json())

Mongoose.connection.once('open', () => {
  console.log('Product ervice connected to MongoDB')

  const changeStream = Mongoose.connection.collection('product').watch()

  changeStream.on('change', async (change) => {
    if (change.operationType === 'insert') {
      const product = change.fullDocument
      try {
        // Find the product being updated and the changes
        // await Product.
      } catch (error) {
        console.error('Failed to update product', error)
      }
    }
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Product service running on port ${process.env.PORT}`)
})

// Model
const SchemaTypes = Mongoose.SchemaTypes

const ProductSchema = new Mongoose.Schema({
  name: String,
  description: String,
  price: SchemaTypes.Double,
  stock: Number,
})

const Product = Mongoose.model('Product', ProductSchema)

// Routes
app.get("/products", async (req: Express.Request, res: Express.Response) => {
  const products = await Product.find({}).limit(20);

  try {
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/product", async (req: Express.Request, res: Express.Response) => {
  const newProduct = new Product(req.body)

  try {
    await newProduct.save()
  } catch (error) {
    res.status(500).send(error);
  }

  res.status(201).send(newProduct)
});

app.post("/product/:productId", async (req: Express.Request, res: Express.Response) => {
  const product = await Product.find({ id: req.params.productId })

  if (!product) {
    throw new Error(`Product not found for id ${req.params.productId}`)
  }

  res.send(product)
});

