const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

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

app.listen(port, () => {
    console.log('Serveur démarré')
})