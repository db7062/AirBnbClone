import React, { useContext, useEffect, useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import axios from 'axios';
import { Navigate } from 'react-router';
import { UserContext } from '../UserContext';


export default function BookingWidget({place}) {
  const [checkIn,setCheckIn]=useState('');
  const [checkOut,setCheckOut]=useState('');
  const [numberOfGuest,setnumberOfGuest]=useState(1);
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [redirect,setRedirect]=useState('');
  const {user}=useContext(UserContext);

  useEffect(()=>{
    if(user){
      setName(user.name);
    }
  },[user]);



  let numDays=0;
  if(checkIn && checkOut){
    numDays=differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
  }

  async function bookThisPlace(){
    
   const response= await axios.post('/bookings',{checkIn,checkOut,numberOfGuest,name,phone, place:place._id, price:numDays*place.price ,

   });
  
   const  bookingId=response.data._id;
   setRedirect(`/account/booking/${bookingId}`);
  }


  if(redirect){
    return <Navigate to={redirect} />
  }


  return (
    <div className="bg-white shadow p-4 rounded-2xl">
    <div className="text-2xl text-center mb-1 ">
    Price: ${place.price} / per night  
    </div>

    <div className="border rounded-2xl">
    <div className="flex">
    <div className="py-3 px-4">
      <label className="">Check in:</label>
      <input type="date"  value={checkIn} onChange={ev=>setCheckIn(ev.target.value)} className="" />
    </div>

    <div className="py-3 px-4 border-l">
      <label className="">Check out:</label>
      <input type="date" value={checkOut} onChange={ev=>setCheckOut(ev.target.value)}  className="" />
    </div>
    </div>
    
    <div className="px-3 py-4 border-t">

      <label className="">
        Number of Guest
      </label>
      <input type="number" value={numberOfGuest} onChange={ev=>setnumberOfGuest(ev.target.value)}   className="" />
    </div>
    {numDays >0 && (
      <div className="px-3 py-4 border-t">

      <label className="">
       Your Full Name:
      </label>
      <input type="text" value={name} onChange={ev=>setName(ev.target.value)}   className="" />
      <label className="">
       Your Mobile Number:
      </label>
      <input type="tel" value={phone} onChange={ev=>setPhone(ev.target.value)}   className="" />
    </div>
    )}

    </div>
    

      <button onClick={bookThisPlace} className="primary mt-4">Book this place for :- 
        {numDays > 0 && (
          <span> ${numDays*place.price}</span>
        )}
        
        
        
        </button>   
  </div>
  )
}
