import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { act, create } from 'react-test-renderer';

import { MockedProvider } from '@apollo/client/testing';
import GQLQueries from './Queries';

import CustomersView from './CustomersView';
import { mount, shallow } from 'enzyme';

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

it('shows edit form', async () => {

  const spy = jest.spyOn(CustomersView, "handleEditShow");

  const wrapper = mount(
    <MockedProvider mocks={[getAllCustomersMock]} addTypename={false}>
      <CustomersView />
    </MockedProvider>
  );

  waitForComponentToPaint(wrapper);

  console.log('wrapper: ' + wrapper.instance().name);
  

  console.log(wrapper.props);

  const addButton = wrapper.find('button').at(0);
  const editButton = wrapper.find('button').at(1);
  addButton.simulate('click');

  expect(spy).toHaveBeenCalled(1);

});