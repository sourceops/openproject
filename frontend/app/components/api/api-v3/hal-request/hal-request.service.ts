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
import {HalResource} from '../hal-resources/hal-resource.service';
import {HalResourceFactoryService} from '../hal-resource-factory/hal-resource-factory.service';
import IPromise = angular.IPromise;

export class HalRequestService {
  /**
   * Default headers sent with every request.
   */
  public defaultHeaders = {
    caching: {
      enabled: true
    }
  };

  constructor(protected $q:ng.IQService,
              protected $http:ng.IHttpService,
              protected halResourceFactory:HalResourceFactoryService) {
  }

  /**
   * Perform a HTTP request and return a HalResource promise.
   */
  public request(method:string, href:string, data?:any, headers:any = {}):IPromise<HalResource> {
    if (!href) {
      return this.$q.when(null);
    }

    if (method === 'post') {
      data = data || {};
    }

    headers = angular.extend({}, this.defaultHeaders, headers);

    const config:any = {
      method: method,
      url: href,
      data: data,
      headers: headers,
      cache: headers.caching.enabled
    };
    const createResource = response => {
      if (!response.data) {
        return null;
      }

      return this.halResourceFactory.createHalResource(response.data);
    };

    if (method === 'get') {
      delete config.data;
      config.params = data;
    }

    return this.$http(config)
      .then(createResource)
      .catch(response => this.$q.reject(createResource(response)));
  }

  /**
   * Perform a GET request and return a resource promise.
   *
   * @param href
   * @param params
   * @param headers
   * @returns {ng.IPromise<HalResource>}
   */
  public get(href:string, params?:any, headers?:any):IPromise<HalResource> {
    return this.request('get', href, params, headers);
  }

  /**
   * Perform a PUT request and return a resource promise.
   * @param href
   * @param data
   * @param headers
   * @returns {ng.IPromise<HalResource>}
   */
  public put(href:string, data?:any, headers?:any):IPromise<HalResource> {
    return this.request('put', href, data, headers);
  }

  /**
   * Perform a POST request and return a resource promise.
   *
   * @param href
   * @param data
   * @param headers
   * @returns {ng.IPromise<HalResource>}
   */
  public post(href:string, data?:any, headers?:any):IPromise<HalResource> {
    return this.request('post', href, data, headers);
  }

  /**
   * Perform a PATCH request and return a resource promise.
   *
   * @param href
   * @param data
   * @param headers
   * @returns {ng.IPromise<HalResource>}
   */
  public patch(href:string, data?:any, headers?:any):IPromise<HalResource> {
    return this.request('patch', href, data, headers);
  }

  /**
   * Perform a DELETE request and return a resource promise
   *
   * @param href
   * @param data
   * @param headers
   * @returns {ng.IPromise<HalResource>}
   */
  public delete(href:string, data?:any, headers?:any):IPromise<HalResource> {
    return this.request('delete', href, data, headers);
  }
}

opApiModule.service('halRequest', HalRequestService);
