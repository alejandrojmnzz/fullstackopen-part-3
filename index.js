require('dotenv').config()
const mongoose = require("mongoose")

const Person = require('./models/person')

const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('person', function (res, req) {
    return JSON.stringify(res.body)
})

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        console.log('phonebook:')
        response.send(result)
    })
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        `)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id != id)
    response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === Number(id))
    if (!person) {
        response.status(404).json({    
            error: 'content missing' 
          })
        return
    }
    response.send(`${person.name}, ${person.number}`)
})

app.post('/api/persons', morgan(':method :url :status - :response-time ms :person'), (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        response.status(400).json({"error": "both parameters are required"})
    }
    if (persons.find(person => person.name === body.name)) {
        response.status(403).json({"error": "name must be unique"})
    }
    persons.push({...body, "id": Math.floor(Math.random() * 1000000)})
    response.json(body)
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})




// const person = new Person(  {
//     name: name,
//     number: number
// })


// if (person.name) {
//     person.save().then(result => {
//         console.log(`added ${result.name} number ${result.number} to phonebook`)
//         mongoose.connection.close()
// })
// }
