import axios from "axios";
import React, { useEffect, useState } from 'react';
import AccountNavbar from '../AccountNavbar';
import PlaceImg from "../PlaceImg";
import {differenceInCalendarDays, format} from "date-fns";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";


export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
 
  useEffect(() => {
    axios.get('/bookings').then(response => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div>
      <AccountNavbar />
      <div>
        {bookings?.length > 0 && bookings.map(booking => (
          <Link to={`/account/booking/${booking._id}`} className=" mt-4 flex gap-4 bg-gray-200 rounded-2xl overflow-hidden" >  
          <div className="w-48">
            <PlaceImg place={booking.place} />
            </div>  

            <div  className="py-3 pr-3 grow">
            <h2 className="text-xl whitespace-nowrap">{booking.place.title}</h2>


            <div className="text-xl">

           <BookingDates booking={booking} /> 
             </div>
             
          
             
             </div>
            
             </Link>
             
        ))}
      </div>
    </div>
  );
}

