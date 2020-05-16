import React, {Component} from 'react'
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ScriptCard from "./ScriptCard";
import IconButton from "@material-ui/core/IconButton";
import {Add} from "@material-ui/icons";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

const ScriptLibrary = ({ scripts }) => (
        <div>
          <div>
            <Grid justify="space-between" container>
              <Grid item>
                <TextField style={{padding: 12}}
                           id="searchInput"
                           placeholder="Search"
                           margin="normal"
                    // onChange={this.onSearchInputChange}
                />
              </Grid>
              <Grid item align="right">
                <IconButton aria-label="add a script" style={{margin: 12}}>
                  <Link to="/add"><Add/></Link>
                </IconButton>
              </Grid>
            </Grid>

            {scripts && scripts.length > 0 ? (
                <div>
                  <Grid container style={{padding: 12}}>
                    {scripts.map(currentScript => (
                        <Grid key={currentScript.title} item xs={12} sm={6} lg={4} xl={3} style={{padding: 10}}>
                          <ScriptCard script={currentScript}/>
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

const mapStateToProps = state => ({ scripts: state.scripts })

export default connect(mapStateToProps)(ScriptLibrary)
