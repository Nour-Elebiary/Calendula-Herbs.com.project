'use client'

import { useReducedMotion } from 'framer-motion'

export function AboutHero() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="about-hero relative overflow-hidden">
      {prefersReducedMotion ? (
        <div className="about-hero__fallback" />
      ) : (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://res.cloudinary.com/dkz99j6vt/image/upload/v1746600000/calendula-hero-fields_qy8t0p.webp"
            className="about-hero__video"
          >
            <source
              src="https://res.cloudinary.com/dcukpuftg/video/upload/v1782298734/calendula-herbs/videos/hero-about.mp4"
              type="video/mp4"
            />
          </video>
          <div className="about-hero__overlay" />
        </>
      )}
      <div className="about-hero__content">
        <h1 className="about-hero__title">About Calendula Herbs</h1>
        <p className="about-hero__description">
          Cultivating purity and delivering excellence for over four decades. We are dedicated to providing the world with the finest organic herbs, rooted in generations of agricultural expertise.
        </p>
      </div>
    </section>
  )
}
