# Modular NG6 Starter

>Starter package for building scalable apps with [Angular 1.x](https://angularjs.org), [ES6](https://git.io/es6features), and [Webpack](http://webpack.github.io/). 
>With focus on possibility of "slow" migration of existing applications (e.g. MS .NET).
>In a way that each page or set of legacy pages get replaced with a bundle,
>while rest of the application continues the old way.    

# Table of Contents
* [Walkthrough](#walkthrough)
    * [Build System](#build-system)
    * [File Structure](#file-structure)
    * [Testing Setup](#testing-setup)
    * [Style Guide](#style-guide)
* [Getting Started](#getting-started)
    * [Dependencies](#dependencies)
    * [Installing](#installing)
    * [Recommended VS Code plugins](#recommended-vs-code-plugins)
    * [Running the App](#running-the-app)
        * [Gulp Tasks](#gulp-tasks)
        * [Testing](#testing)
		* [Generating Components](#generating-components)	
    * [Deployment](#deployment)	
* [Hosting Application Notes](#hosting-application-hotes)
    * [Layout page header](#layout-page-header)
    * [Enabling CORS](#enabling-cors)
* [First bundle Step-by-Step tutorial](#first-bundle-step-by-step-tutorial)

# Walkthrough
## Build System
Modular NG6 uses Gulp and Webpack together for its build system. Yes, you don't need Gulp if you're using Webpack. This is true if your build system is only responsible for file manipulation. However, ours is not.

`Webpack` handles all file-related concerns:
* Transpiling from ES6 to ES5 with `Babel`
* Loading HTML files as modules
* Transpiling stylesheets and appending them to the DOM
* Refreshing the browser and rebuilding on file changes
* Hot module replacement for transpiled stylesheets
* Bundling the app
* Loading all modules
* Doing all of the above for `*.spec.js` files as well

`Gulp` is the orchestrator:
* Starting and calling Webpack
* Starting a development server (yes, Webpack can do this too)
* Generating boilerplate for the Angular app

**Type `gulp --help` to get list of all tasks and related help information**

## File Structure
We use a componentized approach with Modular NG6. This will be the eventual standard (and particularly helpful, if using Angular UI's router) as well as a great way to ensure a tasteful transition to Angular 2, when the time is ripe. Everything--or mostly everything, as we'll explore (below)--is a component. A component is a self-contained concern--may it be a feature or strictly-defined, ever-present element of the UI (such as a header, sidebar, or footer). Also characteristic of a component is that it harnesses its own stylesheets, templates, controllers, routes, services, and specs. This encapsulation allows us the comfort of isolation and structural locality. Here's how it looks:
```
src/
--index.html * development index file, it is dynamically adjusted depending on running environment. 
--common/ * a bundle that contains parts shared by all bundles
----components/ * shared angular components 
------...  
----services/ * shared angular services
------...
--bundles/ * root directory for all bundles (potentially independent sub-applications) 
----test/ * test bundle 
------components/ * test specific components
--------....
------directives/ * test specific directives
--------....
------services/ * test specific services
--------....
------index.js * entry file (routes, configurations, and declarations occur here)
------test.component.js * test bundle main component
------test.spec.js * test component test specs
------test.html * test component template
------test.styl * test styles 
```
## Testing Setup
All tests are also written in ES6. We use Webpack to take care of the logistics of getting those files to run in the various browsers, just like with our client files. This is our testing stack:
* Karma
* Webpack + Babel
* Mocha
* Chai
To run tests, type `gulp test` or `gulp test:runonce` in the terminal. Read more about testing [below](#testing).

## Style Guide
Project organization and naming conventions are similar to those found in the following guides:
* [Angular 2 Style Guide](https://angular.io/docs/ts/latest/guide/style-guide.html)
* [Angular 1 Style Guide by John Papa](https://github.com/johnpapa/angular-styleguide)

# Getting Started
## Dependencies
Tools needed to run this app:
* [node](https://nodejs.org/dist/v6.2.1/node-v6.2.1-x64.msi)
* [Visual Studio Code](https://code.visualstudio.com/) (Optional. But strongly recommended editor). 

## Installing
Once you dependencies installed:
* `npm install -g gulp typings` install global cli dependencies
* `npm install` to install project specific dependencies

## Recommended VS Code plugins
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [Editor Config for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
* [Status Bar Commands](https://marketplace.visualstudio.com/items?itemName=anweber.statusbar-commands)
* [TFS](https://marketplace.visualstudio.com/items?itemName=ivangabriele.vscode-tfs)
* [Stylus](https://marketplace.visualstudio.com/items?itemName=buzinas.stylus)
* [Spelling and Grammar Checker](https://marketplace.visualstudio.com/items?itemName=seanmcbreen.Spell)
 
## Running the App
Modular NG6 uses Gulp to build and launch the development environment. After you have installed all dependencies, you may run the app. 
Running `gulp watch` will bundle the app with `webpack`, launch a development server, 
and watch all files. The port will be displayed in the terminal.
 
### Gulp Tasks
List of available tasks and their command line options may change.
Run `gulp --help` to get list of all available tasks with related help information.

Here's a list of most common tasks:
* `generate:*`
  * scallfolds various angular components/parts. [Read below](#generating-components) for usage details.
* `watch`
  * starts a dev server via `webpack-dev-server`, serving the client folder.
* `test` (bound to test:watch)
  * excutes unit tests in 'watch' mode (test are re-executed when file(s) change) 
  
### Testing
To run the tests, run `gulp test` or `gulp test:runonce`.

`Karma` combined with Webpack runs files (for specified bundles) matching `*.spec.js` inside the `src` folder. 
This allows us to keep test files local to the component--which keeps us in good faith with continuing to build our app modularly. 
The file `spec.bundle.js` is the bundle file for **all** our spec files that Karma will run.

Be sure to define your `*.spec.js` files within their corresponding component directory. 
You must name the spec file like so, `[name].spec.js`. If you don't want to use the `.spec.js` suffix, 
you must change the `regex` in `spec.bundle.js` to look for whatever file(s) you want.
[Mocha](https://mochajs.org/) is the testing suite and [Chai](http://chaijs.com/) is the assertion library. 
If you would like to change this, see `karma.conf.js`.

### Generating Components
>Use `gulp --help` to get most up to date help information about tasks and their paramenters. 

Following a consistent directory structure between components offers us the certainty of predictability. 
We can take advantage of this certainty by creating a gulp task to automate the "instantiation" of our components. 

To generate new bundle:
```
gulp generate:bundle -n MyNewBundle
```
Will create new basic bundle with related root component and intial directory structure under `src/bundles/MyNewBundle` 

For example **generate:component --name componentName -p test** boilerplate task generates this:
```
....componentName/
......index.js // entry file where all its dependencies load
......componentName.component.js
......componentName.html
......componentName.styl // scoped to affect only its own template
......componentName.spec.js // contains passing demonstration tests
```

You may, of course, create these files manually, every time a new module is needed, but that gets quickly tedious.
To generate a component, run `gulp generate:component --name componentName --parent test`.

The parameter following the `--name` flag is the name of the component to be created.

The parameter following the `--parent` flag is the name of the bundle or bundle sub-component (unlimited depth).

Example:
```
gulp generate:component -n componentName -p test
```
Assuming command above the component files will be created under `src/bundles/test/components/component-name/...`. 

Example:
```
gulp generate:service -n specialService -p test/myComponent
```
will generate Angular Service under `src/bundles/test/components/my-component/services/...`

## Deployment
Building testing and deploying bundles into hosting application.
See `gulp publish` task and `config/config.js` file where default deployment
target is defined. 

**... Section is under construction!**

# Hosting Application Notes
> This section describes changes in hosting application that may be required
in order to have seemlees bundle integration. 
While this section targets `MVC .NET` hosting application type, 
still similar adjustments can be made to other kind of hosting applications.   

**... Section is under construction!**

## Layout page header
Static assets are being referenced by relative URL in the templates. 
In order to have those URLs to be correct after the deployment 
into the hosting application, the HTML page where bundle is included 
must have [base](http://www.w3schools.com/tags/tag_base.asp) tag set.
The following is a snippet of `_Layout.cshtml` page in the hosting application
that sets correct `base` tag.
```cshtml
@{
    var request = HttpContext.Current.Request;
    var appUrl = HttpRuntime.AppDomainAppVirtualPath;
    if(!string.IsNullOrWhiteSpace(appUrl)) { appUrl += "/";}
    var baseUrl = string.Format("{0}://{1}{2}", request.Url.Scheme, request.Url.Authority, appUrl);
}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <base href="@baseUrl"/>
        ...
``` 

## Enabling [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

It is recommended that during development all the data consumed by application 
are supplied by `mock server` **(see help for `gulp watch` for details)**.
However, it certain stages of development hosting application data may be desired.
In this case hosting application should be configured to allow CORS requests coming from 
development host. 

To allow `CORS` requests `Access-Control-Allow-Origin` header needs to be added
into response.  
** please note that `CORS` should usually be disabled in production build. ** 

# First bundle Step-by-Step tutorial
>* To follow this tutorial you will need to install [dependencies](#Dependencies)
>including `Visual Studio Code` with recommended plugins.
>* Tutorial will refer to `d:\ngStarter` as a directory where package content
>was extracted to. If you have package content in different folder, please use it
>instead of `d:\ngStarter`.

## Initial steps
* Start `VS Code` and ** File/Open Folder ** `d:\ngStarter`.
* Start terminal app `Command prompt` or `Powershell` and `cd d:\ngStarter`.

>From now on all file names will be provided relative to the package root!

## Generating minimalistic bundle
In terminal window type `gulp generate:bundle -n test`. 
This will create bundle's initial file structure with minimal functionality
under `src\bundles\test`.

## Starting development server
In terminal window type `gulp watch`. Then, point a browser to [http://localhost:3000](http://localhost:3000).
You will notice that gulp task doesn't finish. This is done on purpose. 
While `watch` task is running all code changes will be automatically picked up and 
propagated into running application. You may think of it as advanced `Edit and Continue` 
debug mode supported by `Microsoft Visual Studio` 

>Alternatively, any gulp task can be executed via `VS Code`. 
>To do that press `Ctrl+P` and type in `>task` then pick `Tasks: Run Task`. 
>(it may take a little while first time before available tasks will appear).
>Benefit of running gulp task from within `VS Code` is that it will catch all 
>compilation errors and warnings and offer simple way to navigate to the problematic
>area of the code. 

## Play around
>Keep `watch` task running.

Make small changes in any of the code files including .html, .js and .styl.
Observe automatic change propagation upon file/safe (`Ctrl+S`).

## Extending functionality
>Keep `watch` running. 

>If `gulp watch` was started in terminal window, then open new terminal window   

In terminal window enter `gulp generate:component -n page1 -p test`. 
This command will generate simplistic Angular component and place it
under `src\bundles\test\components\page1\..`. 
To register new component with an application copy and paste the following
two snippets. Paste first snippet at the top of the `src\bundles\test\components\index.js`
after other imports. And second snippet in the module dependencies section of the file.
 

```js
import page1 from './page1';
```
```js
page1.name
```

### Adding routing
In the `header` section of the `src\bundles\test\test.html` copy and paste
the following snippet:
```html
<a ui-sref="test.home">Home</a>
<a ui-sref="test.page1">Page 1</a>
```

>Keep observing the browser window, new component should now be available and accessable.

## Getting data
>Keep `watch` running.

### Creating service
In terminal window type `gulp generate:service -n testDataService -p test`
Register new service with application in `src\bundles\test\services\index.js`
```js
import TestDataService from './test-data.service';
```
And the following snippet at the very bottom of the file, right before final ';' (semicolon) 
```js
.service('testDataService', TestDataService)
```
Edit `src\bundles\test\services\test-data.service.js`, replace `$http.get` line
with
```js
...
return this.$http.get('Home/GetTestModel').then((response) => { 
...
```

### Wire up service call
Paste the following snippet into the `footer` section of the `src\bundles\test\test.html`

```html
<button ng-click="vm.onGetData()">GetData</button>
<ul>
    <li ng-repeat="val in vm.dataList">{{val}}</li>
</ul>
```
And next one into `src\bundles\test\test.component.js` 
within  `TestController` class.
```js
onGetData() {
    this.testDataService.getModel().then((result) => {
        this.dataList = result.dataList || ['ERROR'];
    });
}
``` 
Also declare `dataList` variable in the `TestController` constructor:
```js
this.dataList = [];
```

### Development mode request interceptor (data mocks)
Default pacakge is destributed with development helper services. One of the services
is called `requestMockServerProxy` interceptor that allows serving of mock data.
Please note that data you are getting with `Get Data` button and by `Home/GetTestModel`
url comes from `src\mock.server\Home\GetTestModel.json`.
>** NOTE: The Mock Server folder and file names are case sensetive! ** 


# Debugging tips
> For best debugging experience we recommend to use `Google Chrome` as your 
development browser. 

Drag and Drop `d:\ngStarter` folder from file explorer into `Chrome` sources tab, 
explorer panel. Now, you can even edit files within the browser and changes will 
be automatically propagated into respected source files.
 
 # Further study
 To do unit test development cycle. 
 Start `gulp test` and start editing `.spec.js` files. 
 Do it from `VS Code` for better experience, as it will help with error navigation. 
  
