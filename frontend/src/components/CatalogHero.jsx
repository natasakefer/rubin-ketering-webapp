const CatalogHero = () => {
  return (
    <section
      className='catalog-hero'
      style={{ '--catalog-hero-image': `url(${process.env.PUBLIC_URL}/images/IMG_0331.jpeg)` }}
    >
      <div className='catalog-hero__content'>
        <span className='section-eyebrow'>Rubin Ketering</span>
        <h1>Cenovnik</h1>
        <p>
          Slani zalogaji, dezerti i box pakovanja za proslave, rodjendane i
          poslovne dogadjaje.
        </p>
      </div>
    </section>
  )
}

export default CatalogHero
