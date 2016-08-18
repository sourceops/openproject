//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

declare const I18n:op.I18n;

// global
angular.module('openproject.uiComponents',
  ['ui.select', 'ui.router', 'ngSanitize', 'openproject.workPackages.services'])
  .run(['$rootScope', function($rootScope){
    $rootScope.I18n = I18n;
  }]);
export const animationsModule = angular.module('openproject.animations', [
  'ngAnimate'
]);
export const configModule = angular.module('openproject.config', []);
export const opServicesModule = angular.module('openproject.services', [
  'openproject.uiComponents',
  'openproject.helpers',
  'openproject.workPackages.config',
  'openproject.workPackages.helpers',
  'openproject.api',
  'angular-cache',
  'openproject.filters'
]);
angular.module('openproject.helpers', ['openproject.services']);
angular
  .module('openproject.models', [
    'openproject.workPackages.config',
    'openproject.services'
  ]);
export const opViewModelsModule = angular.module('openproject.viewModels', [
  'openproject.services'
]);

// timelines
angular.module('openproject.timelines', [
  'openproject.timelines.controllers',
  'openproject.timelines.directives',
  'openproject.uiComponents'
]);
angular.module('openproject.timelines.models', ['openproject.helpers']);
angular
  .module('openproject.timelines.helpers', []);
angular.module(
  'openproject.timelines.controllers', [
    'openproject.timelines.models'
  ]);
angular.module('openproject.timelines.services', [
  'openproject.timelines.models',
  'openproject.timelines.helpers'
]);
angular.module('openproject.timelines.directives', [
  'openproject.timelines.models',
  'openproject.timelines.services',
  'openproject.uiComponents',
  'openproject.helpers'
]);

// work packages
export const opWorkPackagesModule = angular.module('openproject.workPackages', [
  'openproject.workPackages.activities',
  'openproject.workPackages.controllers',
  'openproject.workPackages.filters',
  'openproject.workPackages.directives',
  'openproject.workPackages.tabs',
  'openproject.uiComponents',
  'ng-context-menu',
  'ngFileUpload'
]);
export const wpServicesModule = angular.module('openproject.workPackages.services', [
  'openproject.inplace-edit'
]);
angular.module(
  'openproject.workPackages.helpers', [
    'openproject.helpers',
    'openproject.workPackages.services'
  ]);
angular.module('openproject.workPackages.filters', [
  'openproject.workPackages.helpers'
]);
angular.module('openproject.workPackages.config', []);
export const wpControllersModule = angular.module('openproject.workPackages.controllers', [
  'openproject.models',
  'openproject.viewModels',
  'openproject.workPackages.helpers',
  'openproject.services',
  'openproject.workPackages.config',
  'openproject.layout',
  'btford.modal'
]);
angular.module('openproject.workPackages.models', []);
export const wpDirectivesModule = angular.module('openproject.workPackages.directives', [
  'openproject.uiComponents',
  'openproject.services',
  'openproject.workPackages.services',
  'openproject.workPackages.models'
]);
export const wpTabsModule = angular.module('openproject.workPackages.tabs', []);
angular.module('openproject.workPackages.activities', []);

// messages
angular.module('openproject.messages', [
  'openproject.messages.controllers'
]);
angular.module('openproject.messages.controllers', []);

// time entries
angular.module('openproject.timeEntries', [
  'openproject.timeEntries.controllers'
]);
angular.module('openproject.timeEntries.controllers', []);

angular.module('openproject.layout', [
  'openproject.layout.controllers',
  'ui.router'
]);
angular.module('openproject.layout.controllers', []);

export const opApiModule = angular.module('openproject.api', [
  'openproject.workPackages',
  'openproject.services'
]);

angular.module('openproject.templates', []);

// refactoring
angular.module('openproject.inplace-edit', []);
angular.module('openproject.responsive', []);

export const filtersModule = angular.module('openproject.filters', [
  'openproject.models'
]);

export const wpButtonsModule = angular.module('openproject.wpButtons',
  ['ui.router', 'openproject.services']);

// main app
export const openprojectModule = angular.module('openproject', [
  'ui.router',
  'openproject.animations',
  'openproject.config',
  'openproject.uiComponents',
  'openproject.timelines',
  'openproject.workPackages',
  'openproject.messages',
  'openproject.timeEntries',
  'ngAnimate',
  'foundation',
  'foundation.modal',
  'ngAria',
  'ngSanitize',
  'ngDialog',
  'truncate',
  'openproject.layout',
  'cgBusy',
  'openproject.api',
  'openproject.templates',
  'monospaced.elastic',
  'openproject.inplace-edit',
  wpButtonsModule.name,
  'openproject.responsive',
  filtersModule.name
]);

export default openprojectModule;
