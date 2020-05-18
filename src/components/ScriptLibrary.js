import React, {Component} from 'react'
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ScriptCard from "./ScriptCard";
import IconButton from "@material-ui/core/IconButton";
import {Add} from "@material-ui/icons";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import ReactGA from "react-ga";

class ScriptLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    }
    this.onSearchInputChange = this.onSearchInputChange.bind(this);

  }

  onSearchInputChange(event) {
    this.setState({filter: event.target.value});
  }

  filterScript(script) {
    return this.state.filter &&
        !script.title.toLowerCase().includes(this.state.filter.toLowerCase()) &&
        (!script.author || script.author.trim().length === 0 || !script.author.toLowerCase().includes(this.state.filter.toLowerCase())) &&
        (!script.description || script.description.trim().length === 0 || !script.description.toLowerCase().includes(this.state.filter.toLowerCase()));
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    return (
        <div>
          <div>
            <Grid justify="space-between" container>
              <Grid item>
                <TextField style={{padding: 12}}
                           id="searchInput"
                           placeholder="Search"
                           margin="normal"
                           onChange={this.onSearchInputChange}
                />
              </Grid>
              <Grid item align="right">
                <IconButton aria-label="add a script" style={{margin: 12}}>
                  <Link to="/add"><Add/></Link>
                </IconButton>
              </Grid>
            </Grid>

            {
              this.props.scripts && this.props.scripts.length > 0 ? (
                  <div>
                    <Grid container style={{padding: 12}}>
                      {this.props.scripts.map((currentScript, index) => (
                          <Grid hidden={this.filterScript(currentScript)}
                                key={currentScript.title}
                                item xs={12} sm={6} lg={4} xl={3}
                                style={{padding: 10}}>
                            <ScriptCard script={currentScript} index={index}/>
                          </Grid>
                      ))}
                    </Grid>
                  </div>
              ) : (
                  <div style={{padding: 24}}>
                    <Typography color="textSecondary" variant="caption" display="block" gutterBottom>
                      No scripts loaded
                    </Typography>
                  </div>
              )
            }
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({scripts: state.scripts})

export default connect(mapStateToProps)(ScriptLibrary);
