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

import {ErrorResource} from '../api/api-v3/hal-resources/error-resource.service';
import {WorkPackageEditModeStateService} from './wp-edit-mode-state.service';
import {WorkPackageEditFieldController} from './wp-edit-field/wp-edit-field.directive';
import {WorkPackageCacheService} from '../work-packages/work-package-cache.service';

export class WorkPackageEditFormController {
  public workPackage;
  public hasEditMode:boolean;
  public errorHandler:Function;
  public successHandler:Function;
  public fields = {};

  private errorsPerAttribute:Object = {};
  public firstActiveField:string;

  constructor(protected $scope:ng.IScope,
              protected $q,
              protected $rootScope,
              protected wpNotificationsService,
              protected QueryService,
              protected loadingIndicator,
              protected wpEditModeState:WorkPackageEditModeStateService,
              protected wpCacheService:WorkPackageCacheService) {

    if (this.hasEditMode) {
      wpEditModeState.register(this);
    }
  }

  public isFieldRequired() {
    return _.filter((this.fields as any), (name:string) => {
      return !this.workPackage[name] && this.workPackage.requiredValueFor(name);
    });
  }

  public registerField(field) {
    this.fields[field.fieldName] = field;
    field.setErrors(this.errorsPerAttribute[field.fieldName] || []);
  }

  public toggleEditMode(state:boolean) {
    this.$scope.$evalAsync(() => {
      angular.forEach(this.fields, (field) => {

        // Setup the field if it is not yet active
        if (state && field.isEditable && !field.active) {
          field.initializeField(this.workPackage);
        }

        // Disable the field if is active
        if (!state && field.active) {
          field.reset();
        }
      });
    });
  }

  public closeAllFields() {
    angular.forEach(this.fields, (field:WorkPackageEditFieldController) => {
      field.deactivate();
    });
  }

  public get inEditMode() {
    return this.hasEditMode && this.wpEditModeState.active;
  }

  public get isEditable() {
    return this.workPackage.isEditable;
  }

  public loadSchema() {
    return this.workPackage.getSchema();
  }

  /**
   * Update the form and embedded schema.
   * In edit-all mode, this allows fields to cause changes to the form (e.g., type switch)
   * without saving the resource.
   */
  public updateForm() {
    this.workPackage.updateForm(this.workPackage.$source).then(() => {
      this.wpCacheService.updateWorkPackage(this.workPackage);
    });
  }

  public updateWorkPackage() {
    if (!(this.workPackage.dirty || this.workPackage.isNew)) {
      return this.$q.when(this.workPackage);
    }

    var deferred = this.$q.defer();
    var isInitial = this.workPackage.isNew;

    // Reset old error notifcations
    this.$rootScope.$emit('notifications.clearAll');
    this.errorsPerAttribute = {};

    this.workPackage.save()
      .then(() => {
        angular.forEach(this.fields, field => field.setErrors([]));
        deferred.resolve(this.workPackage);

        this.wpNotificationsService.showSave(this.workPackage, isInitial);
        this.successHandler({workPackage: this.workPackage, fields: this.fields});
      })
      .catch((error) => {
        this.wpNotificationsService.handleErrorResponse(error, this.workPackage);
        if (error instanceof ErrorResource) {
          this.handleSubmissionErrors(error, deferred);
        }
      });

    return deferred.promise;
  }

  private handleSubmissionErrors(error:any, deferred:any) {
    // Process single API errors
    this.handleErroneousAttributes(error);
    return deferred.reject();
  }

  private handleErroneousAttributes(error:any) {
    let attributes = error.getInvolvedAttributes();
    // Save erroneous fields for when new fields appear
    this.errorsPerAttribute = error.getMessagesPerAttribute();

    if (attributes.length === 0) {
      return;
    }

    // Allow additional error handling
    this.firstActiveField = this.errorHandler({
      workPackage: this.workPackage,
      fields: this.fields,
      attributes: attributes
    });

    this.$scope.$evalAsync(() => {
      angular.forEach(this.fields, field => {
        field.setErrors(this.errorsPerAttribute[(field.fieldName || [])]);
      });

      // Activate + Focus on first field
      if (!this.firstActiveField) {
        this.firstActiveField = attributes[0];
      }

      // Activate that field
      // TODO: For inplace-edit, this may be undefined
      // since it doesn't yet expand erroneous attributes
      var firstErrorField = this.fields[this.firstActiveField];
      if (firstErrorField) {
        firstErrorField.activate(true);
      }
    });
  }
}

function wpEditForm() {
  return {
    restrict: 'A',

    scope: {
      workPackage: '=wpEditForm',
      hasEditMode: '=hasEditMode',
      errorHandler: '&wpEditFormOnError',
      successHandler: '&wpEditFormOnSave'
    },

    controller: WorkPackageEditFormController,
    controllerAs: 'vm',
    bindToController: true
  };
}

//TODO: Use 'openproject.wpEdit' module
angular
  .module('openproject')
  .directive('wpEditForm', wpEditForm);
