import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Address from '../Address';
import PlaceGallery from '../PlaceGallery';
import BookingDates from '../BookingDates';
import { differenceInCalendarDays } from 'date-fns';

export default function IndiBooking() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return '';
  }

  return (
    <div className='my-8'>
      <h1 className='text-3xl'>{booking.place.title}</h1>
      <Address className="my-2 block">{booking.place.address}</Address>
      <div className="bg-gray-200 p-4 mb-4 rounded-2xl">
        <h2 className="text-xl">Your Booking Information</h2>
        <BookingDates booking={booking} />
        <div className="flex justify-between items-center">
          <div className='items-center'>
            Number of nights: {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))}
          </div>
          <div className="bg-primary text-white p-2 rounded-xl text-xl">
            Total price: ${booking.price}
          </div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}
