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

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

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

