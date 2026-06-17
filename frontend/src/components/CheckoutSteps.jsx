import { Nav, ProgressBar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    const steps = [
        { enabled: step1, to: '/login', label: 'Prijava' },
        { enabled: step2, to: '/shipping', label: 'Podaci o dostavi' },
        { enabled: step3, to: '/payment', label: 'Plaćanje' },
        { enabled: step4, to: '/placeorder', label: 'Pregled porudžbine' },
    ];
    const activeSteps = steps.filter((step) => step.enabled).length;
    const progressValue = Math.max(((activeSteps - 1) / (steps.length - 1)) * 100, 0);

    return (
        <div className="checkout-progress mb-4">
            <ProgressBar now={progressValue} className="checkout-progress__bar" />
            <Nav className="checkout-progress__nav">
                {steps.map((step, index) => (
                    <Nav.Item key={step.label} className="checkout-progress__item">
                        {step.enabled ? (
                            <LinkContainer to={step.to}>
                                <Nav.Link className="checkout-progress__link active">
                                    <span>{index + 1}</span>
                                    {step.label}
                                </Nav.Link>
                            </LinkContainer>
                        ) : (
                            <Nav.Link className="checkout-progress__link" disabled>
                                <span>{index + 1}</span>
                                {step.label}
                            </Nav.Link>
                        )}
                    </Nav.Item>
                ))}
            </Nav>
        </div>
    );
};

export default CheckoutSteps;
