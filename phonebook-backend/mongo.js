const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2];
const name = process.argv[3]
const phoneNumber = process.argv[4]


const urlMongo =`mongodb+srv://fullstack:${password}@cluster0-2xns0.mongodb.net`;
const url = `${urlMongo}/persons?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true })




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

const person = new Person({
  "name": name,
  "number": phoneNumber
});

person.save().then(response => {
  console.log('person saved!')

});



Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person);
  });
  mongoose.connection.close();
});
