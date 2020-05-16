import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {Form, Formik} from "formik";
import IconButton from "@material-ui/core/IconButton";
import {ArrowBack, Save} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import {connect} from "react-redux";
import {addScript} from "../actions/UserActions";

function extractToken(context) {
  context.depth++;
  context.pos++;
  var token = null;
  if (context.pos < context.mushi.length) {
    if (context.mushi.charAt(context.pos) !== ':') {
      var end = context.mushi.indexOf(':', context.pos + 1);
      if (end < 0) {
        throw new Error("Malformed MushiString");
      }
      token = context.mushi.substring(context.pos, end);
      token = String.fromCharCode(parseInt(token) - 1);
      context.pos = end + 1;
      return token;
    } else {
      // Embedded encoding detected - pull 2 tokens and merge them
      token = "" + extractToken(context);
      var nextToken;
      if (context.mushi.charAt(context.pos) !== ':') {
        end = context.mushi.indexOf(':', context.pos + 1);
        if (end < 0) {
          throw new Error("Malformed MushiString");
        }
        nextToken = context.mushi.substring(context.pos, end);
        context.pos = end;
      } else {
        nextToken = extractToken(context);
      }
      token += nextToken;
      context.pos++;
      return String.fromCharCode(parseInt(token) - 1);
    }
  }

  context.depth--;
  return token;
}

function parseMushi(mushi) {
  var trimmedMushi = mushi.replace(/\s*/g, '');
  var parsedString = "";
  var context = {
    mushi: trimmedMushi,
    pos: 0,
    depth: 0
  }
  var token = extractToken(context);
  while (token) {
    parsedString += token;
    token = extractToken(context);
  }
  parsedString = parsedString.replace(/:-1:/g, '\n');
  var nodeStrings = parsedString.split(/--end--/);
  var nodes = nodeStrings.map(it => {
    var lineMap = new Map();
    it.trim().split(/\n/).forEach( line => {
      var idx = line.indexOf('=');
      var key = line.substring(0, idx);
      var value = line.substring(idx + 1);
      if (value && value.length > 0) {
        lineMap.set(key, value);
      } else {
        lineMap.set(key, null);
      }
    });

    if (!lineMap.has('_0')) throw new Error("Malformed MushiString");
    if (!lineMap.has('_1')) throw new Error("Malformed MushiString");
    if (!lineMap.has('_2')) throw new Error("Malformed MushiString");

    var position = lineMap.get('_2').trim().split(/,/);
    var links = lineMap.get('_3') ?
        lineMap.get('_3').trim().split(/,/).map(it => parseInt(it)) :
        []
    var altLinks = lineMap.get('_4') ?
        lineMap.get('_4').trim().split(/,/).map(it => parseInt(it)) :
        [];

    return {
      'id': parseInt(lineMap.get('_0')),
      'type': lineMap.get('_1'),
      'position': { x: parseInt(position[0]), y: parseInt(position[1]) },
      'links': links,
      'altLinks': altLinks,
      'arg1': lineMap.get('_5'),
      'arg2': lineMap.get('_6'),
      'arg3': lineMap.get('_7')
    }
  });
  return nodes;
}

class AddScript extends Component {
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
        .test(this.validateMushi)
  });
  initialValues = {
    title: '',
    author: '',
    description: '',
    mushi: ''
  };

  onSubmit = (values, {setSubmitting}) => {
    values.mushi = parseMushi(values.mushi);
    setTimeout(() => {
      console.log("submitting..");
      setSubmitting(false);
      this.props.dispatch(addScript(values));
      this.props.history.push('/');
    }, 500);
  }

  validateMushi(mushi) {
    return parseMushi(mushi);
  }

  render() {
    return (
        <Container>
          <Formik
              validateOnChange={false}
              validateOnBlur={true}
              initialValues={this.initialValues}
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
                          disabled={formik.isSubmitting}
                          onChange={formik.handleChange}
                          error={formik.touched.description && Boolean(formik.errors.description)}
                          helperText={(formik.touched.description && formik.errors.description) && formik.errors.description}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                          id="mushi"
                          label="MushiString"
                          multiline
                          fullWidth
                          aria-label="Mushi string"
                          row={10}
                          rowsMax={10}
                          disabled={formik.isSubmitting}
                          onChange={formik.handleChange}
                          error={formik.touched.mushi && Boolean(formik.errors.mushi)}
                          helperText={(formik.touched.mushi && formik.errors.mushi) && formik.errors.mushi}
                      />
                    </Grid>

                  </Grid>
                </Form>
            )}
          </Formik>
        </Container>
    )
  }
}
export default connect()(AddScript);

