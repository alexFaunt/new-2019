import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const profileQuery = gql`
  query profile {
    auth {
      user {
        id
        email
        displayName
      }
    }
  }
`
const Profile = () => (
  <Query query={profileQuery}>
    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading...</p>;
      }

      if (error) {
        return <p>Error :(</p>;
      }

      const { user } = data.auth;

      if (!user) {
        return <div>No user!</div>;
      }

      const { id, email, displayName } = user;

      return (
        <div>
          <p>{id} {email} {displayName}</p>
        </div>
      );
    }}
  </Query>
);

export default Profile;
