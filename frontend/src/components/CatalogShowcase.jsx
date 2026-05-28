import { Link } from 'react-router-dom'

const CatalogShowcase = ({ products }) => {
  if (products.length === 0) {
    return null
  }

  return (
    <div className='catalog-showcase'>
      {products.map((product, index) => (
        <Link
          to={`/product/${product._id}`}
          className={`catalog-showcase__card ${
            index === 0 ? 'catalog-showcase__card--large' : ''
          }`}
          key={product._id}
        >
          <img src={product.image} alt={product.name} />
          <div>
            <span>{product.category}</span>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default CatalogShowcase
