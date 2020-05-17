import React from 'react';
import Snackbar from "@material-ui/core/Snackbar";

let openSnackbarFn;

class Notifier extends React.Component {
  state = {
    open: false,
    message: '',
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  openSnackbar = ({ message }) => {
    this.setState({
      open: true,
      message,
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      open: false,
      message: '',
    });
  };

  render() {
    const message = (
        <span id="snackbar-message-id">
          {this.state.message}
        </span>
    );

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            message={message}
            autoHideDuration={5000}
            onClose={this.handleSnackbarClose}
            open={this.state.open}
            ContentProps={{
              'aria-describedby': 'snackbar-message-id',
            }}
        />
    );
  }
}

export function openSnackbar({ message }) {
  openSnackbarFn({ message });
}

export default Notifier;
