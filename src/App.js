import React from 'react';
import './App.css';
import Routes from './routes'
import {withStyles} from "@material-ui/core/styles";
import NavBar from "./components/NavBar";

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const styles = theme => {
  return ({
    // Load app bar information from the theme
    toolbar: theme.mixins.toolbar
  });
};

const App = (props) => {
  const {classes} = props;

  return (
      <div>
        <NavBar/>
        <div className={classes.toolbar}/>
        <Routes/>
      </div>
  );
}

export default withStyles(styles)(App);

