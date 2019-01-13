// Render Prop
import * as React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';
import { Formik, Form as FormikForm, Field } from 'formik';
import { parse } from 'querystring';

import AuthState from '../../../state/auth';
import AuthService from '../../../services/auth';

const defaultReturnTo = '/';

const pickDefined = (obj) => Object.entries(obj).reduce((acc, [key, value]) => (
  value ? { ...acc, [key]: value } : acc
), {});

const validateEmail = (value) => {
  if (!value) {
    return 'Required';
  }

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return 'Invalid email';
  }

  return null;
};

const validatePassword = (value) => {
  if (!value) {
    return 'Required';
  }

  return null;
};

const validator = ({ email, password }) => pickDefined({
  email: validateEmail(email),
  password: validatePassword(password),
});

const getErrorMessage = (error) => {
  const errorCode = error.body ? error.body.error : null;

  switch (errorCode) {
    case 'invalid_grant':
      return 'Wrong email and or password';
    case 'access_denied':
      return 'You are not allowed to access this application';
    default:
      console.error(error); /* eslint-disable-line no-console */ // TODO - sentry
      return 'Something went wrong - contact support';
  }
};

const Form = styled(FormikForm)`
  display: flex;
  flex-direction: column;
  max-width: ${({ theme }) => theme.molecules.loginForm.maxWidth};
  padding: ${({ theme }) => theme.molecules.loginForm.padding};
  border: ${({ theme }) => theme.molecules.loginForm.border};
`;

const ButtonRow = styled.div`
  margin-top: ${({ theme }) => theme.molecules.loginForm.submitMargin};
  align-self: center;
`;

// TODO this was material ui typography
const Title = styled.h6`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.molecules.loginForm.titleMargin};
`;

const LoginForm = ({ onSubmit, className }) => (
  <Formik
    initialValues={{ email: '', password: '' }}
    validate={validator}
    onSubmit={onSubmit}
  >
    {({ isSubmitting, errors }) => (
      <Form className={className}>
        <Title variant="h6">Please log in to continue</Title>
        <Field type="email" name="email" component="input" label="email" autoComplete="email" />
        <Field type="password" name="password" component="input" label="password" autoComplete="current-password" />
        {/* { errors.submission && <div>TODO FormHelperText: {errors.submission}</div> } */}
        <ButtonRow>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </ButtonRow>
      </Form>
    )}
  </Formik>
);

const LoginFormWrapper = ({ history, location, className }) => (
  <AuthService>
    {({ login }) => (
      <AuthState>
        {({ setAuth }) => {
          const onSubmit = async (values, { setSubmitting, setErrors }) => {
            try {
              const { authorization } = await login(values);
              setAuth(authorization);
            } catch (error) {
              setErrors({ submission: getErrorMessage(error) });
              setSubmitting(false);
            }
          };

          return <LoginForm onSubmit={onSubmit} className={className} />;
        }}
      </AuthState>
    )}
  </AuthService>
);

// TODO make this common
interface WithClass extends RouteComponentProps<any> {
  className: string;
}

export default withRouter<WithClass>(LoginFormWrapper);
