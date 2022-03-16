const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const toyService = require('./services/toy.service');
const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


//LIST
app.get('/api/toy', (req, res) => {
    console.log('Backend getting Toys');
    const filterBy = {
        name: req.query.name || '',
        labels: req.query.labels || [],
        inStock: req.query.inStock || '',
        sortBy: req.query.sortBy || '',
    };
    toyService.query(filterBy).then((toys) => {
        res.send(toys);
    });
});

//READ
app.get('/api/toy/:toyId', (req, res) => {
    console.log('Backend getting your Toy:', req.params.toyId);
    toyService
        .getById(req.params.toyId)
        .then((toy) => {
            res.send(toy);
        })
        .catch((err) => {
            console.log('Backend had error: ', err);
            res.status(404).send('No such toy');
        });
});

//DELETE
app.delete('/api/toy/:toyId', (req, res) => {
    console.log('Backend removing Toy..', req.params.toyId);
    toyService
        .remove(req.params.toyId)
        .then(() => {
            res.send({ msg: 'Removed' });
        })
        .catch((err) => {
            console.log('Backend had error: ', err);
            res.status(404).send('Cannot remove Toy');
        });
});

// CREATE
app.post('/api/toy', (req, res) => {
    console.log('Backend Saving Toy:', req.query.name);
    const { name, price, inStock, labels, reviews } = req.body;
    const toy = {
        name,
        price,
        inStock,
        labels,
        reviews,
    };

    toyService
        .save(toy)
        .then((savedToy) => {
            res.send(savedToy);
        })
        .catch((err) => {
            console.log('Backend had error: ', err);
            res.status(404).send('Cannot create toy');
        });
});

//UPDATE
app.put('/api/toy/:toyId', (req, res) => {
    console.log('Backend Saving Toy:', req.body.name);
    const { _id, name, price, createdAt, inStock, labels, reviews } = req.body;
    const toy = {
        _id,
        name,
        price,
        createdAt,
        inStock,
        labels,
        reviews,
    };

    toyService
        .save(toy)
        .then((savedToy) => {
            res.send(savedToy);
        })
        .catch((err) => {
            console.log('Backend had error: ', err);
            res.status(401).send('Cannot update Toy');
        });
});


app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
});