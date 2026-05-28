import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import CatalogHero from '../components/CatalogHero'
import CatalogShowcase from '../components/CatalogShowcase'
import { useGetProductsQuery } from '../slices/productApiSlice'
import catalogProducts from '../products_list'

const sectionConfig = [
  {
    title: 'Slano',
    eyebrow: 'Slani program',
    description:
      'Mini pice, burgeri, hot dog zalogaji, pite i kiflice u urednom ketering izdanju.',
    match: (product) => {
      const text = `${product.category} ${product.name}`.toLowerCase()
      return (
        text.includes('slano') ||
        text.includes('slan') ||
        text.includes('pice') ||
        text.includes('burger') ||
        text.includes('hot dog') ||
        text.includes('pita') ||
        text.includes('kiflice')
      )
    },
  },
  {
    title: 'Dezerti',
    eyebrow: 'Slatki program',
    description:
      'Krofnice, kolaci, rolat, bajadera, mafini i kremasti deserti za slatki sto.',
    match: (product) => {
      const text = `${product.category} ${product.name}`.toLowerCase()
      return (
        text.includes('dezert') ||
        text.includes('slatk') ||
        text.includes('kolac') ||
        text.includes('krofnice') ||
        text.includes('rolat') ||
        text.includes('bajadera') ||
        text.includes('mafini') ||
        text.includes('sladoled')
      )
    },
  },
]

const CatalogSection = ({ config, products }) => {
  const sectionProducts = products.filter(config.match)

  return (
    <section className='catalog-section'>
      <div className='catalog-section__intro'>
        <div>
          <span className='section-eyebrow'>{config.eyebrow}</span>
          <h2>{config.title}</h2>
          <p>{config.description}</p>
        </div>
      </div>

      <CatalogShowcase products={sectionProducts} />

      {sectionProducts.length > 0 ? (
        <Row className='g-4'>
          {sectionProducts.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      ) : (
        <Message>Trenutno nema proizvoda u ovoj kategoriji.</Message>
      )}
    </section>
  )
}

const HomeScreen = () => {
  const { data: products = [], isLoading, error } = useGetProductsQuery()
  const displayProducts = products.length >= catalogProducts.length ? products : catalogProducts

  return (
    <div className='catalog-page'>
      <CatalogHero />

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        sectionConfig.map((config) => (
          <CatalogSection
            key={config.title}
            config={config}
            products={displayProducts}
          />
        ))
      )}
    </div>
  )
}

export default HomeScreen
