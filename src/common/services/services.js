import angular from 'angular';
import todoList from './todoList.service';

const commonServicesModule = angular.module('common.services', [
])
.service('todoList', todoList);

export default commonServicesModule;

