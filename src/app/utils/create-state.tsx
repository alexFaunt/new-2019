import * as React from 'react';
import * as intersection from 'lodash/fp/intersection';

interface ActionHandlers<State> {
  [actionName: string]: (state: State, payload: any) => State
};

// TODO - this isn't good enough typing - in the components you just see "payload: any" etc which isn't useful
interface Actions<State> {
  [actionName: string]: (payload: any) => undefined
};

function createState<State> (initialState: State, actionHandlers: ActionHandlers<State>) {
  // This won't be used as we overwrite the value in the constructor, but it gives it the correct keys
  const context = React.createContext({ state: initialState, actions: actionHandlers as Actions<State> });

  const Provider = ({ children }) => {
    const [state, setState] = React.useState(initialState);

    const actions = Object.entries(actionHandlers).reduce((acc, [actionName, action]) => ({
      ...acc,
      [actionName]: (payload) => setState(action(state, payload)),
    }), {});

    return (
      <context.Provider value={{ state, actions }}>
        { children }
      </context.Provider>
    );
  };

  return { Provider, context };
};

export default createState;
