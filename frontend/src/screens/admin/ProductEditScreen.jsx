import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  Form,
  Button,
  FormControl,
} from 'react-bootstrap';

import { toast } from 'react-toastify';

import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';

import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  // STATE
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('kg');
  const [showcase, setShowcase] = useState(false);
  const [countInStock, setCountInStock] =
    useState(0);
  const [description, setDescription] =
    useState('');

  // API
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [
    updateProduct,
    { isLoading: loadingUpdate },
  ] = useUpdateProductMutation();

  const [
    uploadProductImage,
    { isLoading: loadingUpload },
  ] = useUploadProductImageMutation();

  const navigate = useNavigate();

  // LOAD PRODUCT DATA
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category);
      setUnit(product.unit || 'kg');
      setShowcase(Boolean(product.showcase));
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  // SUBMIT FORM
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        category,
        unit,
        showcase,
        description,
        countInStock,
      }).unwrap();

      toast.success(
        'Proizvod ažuriran uspešno'
      );

      refetch();

      navigate('/admin/productlist');
    } catch (err) {
      toast.error(
        err?.data?.message || err.error
      );
    }
  };

  // IMAGE UPLOAD
  const uploadFileHandler = async (e) => {
    const formData = new FormData();

    formData.append(
      'image',
      e.target.files[0]
    );

    try {
      const res =
        await uploadProductImage(
          formData
        ).unwrap();

      setImage(res.image);

      toast.success(
        'Slika uspešno otpremljena'
      );
    } catch (err) {
      toast.error(
        err?.data?.message || err.error
      );
    }
  };

  return (
    <div className='admin-page'>
      <Link
        to='/admin/productlist'
        className='admin-back-link'
      >
        Nazad
      </Link>

      <FormContainer>
        <div className='admin-form-card'>
          <div className='admin-page__header admin-page__header--compact'>
            <span className='section-eyebrow'>Admin panel</span>
            <h1>Izmena proizvoda</h1>
            <p>Ažurirajte naziv, cenu, sliku i detalje koji se prikazuju u katalogu.</p>
          </div>

          {loadingUpdate && <Loader />}
          {loadingUpload && <Loader />}

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Form className='admin-form' onSubmit={submitHandler}>
              <Form.Group controlId='name'>
                <Form.Label>Naziv</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Upišite naziv proizvoda'
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group controlId='price'>
                <Form.Label>Cena</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Upišite cenu proizvoda'
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group controlId='image'>
                <Form.Label>Slika</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='URL slike proizvoda'
                  value={image}
                  onChange={(e) =>
                    setImage(e.target.value)
                  }
                />

                <FormControl
                  className='admin-file-input'
                  type='file'
                  onChange={uploadFileHandler}
                />
              </Form.Group>

              <Form.Group controlId='countInStock'>
                <Form.Label>
                  Dostupna količina
                </Form.Label>

                <Form.Control
                  type='number'
                  placeholder='Upišite dostupnu količinu'
                  value={countInStock}
                  onChange={(e) =>
                    setCountInStock(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group controlId='category'>
                <Form.Label>Kategorija</Form.Label>

                <Form.Control
                  type='text'
                  placeholder='Upišite kategoriju'
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group controlId='unit'>
                <Form.Label>Jedinica mere</Form.Label>

                <Form.Control
                  type='text'
                  placeholder='kg ili kom'
                  value={unit}
                  onChange={(e) =>
                    setUnit(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group controlId='showcase' className='admin-check'>
                <Form.Check
                  type='checkbox'
                  label='Prikaži u izdvojenom katalog delu'
                  checked={showcase}
                  onChange={(e) =>
                    setShowcase(e.target.checked)
                  }
                />
              </Form.Group>

              <Form.Group controlId='description'>
                <Form.Label>Opis</Form.Label>

                <Form.Control
                  type='text'
                  placeholder='Upišite opis proizvoda'
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </Form.Group>

              <Button
                type='submit'
                variant='primary'
                className='admin-submit'
              >
                Ažuriraj
              </Button>
            </Form>
          )}
        </div>
      </FormContainer>
    </div>
  );
};

export default ProductEditScreen;
