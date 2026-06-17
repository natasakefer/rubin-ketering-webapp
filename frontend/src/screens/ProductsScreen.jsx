import React, { useEffect, useMemo, useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import CatalogHero from '../components/CatalogHero'
import CatalogShowcase from '../components/CatalogShowcase'
import { useGetProductsQuery } from '../slices/productApiSlice'

const normalizeCategory = (value = '') => value.trim().toLowerCase()

const getProductKey = (product) => product._id || product.id

const categoryOptions = ['Sve', 'Slano', 'Dezerti']

const categoryMatches = (product, activeCategory) => {
  if (activeCategory === 'Sve') {
    return true
  }

  const category = normalizeCategory(product.category)

  if (activeCategory === 'Dezerti') {
    return ['dezerti', 'slatko'].includes(category)
  }

  return category === normalizeCategory(activeCategory)
}

const ProductsScreen = () => {
  const { data: products = [], isLoading, error } = useGetProductsQuery()
  const { hash } = useLocation()
  const [activeCategory, setActiveCategory] = useState('Sve')
  const [searchText, setSearchText] = useState('')

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory = categoryMatches(product, activeCategory)
      const matchesSearch = product.name
        .toLowerCase()
        .includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, products, searchText])

  const showcaseProducts = useMemo(
    () => filteredProducts.filter((product) => product.showcase),
    [filteredProducts]
  )

  useEffect(() => {
    if (!hash) {
      return
    }

    const categoryFromHash = hash.replace('#', '').toLowerCase()

    if (categoryFromHash === 'slano') {
      setActiveCategory('Slano')
    }

    if (['dezerti', 'slatko'].includes(categoryFromHash)) {
      setActiveCategory('Dezerti')
    }
  }, [hash])

  useEffect(() => {
    if (isLoading || !hash) {
      return
    }

    const target = document.querySelector('#catalog-controls')

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash, isLoading])

  return (
    <div className='catalog-page'>
      <CatalogHero />

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <section className='catalog-controls' id='catalog-controls'>
            <div className='catalog-filter' aria-label='Filter kategorije'>
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  type='button'
                  className={`catalog-filter__button ${
                    activeCategory === category ? 'active' : ''
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <Form.Control
              type='search'
              className='catalog-search'
              placeholder='Pretraga proizvoda'
              aria-label='Pretraga proizvoda po nazivu'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </section>

          <section className='catalog-section catalog-section--showcase'>
            <div className='catalog-section__intro'>
              <span className='section-eyebrow'>Preporuka</span>
              <h2>Izdvajamo iz ponude</h2>
              <p>
                Najtraženiji zalogaji iz naše ponude, filtrirani po kategoriji i
                pretrazi koju ste odabrali.
              </p>
            </div>

            {showcaseProducts.length > 0 ? (
              <CatalogShowcase products={showcaseProducts} />
            ) : (
              <Message>Nema izdvojenih proizvoda za izabrani filter.</Message>
            )}
          </section>

          <section className='catalog-section catalog-section--products'>
            <div className='catalog-section__intro'>
              <span className='section-eyebrow'>Cenovnik</span>
              <h2>Glavna lista proizvoda</h2>
              <p>
                Pregledajte kompletnu ponudu prema aktivnoj kategoriji i tekstu
                pretrage.
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <Row className='g-4'>
                {filteredProducts.map((product) => (
                  <Col key={getProductKey(product)} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Message>Nema proizvoda za izabrani filter.</Message>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default ProductsScreen
