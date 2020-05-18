import React, {Component} from 'react';
import Alert from "@material-ui/lab/Alert";
import * as yup from "yup";
import {Form, Formik} from "formik";
import IconButton from "@material-ui/core/IconButton";
import {ArrowBack, Save} from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";
import {connect} from "react-redux";
import Link from "@material-ui/core/Link";

class NodeSummary extends Component {
  constructor(props) {
    super(props);
  }

  durationToStr(value) {
    var seconds = value % 60;
    var minutes = Math.floor(value / 60) % 60;
    var hours = Math.floor(value / (60 * 60)) % 24;
    var days = Math.floor(value / (60 * 60 * 24));
    var str = '';
    if (days > 0) str = str + days + 'd';
    if (hours > 0) str = str + hours + 'h';
    if (minutes > 0) str = str + minutes + 'm';
    if (seconds > 0) str = str + seconds + 's';
    return str.length === 0 ? "" : str;
  }

  fundsToStr(value) {
    var bronze = value % 100;
    var silver = Math.floor(value / 100) % 100;
    var gold = Math.floor(value / 10000);
    var str = '';
    if (gold > 0) str = str + ' ' + gold + ' gold';
    if (silver > 0) str = str + ' ' + silver + ' silver';
    if (bronze > 0) str = str + ' ' + bronze + ' bronze';
    return str.length === 0 ? "0" : str;
  }

  renderActionNode(node) {
    switch (node.arg1) {
      case 'None':
        return (<i>type not set</i>);
      case 'Give Item':
        return (<span>
          <div>Give Item</div>
          <div><small>
            <span><b>Item ID:</b> {node.arg2 ? node.arg2 : <i>not set</i>}</span>
            <span style={{marginLeft: '2em'}}><b>Count:</b> {node.arg3 ? node.arg3 : <i>not set</i>}</span>
          </small></div>
        </span>);
      case 'Remove Item':
        return (<span>
          <div>Remove Item</div>
          <div><small>
            <span><b>Item ID:</b> {node.arg2 ? node.arg2 : <i>not set</i>}</span>
            <span style={{marginLeft: '2em'}}><b>Count:</b> {node.arg3 ? node.arg3 : <i>not set</i>}</span>
          </small></div>
        </span>);
      case 'Give Quest':
        return (<span>
          <div>Give Quest <b>{node.arg4}</b></div>
          <div><small>
            {node.arg3 !== '0' ? <span style={{marginLeft: '2em'}}><i>Notify Player</i></span> : ''}
            {node.arg2 !== '0' ? <span
                style={{marginLeft: '2em'}}><i>Expires in {this.durationToStr(parseInt(node.arg2))}</i></span> : ''}
          </small></div>
        </span>);
      case 'Complete Quest':
        return (<span>
          <div>Complete Quest <b>{node.arg4}</b></div>
          <div><small>
            {node.arg3 !== '0' ? <span style={{marginLeft: '2em'}}><i>Notify Player</i></span> : ''}
          </small></div>
        </span>);
      case 'Delete Quest':
        return (<span>
          <div>Delete Quest <b>{node.arg4}</b></div>
          <div><small>
            {node.arg3 !== '0' ? <span style={{marginLeft: '2em'}}><i>Notify Player</i></span> : ''}
          </small></div>
        </span>);
      case 'Give Funds':
        return (<span>
          <div>Give Funds</div>
          <div><small>{this.fundsToStr(parseInt(node.arg3))}</small></div>
        </span>);
      case 'Remove Funds':
        return (<span>
          <div>Remove Funds</div>
          <div><small>{this.fundsToStr(parseInt(node.arg3))}</small></div>
        </span>);
      case 'Trigger':
        return (<span>
          <div>{node.arg3 === '0' ? 'Invoke' : 'Revoke'} Trigger</div>
          <div><small>{node.arg4 ? node.arg4 : <i>not set</i>}</small></div>
        </span>);
      case 'Give Recipe':
        return (<span>
          <div>Give Recipe</div>
          <div><small>
            <span><b>Item ID:</b> {node.arg2 ? node.arg2 : <i>not set</i>}</span>
          </small></div>
        </span>);
      case 'Remove Recipe':
        return (<span>
          <div>Remove Recipe</div>
          <div><small>
            <span><b>Item ID:</b> {node.arg2 ? node.arg2 : <i>not set</i>}</span>
          </small></div>
        </span>);
      case 'Give Exp':
        return (<span>
          <div>Give Experience</div>
          <div><small>
            <span><b>XP:</b> {node.arg3 ? node.arg3 : <i>not set</i>}</span>
          </small></div>
        </span>);
      case 'Close Dialogue':
        return (<span>
          <div>Close Dialogue</div>
          {node.arg2 === '1' ?
              <div><small>
                <em>keep Mushi Engine loaded</em>
              </small></div>
              : ''}
        </span>);
      case 'Set Rank':
        return (<span>
          <div>Set Rank</div>
              <div><small>
                {node.arg4 !== '0' ? node.arg4 : <i>not set</i>}
              </small></div>
        </span>);
      case 'Remove Rank':
        return (<span>
          <div>Remove Rank</div>
              <div><small>
                {node.arg4 !== '0' ? node.arg4 : <i>not set</i>}
              </small></div>
        </span>);
      case 'Warp Player':
        return (<span>
          <div>Warp Player</div>
          <div><small>{node.arg4 ? node.arg4 : <i>not set</i>}</small></div>
        </span>);
      case 'Modify Stat':
        return (<span>
          <div>Modify Stat</div>
              <div><small>
                {parseInt(node.arg2) < 0 ? 'Subtract' : 'Add'} {Math.abs(node.arg2)} {parseInt(node.arg2) < 0 ? 'from' : 'to'} {node.arg4}
              </small></div>
        </span>);
      case 'LocVar Operation':
      case 'CharVar Operation':
      case 'GlobVar Operation':
        var varType = node.arg1 === 'LocVar Operation' ?
            'local variable' :
            (node.arg1 === 'CharVar Operation' ? 'character variable' : 'global variable');
        switch (node.arg2) {
          case '0':
            return (<div>Add <b>{node.arg3}</b> to {varType} <b>{node.arg4}</b></div>);
          case '1':
            return (<div>Subtract <b>{node.arg3}</b> from {varType} <b>{node.arg4}</b></div>);
          case '2':
            return (<div>Multiply {varType} <b>{node.arg4}</b> by <b>{node.arg3}</b></div>);
          case '3':
            return (<div>Divide {varType} <b>{node.arg4}</b> by <b>{node.arg3}</b></div>);
          case '4':
            return (<div>Set {varType} <b>{node.arg4}</b> to <b>{node.arg3}</b></div>);
          default:
            return (
                <span>
                  <div><em>Unknown LocVar operation</em></div>
                  <div><small>{node.arg1} / {node.arg2} / {node.arg3} / {node.arg4}</small></div>
                </span>
            );
        }
      case 'Give Kit':
        return (<span>
          <div>Give Kit</div>
          <div><small>{node.arg4 ? node.arg4 : <i>not set</i>}</small></div>
        </span>);
      case 'Chat Message':
        var channel = node.arg2 === '0' ?
            'global' :
            (node.arg2 === '1' ? 'local' : 'private');
        var message = node.arg4.split('|||');
        return (<span>
          <div>Chat Message <i>({channel})</i></div>
          <div><small>
            <b>{message[0]}</b>: {message[1]}
          </small></div>
        </span>);
      case 'Webhook Message':
        var message = node.arg4.split('|||');
        return (<span>
          <div>Webhook</div>
          <div><small>
            {message[0]} &gt; {message[1]}
          </small></div>
        </span>);
      default:
        return (<span>{node.arg1} / {node.arg2} / {node.arg3} / {node.arg4}</span>);
    }
  }

