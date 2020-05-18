import React from 'react';
import './App.css';
import Routes from './routes'
import {withStyles} from "@material-ui/core/styles";
import NavBar from "./components/NavBar";
import {compose, createStore} from "redux";
import {Provider} from "react-redux";
import rootReducer from './reducers'
import persistState from 'redux-localstorage'
import Notifier from "./components/Notifier";
import ReactGA from 'react-ga';
import { v4 as uuidv4 } from 'uuid';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

var uuid = localStorage.getItem('gaUuid');
if (!uuid) {
  uuid = uuidv4();
  localStorage.setItem('gaUuid', uuid);
}
ReactGA.initialize('G-9W7QMBCMCZ', {
  titleCase: false,
  gaOptions: {
    userId: uuid
  }
});

const styles = theme => {
  return ({
    // Load app bar information from the theme
    toolbar: theme.mixins.toolbar
  });
};

const enhancer = compose(
    /* [middlewares], */
    persistState(/*paths, config*/),
)
const store = createStore(rootReducer, enhancer);

const App = (props) => {
  const {classes} = props;

  return (
      <div>
        <Provider store={store}>
          <NavBar/>
          <div className={classes.toolbar}/>
          <Routes/>
          <Notifier/>
        </Provider>
      </div>
  );
}

export default withStyles(styles)(App);

