import GalleryCard from '../components/GalleryCard'

const galleryItems = [
  { caption: 'Before & After', color: 'pink' },
  { caption: 'Fresh Groom', color: 'blue' },
  { caption: 'Happy Pup', color: 'yellow' },
  { caption: 'Fluffy Finish', color: 'blue' },
  { caption: 'Bubble Bath', color: 'yellow' },
  { caption: 'Doodle Glow-Up', color: 'pink' },
]

function Gallery() {
  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Gallery</p>
        <h1>Fresh Fur Hall of Fame</h1>
        <p>Placeholder photo cards are ready to swap with real grooming photos later.</p>
      </div>

      <div className="gallery-grid">
        {galleryItems.map((item, index) => (
          <GalleryCard key={`${item.caption}-${index}`} index={index + 1} {...item} />
        ))}
      </div>
    </section>
  )
}

export default Gallery