  renderConditionNode(node) {
    switch (node.arg1) {
      case 'None':
        return (<i>type not set</i>);
      case 'Has Item':
        return (<span>
          <div>Has Item</div>
          <div><small>
            <span><b>Item ID:</b> {node.arg2 ? node.arg2 : <i>not set</i>}</span>
            <span style={{marginLeft: '2em'}}><b>Count:</b> {node.arg3 ? node.arg3 : <i>not set</i>}</span>
          </small></div>
        </span>);
      case 'Is Level':
        return (<span>Level at least {node.arg3 ? node.arg3 : <i>not set</i>}</span>);
      case 'Is Level Range':
        return (<span>Level between {node.arg3 ? node.arg3 : <i>not set</i>} and {node.arg2 ? node.arg2 : <i>not set</i>}</span>);
      case 'Has Quest':
        return (<span>Has Quest {node.arg4 ? <b>{node.arg4}</b> : <i>not set</i>}</span>);
      case 'Has Completed Quest':
        return (<span>Has Completed Quest {node.arg4 ? <b>{node.arg4}</b> : <i>not set</i>}</span>);
      case 'Has Funds':
        return (<span>Has at least {this.fundsToStr(parseInt(node.arg3))}</span>);
      case 'Has Recipe':
        return (<span>
          <div>Has Recipe</div>
          <div><small>
            <span><b>Item ID:</b> {node.arg2 ? node.arg2 : <i>not set</i>}</span>
          </small></div>
        </span>);
      case 'Has Rank':
        return (<span>
          <div>Has Rank</div>
              <div><small>
                {node.arg4 !== '0' ? node.arg4 : <i>not set</i>}
              </small></div>
        </span>);
      case 'Is Gender':
        return (<span>Player is {node.arg2 === '0' ? 'Male' : 'Female'}</span>)
      case 'Is Player Name':
        return (<span>
          <div>Player Name {node.arg2 === '0' ? 'Equals' : 'Contains'}</div>
          <div><small>{node.arg4 ? <b>{node.arg4}</b> : <i>not set</i>}</small></div>
        </span>);
      case 'LocVar Condition':
      case 'CharVar Condition':
      case 'GlobVar Condition':
        var varType = node.arg1 === 'LocVar Condition' ?
            'Local variable' :
            (node.arg1 === 'CharVar Condition' ? 'Character variable' : 'Global variable');
        switch (node.arg2) {
          case '0':
            return (<div>{varType} <b>{node.arg4}</b> &lt; <b>{node.arg3}</b></div>);
          case '1':
            return (<div>{varType} <b>{node.arg4}</b> = <b>{node.arg3}</b></div>);
          case '2':
            return (<div>{varType} <b>{node.arg4}</b> != <b>{node.arg3}</b></div>);
          case '3':
            return (<div>{varType} <b>{node.arg4}</b> &gt; <b>{node.arg3}</b></div>);
          case '4':
            return (<div>{varType} <b>{node.arg4}</b> &gt;= <b>{node.arg3}</b></div>);
          case '5':
            return (<div>{varType} <b>{node.arg4}</b> &lt;= <b>{node.arg3}</b></div>);
          default:
            return (
                <span>
                  <div><em>Unknown LocVar operation</em></div>
                  <div><small>{node.arg1} / {node.arg2} / {node.arg3} / {node.arg4}</small></div>
                </span>
            );
        }
      case 'Has Experience':
        switch (node.arg2) {
          case '0':
            return (<div>Experience &lt; <b>{node.arg3}</b></div>);
          case '1':
            return (<div>Experience = <b>{node.arg3}</b></div>);
          case '2':
            return (<div>Experience != <b>{node.arg3}</b></div>);
          case '3':
            return (<div>Experience &gt; <b>{node.arg3}</b></div>);
          case '4':
            return (<div>Experience &gt;= <b>{node.arg3}</b></div>);
          case '5':
            return (<div>Experience &lt;= <b>{node.arg3}</b></div>);
          default:
            return (
                <span>
                  <div><em>Unknown LocVar operation</em></div>
                  <div><small>{node.arg1} / {node.arg2} / {node.arg3} / {node.arg4}</small></div>
                </span>
            );
        }
      case 'Is Inventory Empty':
        return (<span>{node.arg4} Inventory is empty</span>)
      default:
        return (<span>{node.arg1} / {node.arg2} / {node.arg3} / {node.arg4}</span>);
    }
  }

