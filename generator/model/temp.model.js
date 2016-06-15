/// <reference path="<%=  rootRelativePath %>typings/index.d.ts" />
export default (BaseModel) => {
  'ngInject';

  class <%= camelCapName %> extends BaseModel {
  }

  return <%= camelCapName %>;
};
