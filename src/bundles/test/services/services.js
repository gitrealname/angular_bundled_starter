import angular from 'angular';
import CurrentTime from './currentTime.service';

export default angular.module('test.services', [
])

.service('todoList', CurrentTime);
