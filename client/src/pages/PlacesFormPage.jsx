import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import Perks from "../Perks";
import AccountNavbar from "../AccountNavbar";

export default function PlacesFormPage() {
  const { id } = useParams();
  console.log({ id });

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addPhotos, setAddPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setextraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuest, setMaxGuest] = useState(1);
  const [price, setPrice] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setextraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuest(data.maxGuest);
      setPrice(data.price);
    });
  }, [id]);

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    setAddPhotos((prev) => {
      return [...prev, filename];
    });
    setPhotoLink("");
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setAddPhotos((prev) => {
          return [...prev, ...filenames];
        });
      });
  }

  function removePhoto(ev,filename){
    ev.preventDefault();
    setAddPhotos([...addPhotos.filter(photo => photo !== filename)])


  }





  async function savePlace(ev) {
    ev.preventDefault();
    if (id) {
      await axios.put("/places", {
        id,
        title,
        address,
        addPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest,
        price,
      });
      setRedirect(true);
    } else {
      await axios.post("/places", {
        title,
        address,
        addPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest,
        price,
      });
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }



  function selectAsMainPhoto(ev,filename){
    ev.preventDefault();
   const addPhotosWithoutSelected=addPhotos.filter(photo=> photo !== filename);

   const  newAddPhotos=[filename,...addPhotosWithoutSelected];

   setAddPhotos(newAddPhotos);

  };

  return (
    <div>
      <AccountNavbar />
      <form onSubmit={savePlace}>
        <h2 className="text-2xl mt-4">Title</h2>
        <p className="text-gray-500 text-sm">
          Title for your place. It should be short and catchy
        </p>
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="title"
        />

        <h2 className="text-2xl mt-4">Address</h2>
        <p className="text-gray-500 text-sm">Address to this place</p>
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="address"
        />

        <h2 className="text-2xl mt-4">Photos</h2>
        <p className="text-gray-500 text-sm">More=Better</p>
        <div className="flex gap-2">
          <input
            value={photoLink}
            onChange={(ev) => setPhotoLink(ev.target.value)}
            type="text"
            placeholder={"Add photos using link"}
          />
          <button
            onClick={addPhotoByLink}
            className="bg-gray-200 px-4 rounded-2xl"
          >
            Add&nbsp;photo
          </button>
        </div>
        <div className=" mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {addPhotos.length > 0 &&
            addPhotos.map((link) => (
              <div className="h-32 flex relative" key={link}>
                <img
                  className="rounded-2xl w-full object-cover position-center"
                  src={"http://localhost:4000/uploads/" + link}
                />
                <button onClick={ev=> removePhoto(ev,link)} className=" cursor-pointer  absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-xl py-2 px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>


                <button onClick={ev=> selectAsMainPhoto(ev,link)} className=" cursor-pointer  absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-xl py-2 px-3">
                  {link === addPhotos[0] && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                  </svg>
                  
                  )}

                  {link !== addPhotos[0] && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  
                  )}
                  
                </button>

              
              </div>
            ))}
          <label className=" h-32 cursor-pointer flex items-center gap-1 border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={uploadPhoto}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-8"
            >
              <path
                fillRule="evenodd"
                d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            Upload
          </label>
        </div>

        <h2 className="text-2xl mt-4">Description</h2>
        <p className="text-gray-500 text-sm">
          Add a little bit of description for your place{" "}
        </p>
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />

        <h2 className="text-2xl mt-4">Perks</h2>
        <p className="text-gray-500 text-sm">What are your perks?</p>
        <Perks selected={perks} onChange={setPerks} />

        <h2 className="text-2xl mt-4">Extra Info</h2>
        <p className="text-gray-500 text-sm">house rules, etc</p>
        <textarea
          value={extraInfo}
          onChange={(ev) => setextraInfo(ev.target.value)}
        />

        <h2 className="text-2xl mt-4">Check-In and Check-Out times</h2>
        <p className="text-gray-500 text-sm">add-check in and out</p>
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check-In</h3>
            <input
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              type="text"
              placeholder="eg:-14:
        00  "
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check-Out</h3>
            <input
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              type="text"
              placeholder="eg:-11:00  "
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max Number of Guests</h3>
            <input
              value={maxGuest}
              onChange={(ev) => setMaxGuest(ev.target.value)}
              type="text"
            />
          </div>
          <div>
          <h2 className="mt-2 -mb-1">Price Per Night</h2>
          
          <input
            value={price}
            onChange={(ev) => setPrice(ev.target.value)}
            type="text"
          />
        </div>
        </div>

    
        <button className="primary mt-3">Save</button>
      </form>
    </div>
  );
}
