import React, {Component} from 'react';
import Alert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import ReactGA from "react-ga";

class PageNotFound extends Component {
  render() {
    return (
        <Container>
          <Alert severity="error">Page not found!</Alert>
        </Container>
    )
  }
}

export default PageNotFound;

