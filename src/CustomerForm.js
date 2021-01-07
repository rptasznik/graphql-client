import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function CustomerForm(props){

  useEffect(() => {
    // clean up input fields
    return () => {
      props.inputs.name = null;
      props.inputs.email = null;
      props.inputs.phone = null;
      props.inputs.address = null;
    };
  });

  return (
    <Form onSubmit={props.handleSubmit}>       
          
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Customer Name" value={props.inputs.name || (props.data && props.data.customer.name) || ""} onChange={props.handleInputChange} />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={props.inputs.email || (props.data && props.data.customer.email) || ""} onChange={props.handleInputChange} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="phone">
        <Form.Label>Phone</Form.Label>
        <Form.Control type="text" placeholder="Phone Number" value={props.inputs.phone || (props.data && props.data.customer.phone) || ""} onChange={props.handleInputChange} />
      </Form.Group>

      <Form.Group controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control type="text" placeholder="Address" value={props.inputs.address || (props.data && props.data.customer.address) || ""} onChange={props.handleInputChange} />
      </Form.Group>

      <Button type="submit">Save</Button>{' '}
      <Button onClick={props.onHide}>Close</Button>
    </Form>
  );
}
export default CustomerForm