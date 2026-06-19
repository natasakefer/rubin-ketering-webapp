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
    <div className='profile-page'>
      <div className='profile-page__header'>
        <span className='section-eyebrow'>Moj nalog</span>
        <h1>Profil korisnika</h1>
        <p>Uredite svoje podatke i pratite istoriju porudžbina na jednom mestu.</p>
      </div>

      <Row className='g-4 align-items-start'>
        <Col lg={4}>
          <section className='profile-card'>
            <div className='profile-card__header'>
              <span>Podaci</span>
              <h2>Lični podaci</h2>
            </div>

            <Form className='profile-form' onSubmit={submitHandler}>
              <Form.Group controlId='name'>
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

              <Form.Group controlId='email'>
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

              <Form.Group controlId='password'>
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

              <Form.Group controlId='confirmPassword'>
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

              {loadingUpdateProfile && <Loader />}

              <Button
                type='submit'
                variant='primary'
                className='profile-submit'
              >
                Ažurirajte profil
              </Button>
            </Form>
          </section>
        </Col>

        <Col lg={8}>
          <section className='profile-orders'>
            <div className='profile-card__header'>
              <span>Istorija</span>
              <h2>Moje porudžbine</h2>
            </div>

            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <div className='profile-table-wrap'>
                <Table
                  hover
                  responsive
                  className='profile-table table-sm'
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
                        <td>
                          {order.isPaid ? (
                            <span className='profile-status profile-status--success'>
                              {order.paidAt.substring(0, 10)}
                            </span>
                          ) : (
                            <span className='profile-status profile-status--muted'>
                              <FaTimes />
                            </span>
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            <span className='profile-status profile-status--success'>
                              {order.deliveredAt.substring(
                                0,
                                10
                              )}
                            </span>
                          ) : (
                            <span className='profile-status profile-status--muted'>
                              <FaTimes />
                            </span>
                          )}
                        </td>
                        <td>
                          <LinkContainer
                            to={`/order/${order._id}`}
                          >
                            <Button
                              variant='light'
                              className='profile-soft-btn'
                            >
                              Detalji
                            </Button>
                          </LinkContainer>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </section>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileScreen;
