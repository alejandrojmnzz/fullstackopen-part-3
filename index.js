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
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()

        })
         .catch(error => console.log(error))
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



    const person = new Person(  {
        name: body.name,
        number: body.number
    })


    if (person.name) {
        person.save().then(result => {
            console.log(`added ${result.name} number ${result.number} to phonebook`)
    })
    }

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
