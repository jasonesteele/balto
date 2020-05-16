import React, {Component} from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";

class NavBar extends Component {
  render() {
    return (
        <div>
          <AppBar color="primary" position="fixed">
            <Toolbar>
              <Typography color="inherit">
                <Link to="/"><b>Balto</b></Link> A MushiScript Editor
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
    )
  }
}

export default NavBar;

