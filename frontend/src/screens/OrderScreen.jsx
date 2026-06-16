import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
} from 'react-bootstrap';

import { toast } from 'react-toastify';

import {
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';

import Message from '../components/Message';
import Loader from '../components/Loader';

import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useDeliverOrderMutation,
} from '../slices/orderApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    isError,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] =
    usePayOrderMutation();

  const [
    deliverOrder,
    { isLoading: loadingDeliver },
  ] = useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] =
    usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  const { userInfo } = useSelector(
    (state) => state.auth
  );

  // LOAD PAYPAL SCRIPT
  useEffect(() => {
    if (
      !errorPayPal &&
      !loadingPayPal &&
      paypal?.clientId
    ) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'EUR',
          },
        });

        paypalDispatch({
          type: 'setLoadingStatus',
          value: 'pending',
        });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        } else {
          paypalDispatch({
            type: 'setLoadingStatus',
            value: 'pending',
          });
        }
      }
    }
  }, [
    errorPayPal,
    loadingPayPal,
    paypal,
    order,
    paypalDispatch,
  ]);

  // PAYPAL APPROVE
  async function onApprove(data, actions) {
    return actions.order
      .capture()
      .then(async function (details) {
        try {
          await payOrder({
            orderId,
            details,
          }).unwrap();

          refetch();

          toast.success(
            'Porudžbina je uspešno plaćena'
          );
        } catch (err) {
          toast.error(
            err?.data?.message ||
              err.message ||
              'Greška prilikom plaćanja porudžbine'
          );
        }
      });
  }

  // TEST PAYMENT
  async function onApproveTest() {
    await payOrder({
      orderId,
      details: {
        payer: {
          name: 'Test User',
        },
      },
    }).unwrap();

    refetch();

    toast.success(
      'Porudžbina je uspešno plaćena (test)'
    );
  }

  // PAYPAL ERROR
  function onError(err) {
    toast.error(
      err?.data?.message ||
        err.message ||
        'Greška prilikom plaćanja porudžbine'
    );
  }

  // CREATE PAYPAL ORDER
  function createOrder(data, actions) {
    const totalInEur = (
      order.totalPrice / 117.2
    ).toFixed(2);

    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: totalInEur,
            },
          },
        ],
      })
      .then((orderID) => orderID);
  }

  // DELIVER ORDER (ADMIN)
  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();

      toast.success(
        'Porudžbina je označena kao dostavljena'
      );
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err.message ||
          'Greška prilikom označavanja porudžbine kao dostavljene'
      );
    }
  };

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant='danger'>
      Greška prilikom učitavanja porudžbine
    </Message>
  ) : (
    <>
      <h1>Porudžbina {order._id}</h1>

      <Row>

        {/* LEVA STRANA */}
        <Col md={8}>
          <ListGroup variant='flush'>

            {/* ADRESA */}
            <ListGroup.Item>
              <h2>Adresa za isporuku</h2>

              <p>
                <strong>Ime: </strong>
                {order.user.name}
              </p>

              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>
                  {order.user.email}
                </a>
              </p>

              <p>
                <strong>Adresa: </strong>
                {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant='success'>
                  Dostavljeno datuma:{' '}
                  {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>
                  Nije dostavljeno
                </Message>
              )}
            </ListGroup.Item>

            {/* PLAĆANJE */}
            <ListGroup.Item>
              <h2>Način plaćanja</h2>

              <p>
                <strong>Metod: </strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant='success'>
                  Plaćeno datuma:{' '}
                  {order.paidAt}
                </Message>
              ) : (
                <Message variant='danger'>
                  Nije plaćeno
                </Message>
              )}
            </ListGroup.Item>

            {/* PROIZVODI */}
            <ListGroup.Item>
              <h2>Proizvodi</h2>

              {order.orderItems.length === 0 ? (
                <Message>
                  Porudžbina je prazna
                </Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map(
                    (item, index) => (
                      <ListGroup.Item key={index}>
                        <Row className='align-items-center'>

                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>

                          <Col md={3}>
                            <Link
                              to={`/product/${item.product}`}
                            >
                              {item.name}
                            </Link>
                          </Col>

                          <Col md={4}>
                            {item.qty} x{' '}
                            {item.price.toFixed(2)} RSD
                            ={' '}
                            {(
                              item.qty * item.price
                            ).toFixed(2)}{' '}
                            RSD
                          </Col>

                        </Row>
                      </ListGroup.Item>
                    )
                  )}
                </ListGroup>
              )}
            </ListGroup.Item>

          </ListGroup>
        </Col>

        {/* DESNA STRANA */}
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>

              <ListGroup.Item>
                <h2>Ukupno</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Proizvodi</Col>
                  <Col>
                    {order.itemsPrice.toFixed(2)} RSD
                  </Col>
                </Row>

                <Row>
                  <Col>Cena dostave</Col>
                  <Col>
                    {order.shippingPrice.toFixed(2)} RSD
                  </Col>
                </Row>

                <Row>
                  <Col>PDV</Col>
                  <Col>
                    {order.taxPrice.toFixed(2)} RSD
                  </Col>
                </Row>

                <Row>
                  <Col>Ukupna cena</Col>
                  <Col>
                    {order.totalPrice.toFixed(2)} RSD
                  </Col>
                </Row>
              </ListGroup.Item>

              {/* PAYPAL */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <Button
                        onClick={onApproveTest}
                        className='btn btn-block'
                        style={{
                          marginBottom: '10px',
                        }}
                      >
                        Plati (test)
                      </Button>

                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {/* ADMIN - DOSTAVA */}
              {!order.isDelivered &&
                userInfo &&
                userInfo.isAdmin &&
                order.isPaid && (
                  <ListGroup.Item>
                    {loadingDeliver && <Loader />}

                    <Button
                      className='btn btn-block'
                      onClick={deliverOrderHandler}
                    >
                      Označi kao dostavljeno
                    </Button>
                  </ListGroup.Item>
                )}

            </ListGroup>
          </Card>
        </Col>

      </Row>
    </>
  );
};

export default OrderScreen;
