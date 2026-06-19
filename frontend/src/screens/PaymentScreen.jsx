import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <div className='checkout-card'>
                <div className='checkout-card__header'>
                    <span className='section-eyebrow'>Plaćanje</span>
                    <h1>Način plaćanja</h1>
                    <p>Izaberite opciju koja vam najviše odgovara.</p>
                </div>
                <Form className='checkout-form' onSubmit={submitHandler}>
                    <Form.Group>
                        <Form.Label as='legend'>Odaberite način plaćanja</Form.Label>
                        <Col className='payment-options payment-options--cards'>
                            <button
                                type='button'
                                className={`payment-card ${
                                    paymentMethod === 'PayPal' ? 'active' : ''
                                }`}
                                aria-pressed={paymentMethod === 'PayPal'}
                                onClick={() => setPaymentMethod('PayPal')}
                            >
                                <span className='payment-card__check'></span>
                                <span>
                                    <strong>PayPal ili kreditna kartica</strong>
                                    <small>Online test plaćanje putem kartice ili PayPal naloga.</small>
                                </span>
                            </button>

                            <button
                                type='button'
                                className={`payment-card ${
                                    paymentMethod === 'Plaćanje pouzećem' ? 'active' : ''
                                }`}
                                aria-pressed={paymentMethod === 'Plaćanje pouzećem'}
                                onClick={() => setPaymentMethod('Plaćanje pouzećem')}
                            >
                                <span className='payment-card__check'></span>
                                <span>
                                    <strong>Plaćanje pouzećem</strong>
                                    <small>Platite prilikom preuzimanja ili dostave porudžbine.</small>
                                </span>
                            </button>
                        </Col>
                    </Form.Group>
                    <Button type='submit' variant='primary' className='checkout-submit'>
                        Nastavite
                    </Button>
                </Form>
            </div>
        </FormContainer>
    )
}

export default PaymentScreen;
