/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-cycle
import {
  fetchCatAndParam,
  createSchedule,
} from '../../../../store/actions/schedule';

import Spinner from '../../../../components/UI/Spinner/Spinner';
import {
  Checkbox,
  Typography,
  FormControlLabel,
  Grid,
  withStyles,
  Button,
  Card,
  CardHeader,
  List,
  ListItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  TextField,
} from '@material-ui/core';
import styles from './styles';

const CreateScheduleForm = props => {
  const {
    fetchCatAndParam,
    paramCategories,
    loading,
    classes,
    createSchedule,
  } = props;
  const { projectId } = useParams();

  useEffect(() => {
    fetchCatAndParam(projectId);
  }, [fetchCatAndParam]);

  const [items, setItems] = React.useState([]);
  const [nameSchedule, setNameSchedule] = React.useState();
  const [selectedCategory, setSelectedCategory] = React.useState([]);
  const [selectedParameter, setSelectedParameter] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleChange = category => event => {
    let checkedCategory;
    let arrParam = [];
    if (event.target.checked) {
      checkedCategory = paramCategories.filter(e => e.category === category);
      setSelectedCategory([...selectedCategory, category]);
      setItems([...items, checkedCategory[0]]);
      arrParam = [...items, checkedCategory[0]];
    } else {
      checkedCategory = items.filter(e => e.category !== category);
      setSelectedCategory(selectedCategory.filter(e => e !== category));
      setItems(checkedCategory);
      arrParam = checkedCategory;
    }
    const para1 = arrParam.map(item => {
      return item.parameters.map(parameter => parameter.name);
    });

    const parameterList = [].concat(...para1);
    setLeft([...new Set(parameterList)]);
  };

  const handleToggle = value => () => {
    const currentIndex = selectedParameter.indexOf(value);
    const newChecked = [...selectedParameter];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedParameter(newChecked);
  };

  const numberOfChecked = items =>
    intersection(selectedParameter, items).length;

  const handleToggleAll = items => () => {
    if (numberOfChecked(items) === items.length) {
      setSelectedParameter(not(selectedParameter, items));
    } else {
      setSelectedParameter(union(selectedParameter, items));
    }
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeaderStep2}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            selectedParameter={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.listStep2} dense component="div" role="list">
        {items.map(value => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={selectedParameter.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  const customSelectedList = (title, items) => (
    <Card>
      <CardHeader title={` ${title} ( ${items.length} ) `} />
      <Divider />
      <List dense component="div" role="list">
        {items.map(value => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <ListItem key={value} role="listitem" button>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  let step1;
  if (loading) {
    step1 = <Spinner />;
  } else {
    step1 = paramCategories.map(item => {
      return (
        <FormControl>
          <FormControlLabel
            key={item.category}
            control={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <Checkbox
                onChange={handleChange(item.category)}
                checked={selectedCategory.includes(item.category)}
              />
            }
            label={item.category}
          />
        </FormControl>
      );
    });
  }
  const getNumberOfSteps = () => {
    return 3;
  };
  const steps = getSteps();
  const getStepContent = step => {
    switch (step) {
      case 0:
        return step1;
      case 1:
        return (
          <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
            className={classes.rootStep2}
          >
            <Grid item>{customList('Parameters', left)}</Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container classes={{ flexGrow: '1' }} spacing={2}>
            <Grid item xs={6}>
              {customSelectedList('Selected categories', selectedCategory)}
            </Grid>
            <Grid item xs={6}>
              {customSelectedList('Selected parameters', selectedParameter)}
            </Grid>
          </Grid>
        );
      default:
        return 'unknown step';
    }
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    if (activeStep === getNumberOfSteps()) {
      createSchedule(
        projectId,
        nameSchedule,
        selectedCategory.join(','),
        selectedParameter.join(','),
      );
    }
  };

  const handleBack = () => setActiveStep(activeStep - 1);

  const handleReset = () => setActiveStep(0);

  return (
    <div className={classes.root}>
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === getNumberOfSteps() ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&quot;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Create a new schedule?
            </Button>
          </div>
        ) : (
          <div>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === getNumberOfSteps() - 1 ? 'Finish' : 'Next'}
              </Button>
              <div> {getStepContent(activeStep)} </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CreateScheduleForm.propTypes = {
  classes: PropTypes.object,
  fetchCatAndParam: PropTypes.func.isRequired,
  paramCategories: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  createSchedule: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    paramCategories: state.schedule.paramCategories,
    loading: state.schedule.loading,
  };
};

const mapDispatchToProps = { fetchCatAndParam, createSchedule };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(CreateScheduleForm));

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1);
}

function not(a, b) {
  return a.filter(value => b.indexOf(value) === -1);
}
function union(a, b) {
  return [...a, ...not(b, a)];
}
function getSteps() {
  return ['Select categories', 'Select parameters', 'Create a schedule'];
}