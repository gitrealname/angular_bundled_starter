import angular from 'angular';
import CurrentTimeService from './currentTime.service';
import TestDataService from './testData.service';

export default angular.module('test.services', [
])

.service('currentTimeService', CurrentTimeService)

.service('testDataService', TestDataService)

;
