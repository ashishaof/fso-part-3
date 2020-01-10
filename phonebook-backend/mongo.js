const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2];
const name = process.argv[3]
const phoneNumber = process.argv[4]

// node mongo.js "password"
const urlMongo =`mongodb+srv://fullstack:${password}@cluster0-2xns0.mongodb.net`;
const url = `${urlMongo}/persons?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true })
//mongoose.connect(url, { useUnifiedTopology: true })



const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person= mongoose.model('Person', personSchema);

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});
/*
const person = new Person({
  "name": "Salum Ujeruman",
  "number": "345370945409496"
})
*/
const person = new Person({
  "name": name,
  "number": phoneNumber
});

person.save().then(response => {
  console.log('person saved!')
 // mongoose.connection.close()
});



Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person);
  });
  mongoose.connection.close();
});
