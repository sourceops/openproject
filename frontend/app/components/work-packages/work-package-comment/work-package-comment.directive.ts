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


import {WorkPackageResourceInterface} from '../../api/api-v3/hal-resources/work-package-resource.service';
import {WorkPackageCommentField} from './wp-comment-field.module';
import {ErrorResource} from '../../api/api-v3/hal-resources/error-resource.service';
import {WorkPackageNotificationService} from '../../wp-edit/wp-notification.service';
import {WorkPackageCacheService} from '../work-package-cache.service';

export class CommentFieldDirectiveController {
  public workPackage:WorkPackageResourceInterface;
  public field:WorkPackageCommentField;
  public loadingPromise:ng.IPromise<any>;

  protected text:Object;

  protected editing = false;
  protected canAddComment:boolean;
  protected showAbove:boolean;

  constructor(protected $scope,
              protected $rootScope,
              protected $timeout,
              protected $q,
              protected $element,
              protected ActivityService,
              protected ConfigurationService,
              protected wpCacheService:WorkPackageCacheService,
              protected wpNotificationsService:WorkPackageNotificationService,
              protected NotificationsService,
              protected I18n) {

    this.text = {
      editTitle: I18n.t('js.label_add_comment_title'),
      addComment: I18n.t('js.label_add_comment'),
      cancelTitle: I18n.t('js.label_cancel_comment'),
      placeholder: I18n.t('js.label_add_comment_title')
    };

    this.field = new WorkPackageCommentField(this.workPackage, I18n);

    this.canAddComment = !!this.workPackage.addComment;
    this.showAbove = ConfigurationService.commentsSortedInDescendingOrder();

    $scope.$on('workPackage.comment.quoteThis', (evt, quote) => {
      this.field.initializeFieldValue(quote);
      this.editing = true;
      this.$element.find('.work-packages--activity--add-comment')[0].scrollIntoView();
    });
  }

  public get htmlId() {
    return 'wp-comment-field';
  }

  public get active() {
    return this.editing;
  }

  public get inEditMode() {
    return false;
  }

  public shouldFocus() {
    return true;
  }

  public activate(withText?:string) {
    this.field.initializeFieldValue(withText);
    return this.editing = true;
  }

  public submit() {
    if (this.field.isEmpty()) {
      return;
    }

    this.field.isBusy = true;
    this.loadingPromise = this.ActivityService.createComment(this.workPackage, this.field.value)
      .then(() => {
        this.editing = false;
        this.NotificationsService.addSuccess(this.I18n.t('js.work_packages.comment_added'));

        this.workPackage.activities.$load(true).then(() => {
          this.wpCacheService.updateWorkPackage(this.workPackage);
        });
      })
      .catch(error => {
        if (error instanceof ErrorResource) {
          this.wpNotificationsService.showError(error, this.workPackage);
        }
        else {
          this.NotificationsService.addError(this.I18n.t('js.work_packages.comment_send_failed'));
        }
      })
      .finally(() => {
        this.field.isBusy = false;
      });
  }

  public handleUserCancel() {
    this.editing = false;
    this.field.initializeFieldValue();
  }
}

function workPackageComment() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/components/work-packages/work-package-comment/' +
    'work-package-comment.directive.html',
    scope: {
      workPackage: '=',
      activities: '='
    },

    controllerAs: 'vm',
    bindToController: true,
    controller: CommentFieldDirectiveController
  };
}

angular
  .module('openproject.workPackages.directives')
  .directive('workPackageComment', workPackageComment);
