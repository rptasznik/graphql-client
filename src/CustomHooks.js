import {useState} from 'react';

const useCustomerForm = (callback) => {
  const [inputs, setInputs] = useState({});

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    callback();
  }

  const handleInputChange = (event) => {
    event.persist();
    setInputs(inputs => ({...inputs, [event.target.id]: event.target.value}));
  }

  return {
    handleSubmit,
    handleInputChange,
    inputs
  };
}
export default useCustomerForm;