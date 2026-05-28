import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import CatalogHero from '../components/CatalogHero'
import CatalogShowcase from '../components/CatalogShowcase'
import { useGetProductsQuery } from '../slices/productApiSlice'
import catalogProducts from '../products_list'

const normalizeCategory = (value = '') => value.trim().toLowerCase()

const getProductKey = (product) => product._id || product.id

const sectionConfig = [
  {
    title: 'Slano',
    eyebrow: 'Slani program',
    description:
      'Mini pice, burgeri, hot dog zalogaji, pite i kiflice u urednom ketering izdanju.',
    categories: ['slano'],
  },
  {
    title: 'Dezerti',
    eyebrow: 'Slatki program',
    description:
      'Krofnice, kolaci, rolat, bajadera, mafini i kremasti deserti za slatki sto.',
    categories: ['dezerti', 'slatko'],
  },
]

const CatalogSection = ({ config, products }) => {
  const sectionProducts = products.filter((product) =>
    config.categories.includes(normalizeCategory(product.category))
  )
  const showcaseProducts = sectionProducts.filter((product) => product.showcase)

  return (
    <section className='catalog-section'>
      <div className='catalog-section__intro'>
        <div>
          <span className='section-eyebrow'>{config.eyebrow}</span>
          <h2>{config.title}</h2>
          <p>{config.description}</p>
        </div>
      </div>

      <CatalogShowcase products={showcaseProducts} />

      {sectionProducts.length > 0 ? (
        <Row className='g-4'>
          {sectionProducts.map((product) => (
            <Col key={getProductKey(product)} sm={12} md={6} lg={4} xl={3}>
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
  const { isLoading, error } = useGetProductsQuery()

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
            products={catalogProducts}
          />
        ))
      )}
    </div>
  )
}

export default HomeScreen
