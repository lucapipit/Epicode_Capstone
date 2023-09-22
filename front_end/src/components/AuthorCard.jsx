import React from 'react';

const AuthorCard = ({ dateOfBirth, email, name, surname, authorImg }) => {
  return (
    <div className='m-1 myAuthorCard p-3 rounded-4'>
      <div className='d-flex'>
        <div className='myAuthorImg-md' style={{ backgroundImage: `url(${authorImg})`}}></div>

        <div className='ms-4'>
          <p><i className='text-primary'>{name} {surname}</i> - {email}</p>
          <p>{name} {surname} <i>nato/a il</i> {dateOfBirth}</p>
        </div>
      </div>
    </div>
  )
}

export default AuthorCard