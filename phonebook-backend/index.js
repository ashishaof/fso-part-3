const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');


const Person = require('./models/phonebook');

app.use(express.static('build'))
app.use(bodyParser.json());
app.use(cors());



const requestLogger = (request, response,next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  };

app.use(requestLogger)

morgan.token('data', (req, res)=> JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
 


      
app.get('/', (req, res) => {
        res.send('<h1>Hello World!</h1>')
}) 

app.get('/info', async (req, res, next) => {
  try {
    const totalPeople = await Person.find({}).countDocuments();
    console.log(' Persons List:', totalPeople )
    res.send(`
          <p>Phone book has info for ${totalPeople} people</p>
          <p>${new Date()}</p>
      `);
   } catch (error) {
    next(error)
  }
})


app.post('/api/persons', (request, response, next) => {
        const body = request.body;
        const person = new Person({
          name: body.name,
          number: body.number,
        });
        
        person
          .save()
          .then(savedPerson => {
            return savedPerson.toJSON()
          })
          .then(savedAndFormattedPerson => {
            response.json(savedAndFormattedPerson)
          }) 
          .catch(error => next(error));
 });
    
app.get('/api/persons', (request, response) => {
        Person.find({}).then(person => {
          response.json(person);
        });
});
      
app.get('/api/persons/:id', (request, response, next) => {
        Person.findById(request.params.id)
        .then(person => {
          if (person) {
            response.json(person.toJSON())
          } else {
            response.status(404).end() 
          }
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  
  const person = new Person({
    name: body.name,
    number: body.number
  });
  Person.findById(request.params.id)
        .then(person => {
          if (person) {
            person.name = body.name
            person.number = body.number
            person.save()
                  .then(updatedPerson =>{
                    response.json(updatedPerson.toJSON())
                  }).catch(err => console.log(err))
           
          } else {
            response.status(404).end() 
          }
        })
        .catch(error => next(error));

  // {$set: person} {upsert: true} { new: true }
  /*
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error));
    */
});


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
  
app.use(unknownEndpoint);  


const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
};

app.use(errorHandler)
      
const PORT = process.env.PORT;

app.listen(PORT, () =>  console.log(`Server running on port ${PORT}`));