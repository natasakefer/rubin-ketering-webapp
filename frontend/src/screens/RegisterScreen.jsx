import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Form, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import FormContainer from "../components/FormContainer"
import Loader from "../components/Loader"
import { useRegisterMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { toast } from "react-toastify"

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

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
        if (password !== confirmPassword) {
            toast.error('Lozinke se ne poklapaju');
            return;
        }
        else {
            try {
                const res = await register({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate(redirect);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }

    };

    return (
        <div className="auth-page">
            <FormContainer>
                <div className="auth-card">
                    <div
                        className="auth-card__media"
                        style={{ '--auth-image': 'url(/images/IMG_0331.jpeg)' }}
                    >
                        <div>
                            <span>Rubin Ketering</span>
                            <strong>Napravite nalog i porucujte omiljene slane i slatke boxeve.</strong>
                        </div>
                    </div>

                    <div className="auth-card__content">
                        <span className="section-eyebrow">Novi nalog</span>
                        <h1>Registrujte se</h1>
                        <p>
                            Unesite osnovne podatke i pripremite nalog za brzu
                            porudzbinu keteringa.
                        </p>

                        <Form className="auth-form" onSubmit={submitHandler}>
                            <Form.Group controlId="name">
                                <Form.Label>Ime</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Vase ime"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="email">
                                <Form.Label>Email adresa</Form.Label>
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

                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Potvrdite lozinku</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Ponovite lozinku"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Button
                                className="auth-submit"
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                Registruj se
                            </Button>

                            {isLoading && <Loader />}
                        </Form>

                        <Row className="auth-switch">
                            <Col>
                                Imate nalog?{' '}
                                <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                                    Prijavite se
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </div>
            </FormContainer>
        </div>
    )
}

export default RegisterScreen
