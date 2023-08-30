import React from 'react';
import Card from 'react-bootstrap/Card';

const AuthorCard = ({ avatar, dateOfBirth, email, name, surname, authorImg }) => {
  return (
    <Card body className='m-1'>
      <div className='d-flex'>
        <div className='myAuthorImg-md' style={{ backgroundImage: `url(${authorImg})` }}>
        </div>

        <div className='ms-4'>
          <div><i className='text-primary'>{name} {surname}</i> - {email}</div>
          <div>{name} {surname} <i>nato/a il</i> {dateOfBirth}</div>
        </div>
      </div>
    </Card>
  )
}

export default AuthorCard