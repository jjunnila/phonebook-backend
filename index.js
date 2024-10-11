require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('json', function getJson (req) {
    if (req.method === "POST")
        return JSON.stringify(req.body)
    else 
        return " "
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

let persons = [
    {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
    },
    {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
    },
    {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
    },
    {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {response.json(people)})
    })

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
      })
    })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
    })

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name){
        return response.status(400).json({ 
        error: 'name missing' 
        })
    } 
    if (!body.number){
        return response.status(400).json({ 
        error: 'number missing' 
        })
    } 
    /* if (persons.find(person => person.name === body.name)){
        return response.status(400).json({ 
        error: 'name must be unique' 
        })
    }  */

    const person = new Person({
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 9999).toString()
    })

    person.save().then(savedPerson => {response.json(savedPerson)})

})

app.get('/info', (request, response) => {
    const text = `<div>Phonebook has info for ${persons.length} people.</div>
        <div>${new Date(Date.now()).toString()}</div>`
    response.send(text)
    })

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})