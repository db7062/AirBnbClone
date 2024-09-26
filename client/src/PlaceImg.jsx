import React from 'react'

export default function PlaceImg({place}) {

  if(!place.photos?.length){
    return '';
  }


  return (
    
      <img className='object-cover' src={'http://localhost:4000/uploads/'+ place.photos[0]} alt=""/>

  )
}
