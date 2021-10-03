import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'reflect-metadata'
import './common/di-provider.global';


import ReactDOM from 'react-dom';
import React from 'react';
import { App } from './App';
import './index.sass';


ReactDOM.render(<App />, document.getElementById('root'));
