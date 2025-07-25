import React from 'react'
import HeroBooking from '../../Components/HeroBooking'
import TopArtisans from '../../Components/TopArtisans'
import Location from '../../Components/Location'
import Filter from '../../Components/Filter'
import TestimonialsSection from '../../Components/TestimonialSection'

const Landing = () => {

  return (
    <div className='lg:mt-25 lg:pt-10'>
      <HeroBooking />
      <Filter />
      <TopArtisans />
      <TestimonialsSection />  
    </div>
  )
}

export default Landing
