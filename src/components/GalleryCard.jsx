function GalleryCard({ caption, image }) {
  return (
    <figure className="gallery-card sticker-card">
      <div className="gallery-image">
        <img className="gallery-photo" src={image} alt={`${caption} grooming example`} loading="lazy" />
      </div>
      <figcaption>
        <strong>{caption}</strong>
      </figcaption>
    </figure>
  )
}

export default GalleryCard
