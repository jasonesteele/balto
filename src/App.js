import React from 'react';
import './App.css';
import Routes from './routes'
import {withStyles} from "@material-ui/core/styles";
import NavBar from "./components/NavBar";
import {createStore} from "redux";
import {Provider} from "react-redux";
import rootReducer from './reducers'

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const styles = theme => {
  return ({
    // Load app bar information from the theme
    toolbar: theme.mixins.toolbar
  });
};

const store = createStore(rootReducer);

const App = (props) => {
  const {classes} = props;

  return (
      <div>
        <Provider store={store}>
          <NavBar/>
          <div className={classes.toolbar}/>
          <Routes/>
        </Provider>
      </div>
  );
}

export default withStyles(styles)(App);

