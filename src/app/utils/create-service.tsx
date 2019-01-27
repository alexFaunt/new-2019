import * as React from 'react';

export default (service) => {
  const context = React.createContext(service);

  const Provider = ({ children }) => {
    const [state] = React.useState(service);
    return (
      <context.Provider value={state}>
        { children }
      </context.Provider>
    );
  };

  return {
    Provider,
    context,
  };
};
