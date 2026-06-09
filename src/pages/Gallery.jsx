import GalleryCard from '../components/GalleryCard'

const galleryItems = [
  { caption: 'Fresh Groom', image: '/manny%20clients/dog1.png' },
  { caption: 'Happy Pup', image: '/manny%20clients/dog2.png' },
  { caption: 'Fluffy Finish', image: '/manny%20clients/dog3.png' },
  { caption: 'Clean Cut', image: '/manny%20clients/dog4.png' },
  { caption: 'Doodle Style', image: '/manny%20clients/dog5.png' },
  { caption: 'Pampered Pup', image: '/manny%20clients/dog6.png' },
]

function Gallery() {
  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Gallery</p>
        <h1>Fresh Fur Hall of Fame</h1>
        <p>A few examples of Manny&apos;s grooming work and happy client pups.</p>
      </div>

      <div className="gallery-grid">
        {galleryItems.map((item, index) => (
          <GalleryCard key={`${item.caption}-${index}`} {...item} />
        ))}
      </div>
    </section>
  )
}

export default Gallery
