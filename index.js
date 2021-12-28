require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const req = require('express/lib/request')
const app = express()
let morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req,res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })    
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people </p><p>${new Date().toString()}</p>`)
    })
    
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if(person) {
            response.json(person)
        }else{
            response.status(404).end()
        }
    })
       
})

app.delete('/api/persons/:id', (request, response) => {
    Person.remove({"_id": request.params.id }).then(() => {
        response.status(204).end()
    })    
    
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if(!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    

    const person = new Person({
        name: body.name,
        number: body.number        
    })
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    Person.findById(request.params.id).then(person => {
        person.name = body.name
        person.number = body.number
        person.save().then(() => {
            response.json(person)
        })    
    })  
    
})

const PORT = process.env.PORT
app.listen(PORT)