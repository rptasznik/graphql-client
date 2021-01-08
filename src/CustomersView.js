import React from 'react';
import { useQuery } from '@apollo/client';
import GQLQueries from './Queries';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import CustomerView from './CustomerView';

function CustomersView(props){

  const [showEditCustomer, setShowEditCustomer] = React.useState(false);
  const [currentCustomerId, setCurrentCustomerId] = React.useState(null);
  const { loading, error, data, refetch } = useQuery(GQLQueries.GET_ALL_CUSTOMERS);

  const handleRefetch = () => refetch();

  const handleEditClose = () => setShowEditCustomer(false);
  const handleEditShow = (e) => { 
    setCurrentCustomerId(e.currentTarget.dataset.customerId);
    setShowEditCustomer(true);
  }  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>; 

  return (
    <React.Fragment>
      <Button variant="primary" className="float-right" size="sm" data-customer-id={null} onClick={handleEditShow}>
        Add Customer
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        { 
          data.customers.map((customer) =>
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td><Button variant="primary" size="sm" data-customer-id={customer.id} onClick={handleEditShow}>Edit</Button></td>
            </tr>        
          )
        }
        </tbody>
      </Table>
      <CustomerView
        show={showEditCustomer}
        onHide={() => handleEditClose(false)}
        refreshCustomers={() => handleRefetch()}
        customer={currentCustomerId}
      />
    </React.Fragment>
  );
}
export default CustomersView