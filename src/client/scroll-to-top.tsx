import * as React from 'react';

// TODO types location is react router location
class ScrollToTop extends React.Component<any> {
  public componentDidUpdate(prevProps) {
    const { location } = this.props;

    if (location !== prevProps.location && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  public render() {
    const { children } = this.props;
    return children;
  }
}

export default ScrollToTop;
