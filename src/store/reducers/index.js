import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import home from './home';
import project from './project';
import ui from './ui';
import schedule from './schedule';

export default combineReducers({
  home,
  alert,
  auth,
  project,
  ui,
  schedule,
});
