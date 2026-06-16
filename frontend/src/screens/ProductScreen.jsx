import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, Row, Col, Image, Button, ListGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productApiSlice'
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
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.auth)

  const {
    data: product,
    refetch,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId)

  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation()

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }))
    navigate('/cart')
  }

  const submitReviewHandler = async (e) => {
    e.preventDefault()

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap()

      setRating(0)
      setComment('')
      refetch()
      toast.success('Recenzija je dodata')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
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

      <Row className='mt-4'>
        <Col md={7}>
          <h2>Recenzije</h2>

          {product.reviews.length === 0 && (
            <Message>Jos uvek nema recenzija.</Message>
          )}

          <ListGroup variant='flush'>
            {product.reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating value={review.rating} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={5}>
          <h2>Ostavite recenziju</h2>

          {loadingReview && <Loader />}

          {userInfo ? (
            <Form onSubmit={submitReviewHandler}>
              <Form.Group controlId='rating' className='my-2'>
                <Form.Label>Ocena</Form.Label>
                <Form.Control
                  as='select'
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value=''>Izaberite ocenu</option>
                  <option value='1'>1 - Lose</option>
                  <option value='2'>2 - Moze bolje</option>
                  <option value='3'>3 - Dobro</option>
                  <option value='4'>4 - Vrlo dobro</option>
                  <option value='5'>5 - Odlicno</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId='comment' className='my-2'>
                <Form.Label>Komentar</Form.Label>
                <Form.Control
                  as='textarea'
                  rows='3'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>

              <Button
                type='submit'
                variant='primary'
                disabled={loadingReview}
              >
                Posalji
              </Button>
            </Form>
          ) : (
            <Message>
              Morate se prijaviti da biste ostavili recenziju.
            </Message>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default ProductScreen
