import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';


const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');
    const [phone, setPhone] = useState(shippingAddress?.phone || '');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country, phone }));
        navigate('/payment');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <div className='checkout-card'>
                <div className='checkout-card__header'>
                    <span className='section-eyebrow'>Dostava</span>
                    <h1>Podaci o dostavi</h1>
                    <p>Unesite adresu i kontakt telefon za potvrdu porudžbine.</p>
                </div>

                <Form className='checkout-form' onSubmit={submitHandler}>
                    <Form.Group controlId='address'>
                        <Form.Label>Adresa</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Unesite adresu'
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='city'>
                        <Form.Label>Grad</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Unesite grad'
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='postalCode'>
                        <Form.Label>Poštanski broj</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Unesite poštanski broj'
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='country'>
                        <Form.Label>Država</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Unesite državu'
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='phone'>
                        <Form.Label>Broj telefona</Form.Label>
                        <Form.Control
                            type='tel'
                            placeholder='Unesite broj telefona'
                            value={phone}
                            required
                            onChange={(e) => setPhone(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary' className='checkout-submit'>
                        Nastavi
                    </Button>
                </Form>
            </div>
        </FormContainer>
    )
};

export default ShippingScreen;
