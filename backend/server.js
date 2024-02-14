// since we are using type module, we can use import instead of require
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
const port = process.env.PORT || 8000; // frontend is on 3000
import incomeRouter from './routes/incomeRouter.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

connectDB(); //connect to MongoDB

const app = express();

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/income', incomeRouter);

///////////////////  his code   //////////////////
// app.get('/api/products', (req, res) => {
//     res.json(products);
// });
// app.get('/api/products/:id', (req, res) => {
//     const product = products.find((p) => p._id === req.params.id);
//     res.json(products);
// });

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));