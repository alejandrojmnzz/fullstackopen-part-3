require('dotenv').config()

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

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
    } 

  next(error)
}

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(result => {
        console.log('phonebook:')
        response.send(result)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.find({})
        .then(result => {
                response.send(`
                <p>Phonebook has info for ${result.length} people</p>
                <p>${new Date()}</p>
                `)
            })
        .catch(error => next(error))
        
        
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()

        })
        .catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then(result => {
            response.send(result)
        })
        .catch(error => next(error))
        
})

app.post('/api/persons', morgan(':method :url :status - :response-time ms :person'), (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        response.status(400).json({"error": "both parameters are required"})
    }



    const person = new Person(  {
        name: body.name,
        number: body.number
    })
    
    if (person.name) {
        person.save().then(result => {
            console.log(`added ${result.name} number ${result.number} to phonebook`)
    })
    .catch(error => next(error))
    
    }

    response.json(body)
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            console.log(updatedPerson)
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(errorHandler)