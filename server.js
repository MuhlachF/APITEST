const express = require('express');
const app = express()
const jwt = require('jsonwebtoken')
const e_jwt = require('express-jwt').expressjwt;;

const SECRET = 'S3cr3tK3yD0ntSh4r31t'

app.use(express.json())

const users = [
    {
        "username": "john_doe",
        "password": "123456",
        "role": "USER"
    },
    {
        "username": "jane_doe",
        "password": "123456",
        "role": "ADMIN"
    }
]

app.use(e_jwt({ secret: SECRET, algorithms: ['HS256'] }).unless({ path: ['/login', '/'] }));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid token, access /login with username and password in the Body to authenticate.');
    }
}
);

app.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Error. Please enter the correct username and password' })
    }

    const user = users.find(u => u.username === req.body.username && u.password === req.body.password)
    if (!user) {
        return res.status(400).json({ message: 'Error. Wrong login or password' })
    }

    const token = jwt.sign({
        username: user.username,
        role: user.role
    }, SECRET, { expiresIn: '3 hours' })

    return res.json({ access_token: token })
})

// Une liste d'exemple de livres, qui pourrait être récupérée en base de données
const books = [
    {
        "titre": "Livre 1",
        "auteur": "Jonathan",
        "isbn": "12345679",
        "disponibilite": true,
        "date_retour": null
    },
    {
        "titre": "Livre 2",
        "auteur": "Elise",
        "isbn": "98765428",
        "disponibilite": false,
        "date_retour": "01/01/2028"
    },
    {
        "titre": "Livre 3",
        "auteur": "Zineb",
        "isbn": "87357493",
        "disponibilite": false,
        "date_retour": null
    },
]

app.get('/books/', (req, res) => {
    res.json(books)
})

app.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn
    const book = books.find(book => book.isbn === isbn)

    res.json(book)
})

app.post('/books', (req, res) => {
    books.push(req.body)
    res.status(200).json(books)
})

app.put('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn
    let book = books.find(book => book.isbn === isbn)

    // Modification du livre
    book.titre = req.body.titre
    book.auteur = req.body.auteur
    book.disponibilite = req.body.disponibilite
    book.date_retour = req.body.date_retour

    res.status(200).json(book)
})


app.delete('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn
    const book = books.find(book => book.isbn === isbn)
    books.splice(books.indexOf(book), 1)

    res.json(books)
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Serveur démarré')
})