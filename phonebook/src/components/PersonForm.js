import React from 'react';



const PersonFrom = (props) =>{
    const {onSubmitAddContact, newName, handleNameChange, newNumber, handleNumberChange} =props;
    return(
        <div>
             <form onSubmit={onSubmitAddContact}>
                <div>
                name: <input 
                            value={newName} 
                            onChange={handleNameChange}
                            type="text" 
                            required
                            />
                </div>
                <div>
                number: <input 
                            value={newNumber} 
                            onChange={handleNumberChange}
                            type="number"
                            required 
                            />
                </div>
                <div>
                <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

export default PersonFrom;