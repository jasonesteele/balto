import React, {Component} from 'react'
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import {Add, Delete, Edit, FileCopy, PlayCircleOutline} from "@material-ui/icons";
import Card from "@material-ui/core/Card";
import './ScriptCard.css';
import {connect} from "react-redux";
import {deleteScript} from "../actions/UserActions";
import {openSnackbar} from "./Notifier";
import {Link} from "react-router-dom";

function serializeMushi(script) {
  var stringToEncode = script.mushi
      .map(it => {
        return '_0=' + it.id + ':-1:' +
            '_1=' + it.type + ':-1:' +
            '_2=' + it.position.x + ',' + it.position.y + ':-1:' +
            '_3=' + it.links.join(',') + ':-1:' +
            '_4=' + it.altLinks.join(',') + ':-1:' +
            '_5=' + (it.arg1 ? it.arg1 : '')+ ':-1:' +
            '_6=' + (it.arg2 ? it.arg2 : '')+ ':-1:' +
            '_7=' + (it.arg3 ? it.arg3 : '')+ ':-1:' +
            '_8=' + (it.arg4 ? it.arg4 : '')+ ':-1:';
      })
      .join('--end--:-1:');
  var code = '';
  for (var i = 0; i < stringToEncode.length; i++) {
    code = code + ':' + (stringToEncode.charCodeAt(i) + 1) + ':';
  }
  console.log(stringToEncode);
  return code.match(/.{1,100}/g).join('\n');
}

class ScriptCard extends Component {
  constructor(props) {
    super(props);
    this.state = {shadow: 1}
    this.onDelete = this.onDelete.bind(this);
    this.onCopyToClipboard = this.onCopyToClipboard.bind(this);
  }

  onMouseOver = () => this.setState({shadow: 10})
  onMouseOut = () => this.setState({shadow: 1})

  onDelete() {
    if (window.confirm('Are you sure you wish to delete ' + this.props.script.title + '?'))
      this.props.dispatch(deleteScript(this.props.script, this.props.index))
  }

  onCopyToClipboard() {
    navigator.clipboard.writeText(serializeMushi(this.props.script))
        .then(() => {
          openSnackbar({message: 'MushiString copied to clipboard'});
        })
        .catch(err => {
          console.log('Something went wrong', err);
          openSnackbar({message: 'Failed to copy MushiString to clipboard'});
        });
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
                    <Link to={"/edit/" + this.props.script.id}><Edit/></Link>
                  </IconButton>
                  <IconButton aria-label="export the script" onClick={this.onCopyToClipboard}>
                    <FileCopy/>
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