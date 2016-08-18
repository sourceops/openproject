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

import {opApiModule} from '../../../../angular-modules';
import {HalRequestService} from './hal-request.service';
import {HalResource} from '../hal-resources/hal-resource.service';
import IPromise = angular.IPromise;
import IRootScopeService = angular.IRootScopeService;
import IHttpBackendService = angular.IHttpBackendService;

describe('halRequest service', () => {
  var $httpBackend:IHttpBackendService;
  var $rootScope:IRootScopeService;
  var halRequest:HalRequestService;

  beforeEach(angular.mock.module(opApiModule.name));
  beforeEach(angular.mock.inject(function (_$httpBackend_, _$rootScope_, _halRequest_) {
    [$httpBackend, $rootScope, halRequest] = _.toArray(arguments);
  }));

  it('should exist', () => {
    expect(halRequest).to.exist;
  });

  afterEach(() => {
    $rootScope.$apply();
  });

  describe('when requesting a null href', () => {
    var promise;

    beforeEach(() => {
      promise = halRequest.request('get', null);
    });

    it('should return a fulfilled promise', () => {
      expect(promise).to.eventually.be.fulfilled;
    });

    it('should return a null promise', () => {
      expect(promise).to.eventually.be.null;
    });
  });

  describe('when requesting the same GET resource multiple times', () => {
    var headers:any;

    const testRequest = prepare => {
      beforeEach(prepare);

      it('should perform requests according to the cache options', () => {
        $httpBackend.expectGET('something').respond(200, '', (headers) => {
          return headers.caching.enabled === true;
        });

        if (headers.caching && headers.caching.enabled === false) {
          $httpBackend.expectGET('something').respond(200, '');
        }
      });
    };
    const testMethods = () => {
      describe('when using request()', () => {
        testRequest(() => {
          halRequest.request('get', 'something', {}, headers);
          halRequest.request('get', 'something', {}, headers);
        });
      });

      describe('when using get()', () => {
        testRequest(() => {
          halRequest.get('something', {}, headers);
          halRequest.get('something', {}, headers);
        });
      });
    };

    beforeEach(() => {
      halRequest.defaultHeaders.caching = {enabled: true};
      headers = {};
    });

    testMethods();

    describe('when sending a no cache header', () => {
      beforeEach(() => {
        headers = {caching: {enabled: false}};
      });

      testMethods();
    });
  });

  describe('when requesting data', () => {
    var promise:IPromise<HalResource>;
    var method:string;
    var data:any;
    var expectedData:any;
    var headers = {Accept: 'foo', caching: {enabled: false}};

    const methods = ['get', 'put', 'post', 'patch', 'delete'];
    const respond = (status, response) => {
      $httpBackend
        .expect(method.toUpperCase(), 'href', expectedData, (headers:any) => {
          return headers.Accept === 'foo';
        })
        .respond(status, response);

      $httpBackend.flush();
    };
    const runTests = () => {
      describe('when no error occurs', () => {
        beforeEach(() => respond(200, {}));
        it('should return a HalResource', () => {
          expect(promise).to.eventually.be.an.instanceOf(HalResource);
        });
      });

      describe('when an error occurs', () => {
        beforeEach(() => respond(400, {}));

        it('should be rejected with an instance of HalResource', () => {
          expect(promise).to.eventually.be.rejectedWith(HalResource);
        });
      });

      describe('when the server does not respond with a result', () => {
        beforeEach(() => respond(200, null));

        it('should return nothing as well', () => {
          expect(promise).to.eventually.be.null;
        });
      });
    };
    const runRequests = cb => {
      const callback = () => {
        if (method === 'get') {
          data = null;
          expectedData = null;
        }
        cb();
      };
      methods.forEach(requestMethod => {
        describe(`when performing a ${requestMethod} request`, () => {
          beforeEach(() => {
            method = requestMethod;
          });

          describe('when sending no data with the request', () => {
            beforeEach(() => {
              data = void 0;
              expectedData = void 0;

              if (method === 'post') {
                expectedData = {};
              }

              callback();
            });

            runTests();
          });

          describe('when sending data with the request', () => {
            beforeEach(() => {
              data = {foo: 'bar'};
              expectedData = data;
              callback();
            });

            runTests();
          });
        });
      });
    };

    describe('when calling the http methods of the service', () => {
      runRequests(() => {
        promise = halRequest[method]('href', data, headers);
      });
    });

    describe('when calling request()', () => {
      runRequests(() => {
        promise = halRequest.request(method, 'href', data, headers);
      });
    });

    describe('when requesting a GET resource with parameters', () => {
      const params = {foo: 'bar'};

      beforeEach(() => {
        promise = halRequest.get('href', params);
      });

      it('should append the parameters at the end of the requested url', () => {
        $httpBackend.expectGET('href?foo=bar').respond(200, {});
        $httpBackend.flush();
      });
    });
  });
});
