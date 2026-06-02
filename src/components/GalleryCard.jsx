function GalleryCard({ caption, color = 'pink', index }) {
  return (
    <figure className={`gallery-card sticker-card placeholder-${color}`}>
      <div className="gallery-image" role="img" aria-label={`${caption} grooming photo placeholder`}>
        <span className="sparkle">✦</span>
        <span className="dog-face">🐶</span>
        <span className="bubble bubble-one" />
        <span className="bubble bubble-two" />
      </div>
      <figcaption>
        <strong>{caption}</strong>
        <span>Photo spot #{index}</span>
      </figcaption>
    </figure>
  )
}

export default GalleryCard
