import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='app-footer'>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <p>Rubin Ketering {currentYear} &copy; Sva prava zadrzana.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
