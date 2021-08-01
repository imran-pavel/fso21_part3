const mongoose = require('mongoose');
const DB_CONFIG = require('./db_config');

mongoose
  .connect(process.env.DB_URL, DB_CONFIG)
  .then(() => {
    console.log('DB Connected');
  })
  .catch(() => {
    console.log('DB Connection failed');
  });

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];


const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});
  
const Person = mongoose.model('Person', personSchema);

const resetPersons = () => {
  return Person
    .remove({})
    .then(() => {
      let promises = persons.map((person) => {
        return new Person(person).save();
      });

      return Promise.all(promises)
        .then(() => {
          return {
            'message': 'Person resetting succeeded'
          };
        })
        .catch(() => {
          throw new Error('Person resetting failed');
        });
    })
    .catch((err) => {
      throw new Error('Something went wrong. Couldn\'t reset Person.');
    });
};

const getAllPersons = () => {
  return Person.find({})
    .then(people => people)
    .catch(() => {
      throw new Error('getAllPersons failed');
    });
};

const deletePersonsById = (target_id) => {
  console.log(target_id);
  return Person.deleteMany({ _id: target_id })
    .then( _ => { 
      return {
        message: 'Person(s) deleted'
      }
     })
    .catch( _ => {
      throw new Error('deletePersonsById failed');
    });
};

const createNewPerson = (newPersonData) => {
  return new Person(newPersonData).save()
    .then(newPerson => newPerson)
    .catch( _ => {
      throw new Error('createNewPerson failed');
    });
};

const findPersonById = (target_id) => {
  return Person.findById(target_id)
    .then(person => person)
    .catch( err => {
      console.log(err);
      throw new Error('findPersonById failed');
    });
}

const getNumberOfContacts = () => {
  return getAllPersons()
    .then(people => people.length)
    .catch( _ => {
      throw new Error('getNumberOfContacts failed');
    });
};

const updateNumberOfContact = (target_id, newNumber) => {
  return Person.findById(target_id)
    .then(existingPerson => {
      let updatedPerson = {
        name: existingPerson.name,
        number: newNumber
      };
      return Person.findOneAndUpdate({ _id: target_id }, updatedPerson, { new: true })
        .then(updatedContact => updatedContact)
        .catch( _ => {
          throw new Error('updateNumberOfContact failed');
        })
    })
    .catch( _ => {
      throw new Error('updateNumberOfContact failed');
    });
};

module.exports = {
  resetPersons,
  getAllPersons,
  createNewPerson,
  findPersonById,
  getNumberOfContacts,
  updateNumberOfContact,
  deletePersonsById
};