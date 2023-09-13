import React from 'react'
import "./ErrorPage.css"

class ErrorPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {hasError: true, error: null, errorInfo: null };
  }

  /* This method is called if any error is encountered */
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  static getDerivedStateFromError(error, errorInfo) {
    // Update state so the next render will show the fallback UI.
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  /* This will render this component wherever called */
  render() {
    if (this.state.errorInfo) {
      return (
        <div className='fallback' role='alert'>
          <div className='fallbackData'>
            <h4>OOPS..!!!</h4>
            <h6>Something Went Wrong</h6>
            {/* <p>{this.state.errorInfo}</p> */}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorPage