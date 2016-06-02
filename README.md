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
* [Getting Started](#getting-started)
    * [Dependencies](#dependencies)
    * [Installing](#installing)
    * [Recommended VS Code plugins](#recommended-vs-code-plugins)
    * [Running the App](#running-the-app)
        * [Gulp Tasks](#gulp-tasks)
        * [Testing](#testing)
		* [Generating Components](#generating-components)		

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

# Getting Started
## Dependencies
Tools needed to run this app:
* [node](https://nodejs.org/dist/v4.4.5/node-v4.4.5-x64.msi)
* [Visual Studio Code](https://code.visualstudio.com/) (Optional. But strongly recommended editor). 

## Installing
Once you dependencies installed:
* `npm install -g gulp` install global cli dependencies
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
`Mocha` is the testing suite and `Chai` is the assertion library. 
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
