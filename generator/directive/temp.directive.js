import template from './<%= lispName %>.html';

export default () => {
  'ngInject';

  function link($scope, $element, $attrs) {
  }

  return {
    restrict: 'A',
    template,
    scope: {
    },
    link,
  };
};
