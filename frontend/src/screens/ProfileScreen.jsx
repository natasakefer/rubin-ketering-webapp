import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Button,
  Row,
  Col,
} from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';

import { toast } from 'react-toastify';

import Message from '../components/Message';
import Loader from '../components/Loader';

import { useProfileMutation } from '../slices/usersApiSlice';

import { useGetMyOrdersQuery } from '../slices/orderApiSlice';

import { setCredentials } from '../slices/authSlice';

const isStrongPassword = (value) =>
  /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(value);

const passwordMessage =
  'Lozinka mora imati najmanje 8 karaktera, jedno veliko slovo i jedan specijalni karakter';

const ProfileScreen = () => {
  // STATE
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  // REDUX
  const dispatch = useDispatch();

  const { userInfo } = useSelector(
    (state) => state.auth
  );

  // API
  const {
    data: orders,
    isLoading,
    error,
  } = useGetMyOrdersQuery();

  const [
    updateProfile,
    { isLoading: loadingUpdateProfile },
  ] = useProfileMutation();

  // LOAD USER DATA
  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.name, userInfo.email]);

  // SUBMIT FORM
  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Lozinke se ne poklapaju');
    } else if (password && !isStrongPassword(password)) {
      toast.error(passwordMessage);
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();

        dispatch(setCredentials({ ...res }));

        toast.success('Profil je ažuriran');
      } catch (err) {
        toast.error(
          err?.data?.message || err.error
        );
      }
    }
  };

  return (
    <Row>

      {/* LEVA STRANA - PROFIL */}
      <Col md={3}>
        <h2>Profil korisnika</h2>

        <Form onSubmit={submitHandler}>

          {/* IME */}
          <Form.Group
            className='my-2'
            controlId='name'
          >
            <Form.Label>Ime</Form.Label>

            <Form.Control
              type='text'
              placeholder='Unesite ime'
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </Form.Group>

          {/* EMAIL */}
          <Form.Group
            className='my-2'
            controlId='email'
          >
            <Form.Label>Mejl adresa</Form.Label>

            <Form.Control
              type='email'
              placeholder='Unesite mejl adresu'
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </Form.Group>

          {/* PASSWORD */}
          <Form.Group
            className='my-2'
            controlId='password'
          >
            <Form.Label>Lozinka</Form.Label>

            <Form.Control
              type='password'
              placeholder='Unesite lozinku'
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </Form.Group>

          {/* CONFIRM PASSWORD */}
          <Form.Group
            className='my-2'
            controlId='confirmPassword'
          >
            <Form.Label>
              Potvrdite lozinku
            </Form.Label>

            <Form.Control
              type='password'
              placeholder='Potvrdite lozinku'
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />
          </Form.Group>

          {/* LOADER */}
          {loadingUpdateProfile && <Loader />}

          {/* BUTTON */}
          <Button
            type='submit'
            variant='primary'
            className='mt-2'
          >
            Ažurirajte profil
          </Button>

        </Form>
      </Col>

      {/* DESNA STRANA - PORUDŽBINE */}
      <Col md={9}>
        <h2>Moje porudžbine</h2>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Table
            striped
            hover
            responsive
            className='table-sm'
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Datum porudžbine</th>
                <th>Ukupna cena</th>
                <th>Status plaćanja</th>
                <th>Status dostave</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>

                  <td>{order._id}</td>

                  <td>
                    {order.createdAt.substring(
                      0,
                      10
                    )}
                  </td>

                  <td>
                    {order.totalPrice} RSD
                  </td>

                  {/* PLAĆANJE */}
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes
                        style={{ color: 'red' }}
                      />
                    )}
                  </td>

                  {/* DOSTAVA */}
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(
                        0,
                        10
                      )
                    ) : (
                      <FaTimes
                        style={{ color: 'red' }}
                      />
                    )}
                  </td>

                  {/* DETALJI */}
                  <td>
                    <LinkContainer
                      to={`/order/${order._id}`}
                    >
                      <Button
                        variant='light'
                        className='btn-sm'
                      >
                        Detalji
                      </Button>
                    </LinkContainer>
                  </td>

                </tr>
              ))}
            </tbody>

          </Table>
        )}
      </Col>

    </Row>
  );
};

export default ProfileScreen;
