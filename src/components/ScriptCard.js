import React, {Component} from 'react'
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import {Delete, Edit, PlayCircleOutline} from "@material-ui/icons";
import Card from "@material-ui/core/Card";
import './ScriptCard.css';
import {connect} from "react-redux";
import {deleteScript} from "../actions/UserActions";


class ScriptCard extends Component {
  constructor(props) {
    super(props);
    this.state = {shadow: 1}
  }

  onMouseOver = () => this.setState({shadow: 10})
  onMouseOut = () => this.setState({shadow: 1})
  onDelete = () => {
    if (window.confirm('Are you sure you wish to delete ' + this.props.script.title + '?'))
      this.props.dispatch(deleteScript(this.props.script, this.props.index))
  }

  render() {
    return (
        <div>
          {this.props.script ? (
              <Card elevation={this.state.shadow} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
                <CardContent>
                  <Grid container justify="space-between">
                    <Grid item>
                      <Typography gutterBottom variant="h5">
                        {this.props.script.title}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography align="right">
                        {this.props.script.author}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography component="p" color="textSecondary">
                        {this.props.script.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <div align="right">
                  <IconButton aria-label="run the script in the emulator">
                    <PlayCircleOutline/>
                  </IconButton>
                  <IconButton aria-label="edit the script">
                    <Edit/>
                  </IconButton>
                  <IconButton aria-label="delete the script" onClick={this.onDelete}>
                    <Delete/>
                  </IconButton>
                </div>
              </Card>
          ) : null}
        </div>
    )
  }
}

export default connect()(ScriptCard);