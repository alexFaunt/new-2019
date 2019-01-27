import * as React from 'react';

export default (stateCreator) => {
  const context = React.createContext(stateCreator);

  // TODO change this pattern to wrap only the methods and pass in state
  class Provider extends React.Component {
    constructor(props) {
      super(props);
      this.state = stateCreator;
    }

    render() {
      return (
        <context.Provider value={this.state}>
          { this.props.children }
        </context.Provider>
      );
    }
  }

  const { Consumer } = context;

  return {
    Provider,
    Consumer,
  };
};
