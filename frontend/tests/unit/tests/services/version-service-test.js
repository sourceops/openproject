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

describe('VersionService', function() {

  var VersionService, $httpBackend;
  beforeEach(angular.mock.module('openproject.services'));

  beforeEach(inject(function(_$httpBackend_, _VersionService_){
    $httpBackend   = _$httpBackend_;
    VersionService = _VersionService_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getVersions', function() {

    var versions = [
      {id: 1, name: 'b version'},
      {id: 2, name: 'a version'}
    ];

    beforeEach(function() {
      $httpBackend.when('GET', '/api/experimental/projects/aProject/versions')
        .respond({ versions: versions });
    });

    it('loads the versions sorted by their name', function() {
      $httpBackend.expectGET('/api/experimental/projects/aProject/versions');

      var callback = sinon.spy(),
          requested_versions = VersionService.getVersions('aProject').then(callback);

      $httpBackend.flush();
      expect(callback).to.have.been.calledWith(sinon.match([
        {id: 2, name: 'a version'},
        {id: 1, name: 'b version'}
      ]));
    });

  });
});
