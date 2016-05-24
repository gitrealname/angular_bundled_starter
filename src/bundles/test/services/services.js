import angular from 'angular';
import CurrentTime from './currentTime.service';
import TestData from './testData.service';

export default angular.module('test.services', [
])
.service('currentTimeService', CurrentTime)
.service('testDataService', TestData)
;
