// -- copyright
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
// ++

import {configModule} from '../../../angular-modules';

function ConfigurationService($q, $http, $window, PathHelper, I18n) {
  // fetches configuration from the ApiV3 endpoint
  // TODO: this currently saves the request between page reloads,
  // but could easily be stored in localStorage
  var cache = false;
  var path = PathHelper.apiConfigurationPath();
  var fetchSettings = function () {
    var data = $q.defer();
    $http.get(path).success(function (settings) {
      data.resolve(settings);
    }).error(function (err) {
      data.reject(err);
    });
    return data.promise;
  };
  var api = function () {
    var settings = $q.defer();
    if (cache) {
      settings.resolve(cache);
    } else {
      fetchSettings().then(function (data) {
        cache = data;
        settings.resolve(data);
      });
    }
    return settings.promise;
  };
  var initSettings = function () {
    var settings = {},
      defaults = {
        enabled_modules: [],
        display: [],
        user_preferences: {
          impaired: false,
          time_zone: '',
          others: {
            comments_sorting: 'asc',
            warn_on_leaving_unsaved: true
          }
        }
      };

    if ($window.gon !== undefined) {
      settings = $window.gon.settings;
    }

    return _.merge(defaults, settings);
  };

  return {
    settings: initSettings(),
    api: api,
    displaySettingPresent: function (setting) {
      return this.settings.display.hasOwnProperty(setting) &&
        this.settings.display[setting] !== false;
    },
    accessibilityModeEnabled: function () {
      return this.settings.user_preferences.impaired;
    },
    commentsSortedInDescendingOrder: function () {
      return this.settings.user_preferences.others.comments_sorting === 'desc';
    },
    warnOnLeavingUnsaved: function () {
      return this.settings.user_preferences.others.warn_on_leaving_unsaved === true;
    },
    isTimezoneSet: function () {
      return this.settings.user_preferences.time_zone !== '';
    },
    timezone: function () {
      return this.settings.user_preferences.time_zone;
    },
    dateFormatPresent: function () {
      return this.displaySettingPresent('date_format') &&
        this.settings.display.date_format !== '';
    },
    dateFormat: function () {
      return this.settings.display.date_format;
    },
    timeFormatPresent: function () {
      return this.displaySettingPresent('time_format') &&
        this.settings.display.time_format !== '';
    },
    timeFormat: function () {
      return this.settings.display.time_format;
    },
    isModuleEnabled: function (module) {
      return this.settings.enabled_modules.indexOf(module) >= 0;
    },
    startOfWeekPresent: function () {
      return this.displaySettingPresent('start_of_week') &&
        this.settings.display.start_of_week !== '';
    },
    startOfWeek: function () {
      if (this.startOfWeekPresent()) {
        return this.settings.display.start_of_week;
      }

      // This if/else statement is used because
      // jquery regionals have different start day for German locale
      if (I18n.locale === 'en') {
        return 1;
      } else if (I18n.locale === 'de') {
        return 0;
      }

      return '';
    }
  };
}

configModule.factory('ConfigurationService', ConfigurationService);
