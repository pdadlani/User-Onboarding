import React, { useState, useEffect } from 'react';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';


const UserForm = ({ errors, touched, values, status }) => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);

  return (
    <div className='user-form'>
      <h1>User Form</h1>
      <Form>
        <Field
          type='text' 
          name='name'
          placeholder='Name'
        />
        {touched.name && errors.name && (
          <p className='error'>{errors.name}</p>
        )}
        <Field 
          type='text'
          name='email'
          placeholder='Email'
        />
        {touched.email && errors.email && (
          <p className='error'>{errors.email}</p>
        )}
        <Field 
          type='text'
          name='password'
          placeholder='Password'
        />
        {touched.password && errors.password && (
          <p className='error'>{errors.password}</p>
        )}
        <label className='checkbox-container'>
          Terms of service
          <Field 
            type='checkbox'
            name='termsOfService'
            checked={values.termsOfService}
          />
          <span className='checkmark' />
        </label>
        <button type='submit'>Submit</button>
      </Form>

      {users.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
};


const FormikUserForm = withFormik({
  mapPropsToValues({ name, email, password, termsOfService }) {
    return {
      name: name || '',
      email: email || '',
      password: password || '',
      termsOfService: termsOfService || true
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required('You must provide your name'),
    email: Yup.string().email().required(),
    password: Yup.string().required('You need a password to log back in'),
    termsOfService: Yup.bool('true')
      .test(
        'consent',
        'You have to agree with our Terms of Service.',
        value => value === true
      )  
      // .oneOf([true], 'You must agree to terms of service.')
      .required(
        'You have to agree with our Terms of Service'
      )
  }),

  handleSubmit(values, {setStatus}) {
    axios
      .post(`https://reqres.in/api/users`, values)
      .then(res => {
        // console.log('res in axios post', res)
        setStatus(res.data);
      })
      .catch(error => 
        console.log("Error in handleSubmit axios call", error.response)
      );
  }
})(UserForm);

export default FormikUserForm;