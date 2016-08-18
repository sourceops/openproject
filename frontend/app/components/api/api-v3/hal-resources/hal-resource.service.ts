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
import {HalLinkInterface} from '../hal-link/hal-link.service';
import {HalResourceFactoryService} from '../hal-resource-factory/hal-resource-factory.service';

const ObservableArray:any = require('observable-array');

var $q:ng.IQService;
var lazy;
var HalLink;
var halResourceFactory:HalResourceFactoryService;

export class HalResource {
  public static _type:string;

  public static create(element, force:boolean = false) {
    if (!force && !(element._embedded || element._links)) {
      return element;
    }

    return halResourceFactory.createHalResource(element);
  }

  public static fromLink(link:HalLinkInterface) {
    const resource = HalResource.getEmptyResource(HalLink.fromObject(link));
    return new HalResource(resource, false);
  }

  public static getEmptyResource(self = {href: null}):any {
    return {_links: {self: self}};
  }

  public $links:any = {};
  public $embedded:any = {};
  public $self:ng.IPromise<HalResource>;

  private _name:string;

  public get $isHal():boolean {
    return true;
  }

  public get $link():HalLinkInterface {
    return this.$links.self.$link;
  }

  public get name():string {
    return this._name || this.$link.title || '';
  }

  public set name(name:string) {
    this._name = name;
  }

  /**
   * Alias for $href.
   * Please use $href instead.
   *
   * @deprecated
   * @returns {string}
   */
  public get href():string {
    return this.$link.href;
  }

  public get $href():string {
    return this.$link.href;
  }

  constructor(public $source:any = HalResource.getEmptyResource(),
              public $loaded:boolean = true) {
    this.$initialize($source);
  }

  public $load(force = false) {
    if (!force) {
      if (this.$loaded) {
        return $q.when(this);
      }

      if (!this.$loaded && this.$self) {
        return this.$self;
      }
    }

    // Reset and load this resource
    this.$loaded = false;
    this.$self = this.$links.self({}, this.$loadHeaders(force)).then(source => {
      this.$loaded = true;
      this.$initialize(source);
      return this;
    });

    return this.$self;
  }

  /**
   * Update the resource ignoring the cache.
   */
  public $update() {
    return this.$load(true);
  }

  public $plain() {
    return angular.copy(this.$source);
  }

  protected $initialize(source) {
    this.$source = source.$source || source;
    initializeResource(this);
  }

  /**
   * $load by default uses the $http cache. This will likely be replaced by
   the HAL cache, but while it lasts, it should be ignored when using
   force.
   */
  protected $loadHeaders(force:boolean) {
    var headers:any = {};

    if (force) {
      headers.caching = {enabled: false};
    }

    return headers;
  }
}

function initializeResource(halResource:HalResource) {
  setSource();
  setupLinks();
  setupEmbedded();
  proxyProperties();
  setLinksAsProperties();
  setEmbeddedAsProperties();

  function setSource() {
    if (!halResource.$source._links) {
      halResource.$source._links = {};
    }

    if (!halResource.$source._links.self) {
      halResource.$source._links.self = new HalLink();
    }
  }

  function proxyProperties() {
    _.without(Object.keys(halResource.$source), '_links', '_embedded').forEach(property => {
      Object.defineProperty(halResource, property, {
        get() {
          return halResource.$source[property];
        },

        set(value) {
          halResource.$source[property] = value;
        },

        enumerable: true,
        configurable: true
      });
    });
  }

  function setLinksAsProperties() {
    _.without(Object.keys(halResource.$links), 'self').forEach(linkName => {
      lazy(halResource, linkName,
        () => {
          const link:any = halResource.$links[linkName].$link || halResource.$links[linkName];

          if (Array.isArray(link)) {
            var items = link.map(item => createLinkedResource(linkName, item.$link));
            var property:HalResource[] = new ObservableArray(...items).on('change', () => {
              property.forEach(item => {
                if (!item.$link) {
                  property.splice(property.indexOf(item), 1);
                }
              });

              halResource.$source._links[linkName] = property.map(item => item.$link);
            });

            return property;
          }

          if (link.href) {
            if (link.method !== 'get') {
              return HalLink.callable(link);
            }

            return createLinkedResource(linkName, link);
          }

          return null;
        },

        val => setter(val, linkName)
      );
    });
  }

  function setEmbeddedAsProperties() {
    if (!halResource.$source._embedded) {
      return;
    }

    Object.keys(halResource.$source._embedded).forEach(name => {
      lazy(halResource, name, () => halResource.$embedded[name], val => setter(val, name));
    });
  }

  function setupProperty(name:string, callback:(element:any) => any) {
    const instanceName = '$' + name;
    const sourceName = '_' + name;
    const sourceObj = halResource.$source[sourceName];

    if (angular.isObject(sourceObj)) {
      Object.keys(sourceObj).forEach(propName => {
        lazy(halResource[instanceName], propName, () => callback(sourceObj[propName]));
      });
    }
  }

  function setupLinks() {
    setupProperty('links',
      link => Array.isArray(link) ? link.map(HalLink.callable) : HalLink.callable(link));
  }

  function setupEmbedded() {
    setupProperty('embedded', element => {
      angular.forEach(element, (child:any, name:string) => {
        if (child) {
          lazy(element, name, () => HalResource.create(child));
        }
      });

      if (Array.isArray(element)) {
        return element.map((source) => HalResource.create(source, true));
      }

      return HalResource.create(element);
    });
  }

  function createLinkedResource(linkName, link) {
    const resource = HalResource.getEmptyResource();
    const type = halResource.constructor._type;
    resource._links.self = link;

    return halResourceFactory.createLinkedHalResource(resource, type, linkName);
  }

  function setter(val:HalResource, linkName:string) {
    if (!val) {
      halResource.$source._links[linkName] = {href: null};
    }
    else if (val.$link) {
      const link = val.$link;

      if (link.href) {
        halResource.$source._links[linkName] = link;
      }
    }

    return val;
  }
}

function halResourceService(...args) {
  [$q, lazy, HalLink, halResourceFactory] = args;
  return HalResource;
}

halResourceService.$inject = [
  '$q',
  'lazy',
  'HalLink',
  'halResourceFactory'
];

opApiModule.factory('HalResource', halResourceService);
