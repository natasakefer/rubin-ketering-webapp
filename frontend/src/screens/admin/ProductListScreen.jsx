import { LinkContainer } from 'react-router-bootstrap';

import {
  Table,
  Button,
  Row,
  Col,
} from 'react-bootstrap';

import {
  FaEdit,
  FaPlus,
  FaTrash,
} from 'react-icons/fa';

import Message from '../../components/Message';
import Loader from '../../components/Loader';

import { toast } from 'react-toastify';

import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productApiSlice';

const ProductListScreen = () => {
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery();

  const [
    createProduct,
    { isLoading: loadingCreate },
  ] = useCreateProductMutation();

  const [
    deleteProduct,
    { isLoading: loadingDelete },
  ] = useDeleteProductMutation();

  // DELETE PRODUCT
  const deleteHandler = async (id) => {
    if (
      window.confirm(
        'Da li ste sigurni da želite da obrišete ovaj proizvod?'
      )
    ) {
      try {
        await deleteProduct(id).unwrap();

        toast.success(
          'Proizvod uspešno obrisan'
        );

        refetch();
      } catch (err) {
        toast.error(
          err?.data?.message || err.error
        );
      }
    }
  };

  // CREATE PRODUCT
  const createProductHandler = async () => {
    if (
      window.confirm(
        'Da li ste sigurni da želite da kreirate novi proizvod?'
      )
    ) {
      try {
        await createProduct().unwrap();

        refetch();
      } catch (err) {
        toast.error(
          err?.data?.message || err.error
        );
      }
    }
  };

  return (
    <div className='admin-page'>
      <Row className='admin-page__header align-items-center g-3'>
        <Col>
          <span className='section-eyebrow'>Admin panel</span>
          <h1>Proizvodi</h1>
          <p>Pregled, uređivanje i brzo dodavanje proizvoda iz cenovnika.</p>
        </Col>

        <Col md='auto' className='text-md-end'>
          <Button
            className='admin-primary-action'
            onClick={createProductHandler}
          >
            <FaPlus /> Kreirajte novi proizvod
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className='admin-table-card'>
          <Table
            hover
            responsive
            className='admin-table table-sm'
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>NAZIV</th>
                <th>CENA</th>
                <th>KATEGORIJA</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {products?.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price} RSD</td>
                  <td>{product.category}</td>
                  <td className='admin-table__actions'>
                    <LinkContainer
                      to={`/admin/product/${product._id}/edit`}
                    >
                      <Button
                        variant='light'
                        className='admin-icon-btn'
                      >
                        <FaEdit />
                      </Button>
                    </LinkContainer>

                    <Button
                      variant='danger'
                      className='admin-icon-btn admin-icon-btn--danger'
                      onClick={() =>
                        deleteHandler(product._id)
                      }
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProductListScreen;
