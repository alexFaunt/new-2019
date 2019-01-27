import * as React from 'react';
import * as intersection from 'lodash/intersection';
// TODO install lodash types
export default (initialState, actionsFunctions) => {
  const actionNames = Object.keys(actionsFunctions);

  const clashCheck = (state) => {
    const clash = intersection(Object.keys(state), actionNames);

    if (clash.length) {
      throw new Error('Clash between naming of state and actions');
    }
  };

  // Could be solved by having two separate things?
  clashCheck(initialState);

  // This won't be used as we overwrite the value in the constructor, but it gives it the correct keys
  const context = React.createContext({ ...initialState, ...actionsFunctions });

  class Provider extends React.Component {
    constructor(props) {
      super(props);

      let actions = null;

      const createAction = (action) => (...args) => {
        const newState = action(this.state, ...args)

        clashCheck(newState);

        this.setState({
          ...newState,
          ...actions,
        });
      };

      actions = Object.entries(actionsFunctions).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: createAction(value),
      }), {});

      this.state = {
        ...initialState,
        ...actions,
      };
    }

    render() {
      return (
        <context.Provider value={this.state}>
          { this.props.children }
        </context.Provider>
      );
    }
  }

  return {
    Provider,
    context,
  };
};
