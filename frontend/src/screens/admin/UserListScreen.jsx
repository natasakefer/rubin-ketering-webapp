import { Table, Button } from 'react-bootstrap';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import Message from '../../components/Message';
import Loader from '../../components/Loader';

import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../../slices/usersApiSlice';

const UserListScreen = () => {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useGetUsersQuery();

  const [
    deleteUser,
    { isLoading: loadingDelete },
  ] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('Korisnik uspešno obrisan');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className='admin-page'>
      <div className='admin-page__header'>
        <span className='section-eyebrow'>Admin panel</span>
        <h1>Korisnici</h1>
        <p>Upravljanje registrovanim korisnicima i administratorskim pristupom.</p>
      </div>

      {loadingDelete && <Loader />}

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
                <th>IME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a className='admin-link' href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <span className='admin-status admin-status--success'>
                        <FaCheck />
                      </span>
                    ) : (
                      <span className='admin-status admin-status--danger'>
                        <FaTimes />
                      </span>
                    )}
                  </td>
                  <td>
                    <Button
                      variant='danger'
                      className='admin-icon-btn admin-icon-btn--danger'
                      disabled={user.isAdmin}
                      onClick={() => deleteHandler(user._id)}
                    >
                      <FaTrash />
                    </Button>
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

export default UserListScreen;
