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

/*jshint expr: true*/

describe('SettingsModalController', function() {
  var scope, $q, defer, settingsModal, QueryService, NotificationsService;
  var ctrl, buildController;

  beforeEach(angular.mock.module('openproject.workPackages.controllers'));
  beforeEach(inject(function($rootScope, $controller, _$q_) {
    scope = $rootScope.$new();
    $q    = _$q_;

    QueryService = {
      getQuery: function() {
        return {
          name: 'Hey'
        };
      },
      saveQuery: function() {
        defer = $q.defer();
        return defer.promise;
      },
      updateHighlightName: function() {}
    };

    settingsModal = { deactivate: angular.noop };
    NotificationsService = {
      addSuccess: function() {}
    };

    buildController = function() {
      ctrl = $controller("SettingsModalController", {
        $scope:         scope,
        settingsModal:  settingsModal,
        QueryService:   QueryService,
        NotificationsService: NotificationsService
      });
    };
  }));

  describe('updateQuery', function() {
    beforeEach(function() {
      buildController();

      sinon.spy(scope, "$emit");
      sinon.spy(settingsModal, "deactivate");
      sinon.spy(QueryService, "updateHighlightName");
      sinon.spy(NotificationsService, 'addSuccess');

      scope.updateQuery();
      defer.resolve({
        status: {
          text: 'Query updated!'
        }
      });

      scope.$digest();
    });

    it('should deactivate the open modal', function() {
      expect(settingsModal.deactivate).to.have.been.called;
    });

    it('should notfify success', function() {
      expect(NotificationsService.addSuccess).to.have.been.calledWith('Query updated!');
    });

    it ('should update the query menu name', function() {
      expect(QueryService.updateHighlightName).to.have.been.called;
    });
  });
});
