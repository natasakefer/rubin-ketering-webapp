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
    <>
      {/* HEADER */}
      <Row className='align-items-center'>

        <Col>
          <h1>Proizvodi</h1>
        </Col>

        <Col className='text-end'>
          <Button
            className='btn-sm m-3'
            onClick={createProductHandler}
          >
            <FaPlus /> Kreirajte Novi Proizvod
          </Button>
        </Col>

      </Row>

      {/* LOADERS */}
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {/* CONTENT */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            className='table-sm'
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

                  {/* ACTIONS */}
                  <td>

                    {/* EDIT */}
                    <LinkContainer
                      to={`/admin/product/${product._id}/edit`}
                    >
                      <Button
                        variant='light'
                        className='btn-sm mx-2'
                      >
                        <FaEdit />
                      </Button>
                    </LinkContainer>

                    {/* DELETE */}
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() =>
                        deleteHandler(product._id)
                      }
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* PAGINATION PLACEHOLDER */}
        </>
      )}
    </>
  );
};

export default ProductListScreen;