  render() {
    return (
        <div>
          {(() => {
            switch (this.props.node.type) {
              case 'OriginNode':
                return null;
              case 'DialogueNode':
                return <span><div><b>{this.props.node.arg1}</b></div>
                  <div>
                    <small>
                    <i>Speed {
                      parseInt(this.props.node.arg3) > 1000 ? (parseInt(this.props.node.arg3) / 100) : this.props.node.arg3
                    }%
                      {this.props.node.arg2 === '1' ? ' (append)' : ''}</i>
                  </small>
                  </div>
                </span>;
              case 'CommentNode':
                return <span>{this.props.node.arg1}</span>;
              case 'BounceNode':
                switch (this.props.node.arg1) {
                  case 'Bounce':
                    return <span>Bounce to {this.props.node.arg2}</span>;
                  case 'Land':
                    return <span>Land</span>;
                  default:
                    return <i>type not set</i>;
                }
              case 'WaitNode':
                return <span>{this.props.node.arg2 === 0 ? 1000 : this.props.node.arg2}ms</span>
              case 'OptionNode':
                return <span><b>{this.props.node.arg1}</b></span>;
              case 'RandomiserNode':
                return null;
              case 'ActionNode':
                return <span>{this.renderActionNode(this.props.node)}</span>;
              case 'ConditionNode':
                return <span>{this.renderConditionNode(this.props.node)}</span>;
              default:
                return <em>Unknown node type</em>;
            }
          })()}
        </div>
    )
  }
}

