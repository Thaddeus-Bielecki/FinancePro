// since we are using type module, we can use import instead of require
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8000; // frontend is on 3000

const app = express();

app.get('/', (req, res) => {
    res.send('API is running...');
});

// app.get('/api/products/:id', (req, res) => {
//     const product = products.find((p) => p._id === req.params.id);
//     res.json(products);
// });

app.listen(port, () => console.log(`Server running on port ${port}`));