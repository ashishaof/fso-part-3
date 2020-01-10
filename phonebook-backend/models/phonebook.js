const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

mongoose.set('useFindAndModify', false);

console.log('connecting to', url)


mongoose.connect(url, {
  useUnifiedTopology: true,
   useNewUrlParser: true
  })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  });


const personSchema = new Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
    },
  number:{
    type: String,
    minlength: 8,
    required: true,
    unique: true
    }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id
    delete returnedObject.__v
  }
});

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema);