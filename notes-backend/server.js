
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const Note = require('./models/note');


app.use(bodyParser.json());
app.use(cors());

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next()
};

app.use(requestLogger);


morgan.token('data', (req, res)=> JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
app.use(express.static('build'));


let notes = [
        
        {
          id: 1,
          content: "HTML is easy",
          date: "2019-05-30T17:30:31.098Z",
          important: true,
        },
        {
          id: 2,
          content: "Browser can execute only Javascript",
          date: "2019-05-30T18:39:34.091Z",
          important: false,
        },
        {
          id: 3,
          content: "GET and POST are the most important methods of HTTP protocol",
          date: "2019-05-30T19:20:14.298Z",
          important: true,
        },
        {
          content: "VS Code REST client is pretty",
          important: true,
          date: "2019-11-13T21:14:29.623Z",
          id: 4,
        },
        {
          content: "VS Code REST client is an awasome",
          important: false,
          date: "2019-11-13T21:34:16.699Z",
          id: 5,
        },
        {
          content: "Amazing VS code REST client ",
          important: true,
          date: "2019-11-13T21:46:06.894Z",
          id: 6,
        }
  ];

  
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.post('/api/notes', (request, response) => {
    const body = request.body;
  
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' });
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    });
    
    note.save().then(savedNote => {
      response.json(savedNote.toJSON());
    });
  });

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes);
    });
});
  
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note.toJSON())
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => next(error))
});
  
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
  
app.use(unknownEndpoint);


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});