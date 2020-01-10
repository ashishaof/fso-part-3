import React, { useState, useEffect } from 'react';
import './index.css';
import Filter from  './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/services';
import Notification from './components/Notification';




const App = () => {
  const [ persons, setPersons] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ newFilterName, setFilterName ] = useState('');
  const [ notification, setNotification ] = useState({message: '', classStyle: ''})
            

  useEffect(() => {
    console.log('effect')
    personService
        .getAll()
        .then(initialContact => {
          console.log('fetched data', initialContact)
          setPersons(initialContact)
        })
  }, [])
  console.log('render', persons.length, 'persons')
  console.log('render Contact list ', persons, 'persons')
 
  

  const handleNameChange = (event) => {
    console.log("Handle Name Change",event.target.value);
     setNewName(event.target.value) 
  };

  const handleNumberChange = (event) => {
    console.log("Handle Number Change",event.target.value);
    setNewNumber(event.target.value);
  };


  const handleFilterChange = (event) => {
    console.log("Handle Filter Change",event.target.value);
    setFilterName(event.target.value)
  };


  const addContact =(event) =>{
    event.preventDefault()
    let  newPersonContact = {name: newName,
                             number: newNumber
                             };
    console.log("Add contact", newName)
    console.log("Add contact person", persons)
    let newPersonList = persons.map(person => person.name);
    console.log("New person list", newPersonList)
   
    let isNewPerson= newPersonList.includes(newName)
    console.log("check isNewPerson", isNewPerson)
  
    if (isNewPerson){
    let okCancel = window.confirm(`${newName} is already added to phonebook, replace the old one a with new one?`);
    // alert(`${newName} is already added to phonebook, replace the old one a with new one?`) 
    if(okCancel){
      let foundPerson = persons.find(person => person.name === newName) 
      let personContactChange = {...foundPerson, number: newPersonContact.number}
      personService
        .update(foundPerson.id, personContactChange)
        .then(updatedPerson => {
          setPersons(persons.map(person => person.id !== updatedPerson.id? person: updatedPerson))
          console.log("New person added: ", updatedPerson)
           setNotification({message: `Entry ${foundPerson.name} updated!`, classStyle: 'success'})
            setTimeout(() => {
              setNotification({})
            }, 5000);
            setNewNumber('')
            setNewName('')
        }).catch(error => {
         console.log(error.response)

          setPersons(persons.filter(person => person.id !== foundPerson.id))
           setNotification({message: JSON.stringify(error.response.data.error), classStyle: 'error'})
            setTimeout(() => {
              setNotification({})
            }, 5000);
        }) 
        
    }    

    } else {
        personService
          .create(newPersonContact)
          .then(newPerson => {
            setPersons([...persons, newPerson])
            console.log("New person added: ", newPerson)
          setNotification({message: `Entry ${newPerson.name} added!`, classStyle: 'success'})
            setTimeout(() => {
            setNotification({})
          }, 5000);
          setNewName('')
          setNewNumber('')
        }).catch(error =>{
          console.log(error.response.data)
          setNotification({message:JSON.stringify(error.response.data.error), classStyle: 'error'})
            setTimeout(() => {
              setNotification({})
            }, 5000);
        })
     
    }
  }

  const handleDeleteContact =(deleteId, event) =>{
    event.preventDefault()
    //const Id = parseInt(event.target.value)
    console.log("check handleDeleteContact", persons," :", deleteId)

    const deletePerson  = persons.find(person => person.id === deleteId)
  
    console.log("name  to Delete", deletePerson)
   const newPersonList= persons.filter(person => person.id !== deleteId);
   console.log("check isNewPerson", newPersonList)
  
    let isPerson= newPersonList.includes(newName)
    console.log("check isNewPerson", isPerson)
    let okCancel = window.confirm(`Delete ${deletePerson.name}`);
    if (deletePerson && okCancel){
       
      personService
      .deleteName(deleteId)
      .then(deletedPerson => {
        console.log("Add contact to persons", deletedPerson)
        setPersons(newPersonList)
        setNotification({message: ` ${deletePerson.name} is just deleted from phonebook `, classStyle:'error'})
          setTimeout(() => {
            setNotification({})
          }, 5000) 
      }).catch(error => {
        console.log(error.response.data)  
        setNotification({message: JSON.stringify(error.response.data.error), classStyle:'error'})
          setTimeout(() => {
            setNotification({})
          }, 5000) 
        })
  }
  }

  return (
    <div id ="content">
      <h2>Phonebook</h2>
      <Notification notification ={notification} />
      
      <Filter 
        filterName={newFilterName} 
        handleFilterChange={handleFilterChange} 
      />

       <h3>Add a new</h3>    

      <PersonForm 
        onSubmitAddContact={addContact} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons 
        handleDeleteContact = {handleDeleteContact}
        persons ={persons}
        filterName = {newFilterName}
      />
    </div>
  )
}

export default App