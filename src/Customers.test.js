import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { act, create } from 'react-test-renderer';

import { MockedProvider } from '@apollo/client/testing';
import GQLQueries from './Queries';

import CustomersView from './CustomersView';

import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

let container = null;

const getAllCustomersMock = {
    request: {
      query: GQLQueries.GET_ALL_CUSTOMERS
    },
    result: {
      data: {
        customers: [{ id: '1', name: 'Rick', email: 'rptasznik+test@gmail.com', phone: '506-874-9480', address: 'Moncton' }],
      },
    },
}

const getCustomerMock = {
  request: {
    query: GQLQueries.GET_CUSTOMER,
    variables: { id: '1' },
  },
  result: {
    data: {
      customer: { id: '1', name: 'Rick', email: 'rptasznik+test@gmail.com', phone: '506-874-9480', address: 'Moncton' },
    },
  },
}

const getAllCustomersWithErrorMock = {
  request: {
    query: GQLQueries.GET_ALL_CUSTOMERS
  },
  error: new Error('An error occurred'),
}

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

async function wait(ms = 0) {
  await act(() => {
    // you could use waait here instead if you prefer
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  });
}

it('renders without error', async () => {
  const component = create(
    <MockedProvider mocks={[getAllCustomersMock]} addTypename={false}>
      <CustomersView />
    </MockedProvider>,
  );

  const p = component.root.findByType('p');
  expect(p.children.join('')).toContain('Loading...');

  await wait();
  
  const tds = component.root.findAllByType('td');
  expect(tds[1].children.join('')).toContain('rptasznik+test@gmail.com');
});

it('renders with error', async () => {
  const component = create(
    <MockedProvider mocks={[getAllCustomersWithErrorMock]} addTypename={false}>
      <CustomersView />
    </MockedProvider>,
  );

  await wait();

  const p = component.root.findByType('p');
  expect(p.children.join('')).toContain('Error :(');

});

it('renders buttons', async () => {
  const component = create(
    <MockedProvider mocks={[getAllCustomersMock]} addTypename={false}>
      <CustomersView />
    </MockedProvider>,
  );

  await wait();

  // should have 2 buttons, 1 add, 1 edit
  const buttons = component.root.findAllByType('button');
  expect(buttons).toHaveLength(2);

 expect(buttons[0].props.children).toContain('Add Customer');
 expect(buttons[1].props.children).toContain('Edit');
});

const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();
  });
};

it('shows edit form for add', async () => {

  //const spy = jest.spyOn(CustomersView, "handleEditShow");

  render(
    <MockedProvider mocks={[getAllCustomersMock]} addTypename={false}>
      <CustomersView />
    </MockedProvider>
  );

  await waitFor(() => screen.getByText('Add Customer'))

  const button = screen.getByText('Add Customer');
  //console.log(button);  

  userEvent.click(button);
  
  expect(screen.getByPlaceholderText('Customer Name')).toHaveTextContent('');
  expect(screen.getAllByRole('button')[1]).toHaveTextContent('Save')
  expect(screen.getAllByRole('button')[2]).toHaveTextContent('Close')
});

it('shows edit form for edit', async () => {

  //const spy = jest.spyOn(CustomersView, "handleEditShow");

  render(
    <MockedProvider mocks={[getAllCustomersMock, getCustomerMock]} addTypename={false}>
      <CustomersView />
    </MockedProvider>
  );

  await waitFor(() => screen.getByText('Add Customer'))

  const button = screen.getByText('Edit');

  userEvent.click(button);
  await waitFor(() => screen.getByText('Edit Customer'))
  
  expect(screen.getByPlaceholderText('Customer Name')).toHaveValue('Rick');
  expect(screen.getAllByRole('button')[1]).toHaveTextContent('Save')
  expect(screen.getAllByRole('button')[2]).toHaveTextContent('Close')
});