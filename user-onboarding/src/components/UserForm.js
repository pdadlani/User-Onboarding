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
          type='email'
          name='email'
          placeholder='Email'
        />
        {touched.email && errors.email && (
          <p className='error'>{errors.email}</p>
        )}
        <Field 
          type='password'
          name='password'
          placeholder='Password'
        />
        {touched.password && errors.password && (
          <p className='error'>{errors.password}</p>
        )}
        <Field component='select' className='role-select' name='role'>
          <option>Please choose a role</option>
          <option value='student'>Student</option>
          <option value='teamLead'>Team Lead</option>
          <option value='sectionLead'>Section Lead</option>
          <option value='instructor'>Instructor</option>
        </Field>

        <label className='checkbox-container'>
          Terms of service
          <Field 
            type='checkbox'
            name='termsOfService'
            checked={values.termsOfService}
          />
          <span className='checkmark' />
        </label>
        {touched.termsOfService && errors.termsOfService && (
          <p className='error'>{errors.termsOfService}</p>
        )}
        <button type='submit'>Submit</button>
      </Form>

      {users.map(user => (
        <div key={user.id} className='user'>
          <h3 >{user.name}</h3>
          <div>{user.role}</div>
        </div>
      ))}
    </div>
  );
};


const FormikUserForm = withFormik({
  mapPropsToValues({ name, email, password, role, termsOfService }) {
    return {
      name: name || '',
      email: email || '',
      password: password || '',
      role: role || '',
      termsOfService: termsOfService || true
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required('You must provide your name'),
    email: Yup.string().email().required(),
    password: Yup.string().required('You need a password to log back in'),
    role: Yup.string(),
    termsOfService: Yup.bool()
      // .test(
      //   'consent',
      //   'You have to agree with our Terms of Service.',
      //   value => value === true
      // )  
      .oneOf([true], 'You must agree to the terms of service.')
      // .required(
      //   'You have to agree with our Terms of Service'
      // )
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