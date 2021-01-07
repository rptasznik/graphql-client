import { gql } from '@apollo/client';

const GQLQueries = {

  GET_ALL_CUSTOMERS: gql`
  query getAllCustomers {
    customers {
      id
      name
      email
      phone
      address
    }
  }
`,
CREATE_CUSTOMER: gql`
  mutation CreateCustomer($name: String!, $email: String!, $phone: String!, $address: String!) {
    createCustomer(name: $name, email: $email, phone: $phone, address: $address){
      id
      name
      email
      phone
      address
    }
  }
`,
UPDATE_CUSTOMER: gql`
  mutation UpdateCustomer($id: String!, $name: String!, $email: String!, $phone: String!, $address: String!) {
    updateCustomer(id: $id, name: $name, email: $email, phone: $phone, address: $address){
      id
      name
      email
      phone
      address
    }
  }
`,
GET_CUSTOMER: gql`
  query getCustomer($id: String!) {
    customer(id: $id) {
      id
      name
      email
      phone
      address
    }
  }
`,
}
export default GQLQueries;