import React from 'react'
import HeroBooking from '../../Components/HeroBooking'
import TopArtisans from '../../Components/TopArtisans'
import Filter from '../../Components/Filter'
import TestimonialsSection from '../../Components/TestimonialSection'
import CookiesInfo from '../../Components/Others/CookiesInfo'

const Landing = () => {

  return (
    <div className='lg:mt-25 lg:pt-10'>
      <HeroBooking />
      <Filter />
      <TopArtisans />
      <TestimonialsSection />
      <CookiesInfo />
    </div>
  )
}

export default Landing
