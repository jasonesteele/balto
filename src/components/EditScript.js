import React, {Component} from 'react';
import {connect} from "react-redux";
import Alert from "@material-ui/lab/Alert";
import * as yup from "yup";
import {Form, Formik} from "formik";
import IconButton from "@material-ui/core/IconButton";
import {ArrowBack, Save} from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";

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
                            <ul>
                              {
                                this.state.script.mushi && this.state.script.mushi.map((node, index) => {
                                  switch (node.type) {
                                    case 'OriginNode':
                                      return (
                                          <li key={index}><b>{node.id}</b> <em>Origin</em> (links to {node.links.join(', ')})</li>
                                      )
                                    case 'DialogueNode':
                                      return (
                                          <li key={index}><b>{node.id}</b> <em>Dialog</em> (links to {node.links.join(', ')}) - {node.arg1} [{node.arg3}% speed] {node.arg2 == '1' ? '<i>append</i>' : ''}</li>
                                      )
                                    case 'OptionNode':
                                      return (
                                          <li key={index}><b>{node.id}</b> <em>Option</em> (links to {node.links.join(', ')}) - {node.arg1}</li>
                                      )
                                    case 'ActionNode':
                                      return (
                                          <li key={index}><b>{node.id}</b> <em>Action</em> (links to {node.links.join(', ')}) - {node.arg1} / {node.arg2} / {node.arg3} / {node.arg4}</li>
                                      )
                                    case 'WaitNode':
                                      return (
                                          <li key={index}><b>{node.id}</b> <em>Wait</em> (links to {node.links.join(', ')}) - {node.arg2}ms</li>
                                      )
                                    case 'CommentNode':
                                      return (
                                          <li key={index}><b>{node.id}</b> <em>Comment</em> {node.arg1}</li>
                                      )
                                    case 'ConditionNode':
                                      return (
                                          <li key={index}><b>{node.id}</b> <em>Condition</em> (<b>true</b> to {node.links.join(', ')}, <b>false</b> to {node.altLinks.join(', ')}) - {node.arg1} / {node.arg2} / {node.arg3} / {node.arg4}</li>
                                      )
                                    case 'BounceNode':
                                      if (node.arg1 === 'Land') {
                                        return (
                                            <li key={index}><b>{node.id}</b> <em>Bounce Landing</em> (links
                                              to {node.links.join(', ')})</li>
                                        )
                                      } else {
                                        return (
                                            <li key={index}><b>{node.id}</b> <em>Bounce</em> to {node.arg2}</li>
                                        )
                                      }
                                    default:
                                      return (
                                          <li key={index}><b>{node.id}</b> {node.type}</li>
                                      );
                                  }
                                }
                              )}
                            </ul>
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

