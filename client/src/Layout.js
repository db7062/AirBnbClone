//this route is created becoz we dont want to add header and gooter to each page individually except we will create a layout

import React from 'react'
import { Outlet } from 'react-router'
import Header from './Header'



export default function () {
  return (
    <div className='py-4 px-8 flex flex-col min-h-screen'>
      <Header/>
      <Outlet/>
    </div>
  )
}
