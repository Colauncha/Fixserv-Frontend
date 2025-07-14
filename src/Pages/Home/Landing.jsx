import React from 'react'
import HeroBooking from '../../Components/HeroBooking'
import TopArtisans from '../../Components/TopArtisans'
import Location from '../../Components/Location'
import Filter from '../../Components/Filter'
import TestimonialsSection from '../../Components/TestimonialSection'

const Landing = () => {

  return (
    <div className='mt-25 pt-10'>
      <HeroBooking />
      <Filter />
      <TopArtisans />
      <TestimonialsSection />  
    </div>
  )
}

export default Landing
