import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

import Message from '../../components/Message';
import Loader from '../../components/Loader';

import { useGetOrdersQuery } from '../../slices/orderApiSlice';

const OrderListScreen = () => {
  const {
    data: orders,
    isLoading,
    error,
  } = useGetOrdersQuery();

  return (
    <div className='admin-page'>
      <div className='admin-page__header'>
        <span className='section-eyebrow'>Admin panel</span>
        <h1>Porudžbine</h1>
        <p>Pregled statusa plaćanja, isporuke i detalja svih porudžbina.</p>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className='admin-table-card'>
          <Table
            hover
            responsive
            className='admin-table table-sm'
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>KORISNIK</th>
                <th>DATUM</th>
                <th>UKUPNA CENA</th>
                <th>STATUS PLAĆANJA</th>
                <th>STATUS DOSTAVE</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice} RSD</td>
                  <td>
                    {order.isPaid ? (
                      <span className='admin-status admin-status--success'>
                        {order.paidAt.substring(0, 10)}
                      </span>
                    ) : (
                      <span className='admin-status admin-status--danger'>
                        <FaTimes />
                      </span>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <span className='admin-status admin-status--success'>
                        {order.deliveredAt.substring(
                          0,
                          10
                        )}
                      </span>
                    ) : (
                      <span className='admin-status admin-status--danger'>
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
                        className='admin-soft-btn'
                      >
                        Detalji porudžbine
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrderListScreen;
