import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../slices/cartSlice'
import Rating from './Rating'

const getProductUnit = (product) => {
  if (product.unit) {
    return product.unit
  }

  const text = `${product.category} ${product.name}`.toLowerCase()

  if (text.includes('paket') || text.includes('box') || text.includes('tanjir')) {
    return 'kom'
  }

  return 'kg'
}

const formatPrice = (price) =>
  new Intl.NumberFormat('sr-RS', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

const Product = ({product}) => {
  const dispatch = useDispatch()
  const unit = getProductUnit(product)
  const isAvailable = product.countInStock > 0

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: 1 }))
  }

  return (
    <Card className='product-card'>
      <Link to={`/product/${product._id}`} className='product-card__image-link'>
        <Card.Img src={product.image} alt={product.name} />
      </Link>

      <Card.Body className='product-card__body'>
        <div>
          <span className='product-card__category'>{product.category}</span>
          <Link to={`/product/${product._id}`} className='product-card__title'>
            {product.name}
          </Link>
        </div>

        <Rating value={product.rating} text={`${product.numReviews} ocena`} />

        <div className='product-card__footer'>
          <div>
            <strong>{formatPrice(product.price)} RSD</strong>
            <span>/{unit}</span>
          </div>
          <Button
            type='button'
            className='add-to-cart-btn'
            disabled={!isAvailable}
            onClick={addToCartHandler}
          >
            Dodaj
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Product
