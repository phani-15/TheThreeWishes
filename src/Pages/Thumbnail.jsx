import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function Thumbnail() {
  const navigate = useNavigate()
  const lampRef = useRef(null)

  useEffect(() => {
    gsap.to(lampRef.current, {
      y: -20,                 // move up
      duration: 1.5,
      ease: "power1.inOut",   // ease-in-out effect
      repeat: -1,             // infinite loop
      yoyo: true              // go back smoothly
    })
  }, [])

  return (
    <div className='bg-[url("/images/thumbnail.png")] bg-center bg-cover h-screen w-screen'>
      <img 
        ref={lampRef}
        src="/images/lamp.png" 
        onClick={() => navigate('/home')}
        className='w-40 absolute right-3 bottom-0 py-4 cursor-pointer'
        alt="lamp"
      />
    </div>
  )
}