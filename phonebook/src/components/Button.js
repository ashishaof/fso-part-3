
import React from 'react'

const Button = ({handleDeleteContact, text}) => {
  return (
    <button onClick={handleDeleteContact} className ="buttonDelete"> {text} </button>
  )
}

export default Button