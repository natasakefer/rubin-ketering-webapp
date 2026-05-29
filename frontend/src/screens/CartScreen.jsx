import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, Form, Button } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'
import { addToCart, removeFromCart } from '../slices/cartSlice'

const formatPrice = (price) =>
  new Intl.NumberFormat('sr-RS', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0)

const getProductUnit = (product) => product.unit || 'kom'

const CartScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0)
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  )

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }))
  }

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping')
  }

  return (
    <div className='cart-page'>
      <div className='cart-page__header'>
        <span className='section-eyebrow'>Tvoja porudzbina</span>
        <h1>Korpa</h1>
        <p>Pregledaj proizvode, prilagodi kolicine i nastavi na checkout.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className='cart-empty'>
          <h2>Korpa je prazna</h2>
          <p>Dodaj omiljene slane zalogaje ili dezert boxove iz cenovnika.</p>
          <Link className='btn btn-primary' to='/products'>
            Pogledaj cenovnik
          </Link>
        </div>
      ) : (
        <Row className='g-4 align-items-start'>
          <Col lg={8}>
            <div className='cart-items'>
              {cartItems.map((item) => (
                <article className='cart-item' key={item._id}>
                  <Link to={`/product/${item._id}`} className='cart-item__image'>
                    <Image src={item.image} alt={item.name} />
                  </Link>

                  <div className='cart-item__details'>
                    <span>{item.category}</span>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                    <small>
                      {formatPrice(item.price)} RSD/{getProductUnit(item)}
                    </small>
                  </div>

                  <div className='cart-item__controls'>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>

                    <Button
                      type='button'
                      aria-label={`Ukloni ${item.name}`}
                      className='cart-item__remove'
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>

                  <div className='cart-item__total'>
                    {formatPrice(item.qty * item.price)} RSD
                  </div>
                </article>
              ))}
            </div>
          </Col>

          <Col lg={4}>
            <aside className='cart-summary'>
              <span className='section-eyebrow'>Rezime</span>
              <h2>Ukupno</h2>

              <div className='cart-summary__row'>
                <span>Broj proizvoda</span>
                <strong>{totalItems}</strong>
              </div>

              <div className='cart-summary__row'>
                <span>Ukupna Cena</span>
                <strong>{formatPrice(totalPrice)} RSD</strong>
              </div>

              <p>
                Dostava i nacin placanja se biraju u sledecem koraku.
              </p>

              <Button
                type='button'
                className='add-to-cart-btn cart-summary__cta'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Nastavi na checkout
              </Button>

              <Link className='cart-summary__link' to='/products'>
                Nastavi kupovinu
              </Link>
            </aside>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default CartScreen
