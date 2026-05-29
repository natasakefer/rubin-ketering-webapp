import React from 'react'
import { Link } from 'react-router-dom'

const categoryCards = [
  {
    title: 'Slano',
    text: 'Mini pice, kiflice, kanapei i box pakovanja za proslave.',
    image: '/images/IMG_0131.jpeg',
    to: '/products#slano',
  },
  {
    title: 'Slatko',
    text: 'Krofnice, kolaci, casice i deserti za elegantan slatki sto.',
    image: '/images/IMG_0331.jpeg',
    to: '/products#slatko',
  },
]

const testimonials = [
  {
    text: 'Sve je stiglo uredno, lepo upakovano i spremno za serviranje. Gosti su prvo primetili izgled, pa tek onda ukus.',
    author: 'Milica',
  },
  {
    text: 'Odlican izbor za rodjendan. Slani boxevi su bili prakticni, a deserti su izgledali bas posebno na stolu.',
    author: 'Jovana',
  },
  {
    text: 'Profesionalna komunikacija i jako lep vizuelni utisak. Porudzbina je delovala pazljivo pripremljeno.',
    author: 'Ana',
  },
]

const HomeScreen = () => {
  return (
    <div className='home-page'>
      <section
        className='home-hero'
        style={{ '--home-hero-image': 'url(/images/prazneBox.jpg)' }}
      >
        <div className='home-hero__content'>
          <span className='section-eyebrow'>Ketering za posebne trenutke</span>
          <h1>Rubin Ketering</h1>
          <p>
            Elegantni slani zalogaji, deserti i box pakovanja za rođendane,
            proslave i poslovne događaje.
          </p>
          <Link className='home-hero__cta' to='/products'>
            Pogledaj cenovnik
          </Link>
        </div>
      </section>

      <section className='home-section'>
        <div className='home-section__heading'>
          <span className='section-eyebrow'>Izaberi program</span>
          <h2>Slano ili slatko, sve je spremno za serviranje</h2>
          <p>
            Kategorije su organizovane tako da lako pronadjes boxeve, zalogaje
            i dezerte za svoj događaj.
          </p>
        </div>

        <div className='featured-categories'>
          {categoryCards.map((category) => (
            <Link
              className='featured-category'
              key={category.title}
              style={{ '--category-image': `url(${category.image})` }}
              to={category.to}
            >
              <div>
                <span>{category.title}</span>
                <p>{category.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className='home-about'>
        <div className='home-about__copy'>
          <span className='section-eyebrow'>O nama</span>
          <h2>Ručno pripremljen ketering sa pažnjom na svaki detalj</h2>
          <p>
            Rubin Ketering pravi slane i slatke zalogaje za porodične proslave,
            rodjendane, druženja i poslovne pauze. Fokus je na urednoj
            prezentaciji, pouzdanoj pripremi i ukusu koji se lako uklapa u svaki
            sto.
          </p>
        </div>

        <div className='home-contact'>
          <div>
            <span>Lokacija</span>
            <strong>Temerin, Srbija</strong>
          </div>
          <div>
            <span>Adresa</span>
            <strong>Nikole Pašića 123</strong>
          </div>
          <div>
            <span>Telefon</span>
            <strong>+381 62 487878</strong>
          </div>
          <div>
            <span>Radno vreme</span>
            <strong>Pon - Sub, 09:00 - 18:00</strong>
          </div>
        </div>
      </section>

      <section className='home-section home-section--testimonials'>
        <div className='home-section__heading'>
          <span className='section-eyebrow'>Utisci</span>
          <h2>Mali detalji koji ostaju zapamćeni</h2>
        </div>

        <div className='testimonials'>
          {testimonials.map((testimonial) => (
            <article className='testimonial' key={testimonial.author}>
              <p>"{testimonial.text}"</p>
              <strong>{testimonial.author}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomeScreen
