function ServiceCard({ icon, title, description }) {
  return (
    <article className="service-card sticker-card">
      <span className="card-icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

export default ServiceCard
