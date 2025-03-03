import React, { useState } from 'react'

export default function PlaceGallery({place}) {
  const [showAllPhotos,setShowAllPhotos]=useState(false);



  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white min-h-screen">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className="text-3xl">Photos of {place.title}</h2>

            
            <button onClick={() => setShowAllPhotos(false)} className="text-black fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
          <div className="flex flex-col items-center gap-6">
            {place?.photos?.length > 0 &&
              place.photos.map(photo => (
                <div key={photo} className="w-70 h-70 md:w-99 md:h-96 flex justify-center items-center overflow-hidden bg-gray-200">
                  <img className="w-full h-full object-cover" src={`http://localhost:4000/uploads/${photo}`} alt="" />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="relative px-20 py-0">
    <div className="grid gap-2 md:grid-cols-[2fr_1fr]">
      {/* Large main image */}
      <div className="relative aspect-w-14 aspect-h-8">
        {place.photos?.[0] && (
          <img
            className='object-cover w-full h-full rounded-l-lg'
            src={'http://localhost:4000/uploads/' + place.photos[0]}
            alt="Main lodge view"
          />
        )}
      </div>

      {/* Two smaller images stacked vertically */}
      <div className="hidden md:grid grid-rows-2 gap-2 relative">
        {place.photos?.slice(1, 3).map((photo, index) => (
          <div key={index} className="relative">
            <img onClick={()=>setShowAllPhotos(true)}
              className={`object-cover w-full h-full cursor-pointer ${index === 0 ? 'rounded-tr-lg' : 'rounded-br-lg'}`}
              src={'http://localhost:4000/uploads/' + photo}
              alt={`Lodge view ${index + 2}`}
            />
            {index === 1 && (
              <button
                onClick={() => setShowAllPhotos(true)}
                className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-m">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                Show More
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}
