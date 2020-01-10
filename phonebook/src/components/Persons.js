import React from 'react';
import Button from './Button';



const Persons = ({handleDeleteContact, persons, filterName}) => {

        const names = () => persons.map(person => {
          if (person.name.toLowerCase().includes(filterName.toLowerCase())) {
            return (<span key={person.name}>
                    <p>{person.name}  {person.number} 
                    <Button  handleDeleteContact= {event => handleDeleteContact(person.id, event)}
                                                          text ="delete"
                                                           />  
                    </p>                  
                 </span>);
          } else {
            return '';
          }
        });
    return (
      <div>  
           {names()}
      </div>
    )
  }

 
  export default Persons;