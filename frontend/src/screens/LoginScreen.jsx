import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Form, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import FormContainer from "../components/FormContainer"
import Loader from "../components/Loader"
import { useLoginMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { toast } from "react-toastify"

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate])

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <div className="auth-page">
            <FormContainer>
                <div className="auth-card">
                    <div
                        className="auth-card__media"
                        style={{ '--auth-image': 'url(/images/IMG_0657.jpeg)' }}
                    >
                        <div>
                            <span>Rubin Ketering</span>
                            <strong>Porudzbine, omiljeni proizvodi i checkout na jednom mestu.</strong>
                        </div>
                    </div>

                    <div className="auth-card__content">
                        <span className="section-eyebrow">Dobrodosli nazad</span>
                        <h1>Prijavite se</h1>
                        <p>
                            Nastavite kupovinu, sacuvajte podatke za dostavu i brzo
                            zavrsite porudzbinu.
                        </p>

                        <Form className="auth-form" onSubmit={submitHandler}>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="ime@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label>Lozinka</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Unesite lozinku"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Button
                                className="auth-submit"
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                Prijava
                            </Button>

                            {isLoading && <Loader />}
                        </Form>

                        <Row className="auth-switch">
                            <Col>
                                Nemate nalog?{' '}
                                <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
                                    Registrujte se
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </div>
            </FormContainer>
        </div>
    )
}

export default LoginScreen
