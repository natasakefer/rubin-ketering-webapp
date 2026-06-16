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
    if (window.confirm('Da li ste sigurni da zelite da obrisete ovog korisnika?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('Korisnik uspesno obrisan');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h1>Korisnici</h1>

      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className='table-sm'
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
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    disabled={user.isAdmin}
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FaTrash style={{ color: 'white' }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
