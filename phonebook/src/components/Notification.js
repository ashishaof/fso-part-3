import React from 'react';

  const Notification = ({notification}) => {
    const {message, classStyle} = notification
  
  
    if (message === null ) {
      return null
    }
   
    return (
      <div className={classStyle}>
      {message}
      </div>
    )
}

export default Notification;
