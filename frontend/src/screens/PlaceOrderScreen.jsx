import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

   useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const dispatch = useDispatch();
    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <div className='checkout-preview'>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row className='g-4'>
                <Col md={8}>
                    <ListGroup variant='flush' className='checkout-panel'>
                        <ListGroup.Item>
                            <h2>Podaci za dostavu</h2>
                            <p>
                                <strong>Adresa:</strong>{' '}
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                                {cart.shippingAddress.postalCode},{' '}
                                {cart.shippingAddress.country}
                            </p>
                            {cart.shippingAddress.phone && (
                                <p>
                                    <strong>Telefon:</strong> {cart.shippingAddress.phone}
                                </p>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Način plaćanja</h2>
                            <p>{cart.paymentMethod}</p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Stavke porudžbine</h2>
                            {cart.cartItems.length === 0 ? (
                                <Message variant='danger'>Korpa je prazna</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index} className='checkout-order-item'>
                                            <Row className='align-items-center g-3'>
                                                <Col xs={3} md={2}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link className='checkout-product-link' to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4} className='checkout-line-price'>
                                                    {item.qty} x {item.price} RSD = {item.qty * item.price} RSD
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card className='checkout-summary'>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Rezime porudžbine</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Stavke</Col>
                                    <Col>{cart.itemsPrice} RSD</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Poštarina</Col>
                                    <Col>{cart.shippingPrice} RSD</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>PDV</Col>
                                    <Col>{cart.taxPrice} RSD</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item className='checkout-summary__total'>
                                <Row>
                                    <Col>Ukupna cena</Col>
                                    <Col>{cart.totalPrice} RSD</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block checkout-submit'
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Poručite sada
                                </Button>
                                {isLoading && <Loader />}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PlaceOrderScreen;
