import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, Row, Col, Image, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useGetProductDetailsQuery } from '../slices/productApiSlice'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { addToCart } from '../slices/cartSlice'

const getProductUnit = (product) => {
  if (product?.unit) {
    return product.unit
  }

  const text = `${product?.category || ''} ${product?.name || ''}`.toLowerCase()

  if (text.includes('paket') || text.includes('box') || text.includes('tanjir')) {
    return 'kom'
  }

  return 'kg'
}

const formatPrice = (price) =>
  new Intl.NumberFormat('sr-RS', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0)

const ProductScreen = () => {
  const { id: productId } = useParams()
  const [qty, setQty] = useState(1)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId)

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }))
    navigate('/cart')
  }

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return (
      <Message variant='danger'>
        {error?.data?.message || error.error}
      </Message>
    )
  }

  const unit = getProductUnit(product)
  const isAvailable = product.countInStock > 0

  return (
    <div className='product-detail'>
      <Link className='product-detail__back' to='/products'>
        Nazad na cenovnik
      </Link>

      <Row className='g-4 align-items-stretch'>
        <Col lg={7}>
          <div className='product-detail__media'>
            <Image src={product.image} alt={product.name} fluid />
          </div>
        </Col>

        <Col lg={5}>
          <section className='product-detail__panel'>
            <span className='product-detail__category'>{product.category}</span>
            <h1>{product.name}</h1>

            <Rating
              value={product.rating}
              text={`${product.numReviews} ocena`}
            />

            <p className='product-detail__description'>
              {product.description}
            </p>

            <div className='product-detail__price-row'>
              <div>
                <span>Cena</span>
                <strong>{formatPrice(product.price)} RSD</strong>
                <small>/{unit}</small>
              </div>

              {isAvailable ? (
                <span className='product-detail__badge'>Dostupno</span>
              ) : (
                <span className='product-detail__badge product-detail__badge--muted'>
                  Nije dostupno
                </span>
              )}
            </div>

            {isAvailable && (
              <div className='product-detail__qty'>
                <Form.Label>Kolicina</Form.Label>
                <Form.Control
                  as='select'
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </Form.Control>
              </div>
            )}

            <Button
              className='add-to-cart-btn product-detail__cta'
              type='button'
              disabled={!isAvailable}
              onClick={addToCartHandler}
            >
              Dodaj u korpu
            </Button>
          </section>
        </Col>
      </Row>
    </div>
  )
}

export default ProductScreen
