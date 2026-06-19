import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, Row, Col, Image, Button, ListGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaRegCommentDots, FaStar } from 'react-icons/fa'
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
  const [hoverRating, setHoverRating] = useState(0)
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
    toast.success('Proizvod je dodat u korpu', {
      position: 'bottom-right',
      autoClose: 2600,
    })
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
                <Form.Label>Količina</Form.Label>
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

      <section className='reviews-section'>
        <div className='reviews-section__header'>
          <span className='section-eyebrow'>Utisci</span>
          <h2>Recenzije</h2>
          <p>Pogledajte iskustva kupaca ili podelite svoj utisak o proizvodu.</p>
        </div>

        <Row className='g-4'>
          <Col lg={7}>
            <div className='reviews-list-card'>
              {product.reviews.length === 0 && (
                <div className='reviews-empty'>
                  <div className='reviews-empty__icon'>
                    <FaRegCommentDots />
                  </div>
                  <h3>Još nema recenzija</h3>
                  <p>Budite prvi koji će ostaviti utisak o ovom proizvodu.</p>
                </div>
              )}

              <ListGroup variant='flush' className='reviews-list'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id} className='review-card'>
                    <div className='review-card__top'>
                      <div>
                        <strong>{review.name}</strong>
                        <p>{review.createdAt.substring(0, 10)}</p>
                      </div>
                      <Rating value={review.rating} />
                    </div>
                    <p className='review-card__comment'>{review.comment}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>

          <Col lg={5}>
            <aside className='review-form-card'>
              <div className='review-form-card__header'>
                <span>Vaš utisak</span>
                <h3>Ostavite recenziju</h3>
              </div>

              {loadingReview && <Loader />}

              {userInfo ? (
                <Form className='review-form' onSubmit={submitReviewHandler}>
                  <Form.Group controlId='rating'>
                    <Form.Label>Ocena</Form.Label>
                    <div className='review-rating-picker' role='radiogroup' aria-label='Ocena proizvoda'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type='button'
                          className={`review-rating-picker__star ${
                            (hoverRating || rating) >= star ? 'active' : ''
                          }`}
                          aria-label={`${star} od 5`}
                          aria-pressed={rating === star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onFocus={() => setHoverRating(star)}
                          onBlur={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group controlId='comment'>
                    <Form.Label>Komentar</Form.Label>
                    <Form.Control
                      as='textarea'
                      rows='4'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    type='submit'
                    variant='primary'
                    className='review-submit'
                    disabled={loadingReview}
                  >
                    Pošalji
                  </Button>
                </Form>
              ) : (
                <Message>
                  Morate se prijaviti da biste ostavili recenziju.
                </Message>
              )}
            </aside>
          </Col>
        </Row>
      </section>
    </div>
  )
}

export default ProductScreen