class NodeLinks extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div>
          {(() => {
            switch (this.props.node.type) {
              case 'ConditionNode':
                return <span>
                  {this.props.node.prevLinks && this.props.node.prevLinks.length > 0 ?
                      <div><i>prev: </i><Link href="#">{this.props.node.prevLinks.join(', ')}</Link></div> :
                      <span></span>}
                  <div><i>true:</i> <Link href="#">{this.props.node.links.join(', ')}</Link></div>
                  <div><i>false:</i> <Link href="#">{this.props.node.altLinks.join(', ')}</Link></div>
                </span>;
              default:
                return <span>
                  {this.props.node.prevLinks && this.props.node.prevLinks.length > 0 ?
                      <div><i>prev:</i> <Link href="#">{this.props.node.prevLinks.join(', ')}</Link></div> :
                      <span></span>}
                  {this.props.node.links && this.props.node.links.length > 0 ?
                      <div><i>next:</i> <Link href="#">{this.props.node.links.join(', ')}</Link></div> :
                      <span></span>}
                </span>;
            }
          })()}
        </div>
    )
  }}

class EditScript extends Component {
  schema = yup.object({
    title: yup.string()
        .min(3, "Must be at least 3 characters")
        .required("Field is required"),
    author: yup.string()
        .min(3, "Must be at least 3 characters"),
    description: yup.string()
        .min(3, "Must be at least 3 characters"),
    mushi: yup.string()
        .matches(/^[\s]*:96::::54:3::58:::62::::[:\s0-9]*$/,
            {message: "Not a valid MushiString", excludeEmptyString: true})
        .test('invalid-mushi', 'Not a valid MushiString', async (value) => await this.validateMushi(value))
  });

  constructor(props) {
    super(props);
    this.state = {
      script: null
    }
  }

  componentDidMount() {
    const {match: {params}} = this.props;
    console.log('script ID', params.scriptId);
    console.log('state', this.state.scripts);
    this.setState(() => {
      var script = this.props.scripts.find(it => it.id === params.scriptId)
      return script ? {script: {...script}} : null;
    });
  }

  render() {
    return (
        <Container>
          {
            this.state.script ? (
                <Formik
                    validateOnChange={false}
                    validateOnBlur={true}
                    validationSchema={this.schema}
                    onSubmit={this.onSubmit}
                >
                  {formik => (
                      <Form>
                        <div align="right">
                          <IconButton
                              aria-label="back"
                              color="secondary"
                              style={{margin: 12}}
                              disabled={formik.isSubmitting}
                              onClick={() => this.props.history.push('/')}
                          >
                            <ArrowBack/>
                          </IconButton>
                          <IconButton
                              color="primary"
                              aria-label="save the script"
                              style={{margin: 12}}
                              disabled={formik.isSubmitting}
                              onClick={formik.submitForm}
                          >
                            <Save/>
                          </IconButton>
                        </div>

                        <Grid container spacing={5}>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                id="title"
                                label="Title"
                                required
                                autoFocus
                                fullWidth
                                aria-describedby="title-helper-text"
                                value={this.state.script.title}
                                disabled={formik.isSubmitting}
                                onChange={formik.handleChange}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={(formik.touched.title && formik.errors.title) && formik.errors.title}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                id="author"
                                label="Author"
                                fullWidth
                                aria-describedby="author-helper-text"
                                value={this.state.script.author}
                                disabled={formik.isSubmitting}
                                onChange={formik.handleChange}
                                error={formik.touched.author && Boolean(formik.errors.author)}
                                helperText={(formik.touched.author && formik.errors.author) && formik.errors.author}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                                id="description"
                                label="Description"
                                fullWidth
                                aria-describedby="description-helper-text"
                                value={this.state.script.description}
                                disabled={formik.isSubmitting}
                                onChange={formik.handleChange}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={(formik.touched.description && formik.errors.description) && formik.errors.description}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <div width="100%">
                              <MaterialTable
                                  options={{
                                    pageSize: 100,
                                    pageSizeOptions: [20, 50, 100]
                                  }}
                                  columns={[
                                    {
                                      title: 'Id', field: 'id', width: '5%'
                                    },
                                    {
                                      title: 'Type', field: 'type', width: '10%',
                                      render: rowData => <span>{rowData.node.type.replace(/Node$/, '')}</span>
                                    },
                                    {
                                      title: 'Summary', width: '65%',
                                      render: rowData => <NodeSummary node={rowData.node}/>
                                    },
                                    {
                                      title: 'Links', width: '20%',
                                      render: rowData => <NodeLinks node={rowData.node}/>
                                    }
                                  ]}
                                  data={this.state.script.mushi.map(it => {
                                    return {
                                      id: it.id,
                                      type: it.type,
                                      node: it
                                    }
                                  })}
                                  title='Script'/>
                            </div>
                          </Grid>
                        </Grid>
                      </Form>
                  )}
                </Formik>
            ) : (
                <Alert severity="error">Script not found!</Alert>
            )
          }
        </Container>
    )
  }
}

const mapStateToProps = state => ({scripts: state.scripts, script: state.script})

export default connect(mapStateToProps)(EditScript)

