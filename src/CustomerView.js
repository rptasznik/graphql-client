import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import GQLQueries from './Queries'
import Modal from 'react-bootstrap/Modal';
import useCustomerForm from './CustomHooks';
import CustomerForm from './CustomerForm';

function CustomerView(props){

  const customerId = props.customer || null;

  const [createCustomer, { created_data }] = useMutation(GQLQueries.CREATE_CUSTOMER, {
    onCompleted() {
      props.refreshCustomers();
    }
  });
  
  const [updateCustomer, {updated_data}] = useMutation(GQLQueries.UPDATE_CUSTOMER, {
    onCompleted() {
      props.refreshCustomers();
    }
  });  

  // query for our customer  
  const { loading, error, data } = useQuery(GQLQueries.GET_CUSTOMER, {
    variables: {id: customerId},
    skip: customerId == null
  });

  const saveCustomer = (event) => {   
    // call our mutations here
    if (customerId){
      updateCustomer({ 
        variables: { 
          id: customerId, 
          name: inputs.name || data.customer.name, 
          email: inputs.email || data.customer.email,
          phone: inputs.phone || data.customer.phone,
          address: inputs.address || data.customer.address
        } 
      });
    } else {
      createCustomer({ 
        variables: { 
          name: inputs.name, 
          email: inputs.email, 
          phone: inputs.phone, 
          address: inputs.address 
        } 
      });
    }
    // hide modal
    props.onHide();
  }

  const {inputs, handleInputChange, handleSubmit} = useCustomerForm(saveCustomer);
  const {refreshCustomers, ...rest} = props;

  let title;
  if (customerId){
    title = 'Edit Customer'
  } else {
    title = 'Add Customer'
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>; 

  return (
    <Modal
        {...rest}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          <CustomerForm onHide={props.onHide} inputs={inputs} data={data} handleSubmit={handleSubmit} handleInputChange={handleInputChange} />
        </Modal.Body>
      </Modal>
  );
}
export default CustomerView