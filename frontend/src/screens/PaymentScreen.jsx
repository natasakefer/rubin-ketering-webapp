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
                        <Col className='payment-options'>
                            <Form.Check
                                type='radio'
                                className='payment-option'
                                label='PayPal ili kreditna kartica'
                                id='PayPal'
                                name='paymentMethod'
                                value='PayPal'
                                checked={paymentMethod === 'PayPal'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            ></Form.Check>
                            <Form.Check
                                type='radio'
                                className='payment-option'
                                label='Plaćanje pouzećem'
                                id='CashOnDelivery'
                                name='paymentMethod'
                                value='Plaćanje pouzećem'
                                checked={paymentMethod === 'Plaćanje pouzećem'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            ></Form.Check>
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
