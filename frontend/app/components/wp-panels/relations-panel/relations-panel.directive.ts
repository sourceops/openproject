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

import {wpDirectivesModule} from "../../../angular-modules";
import {WorkPackageResourceInterface} from "../../api/api-v3/hal-resources/work-package-resource.service";
import {scopedObservable} from "../../../helpers/angular-rx-utils";
import {WorkPackageRelationsService} from "../../wp-relations/wp-relations.service";

export class RelationsPanelController {
  public workPackage:WorkPackageResourceInterface;
  public relationTitles;
  public relationGroups;

  constructor(I18n: op.I18n,
              wpRelations:WorkPackageRelationsService) {

    this.relationTitles = {
      parent: I18n.t('js.relation_buttons.change_parent'),
      children: I18n.t('js.relation_buttons.add_child'),
      relatedTo: I18n.t('js.relation_buttons.add_related_to'),
      duplicates: I18n.t('js.relation_buttons.add_duplicates'),
      duplicated: I18n.t('js.relation_buttons.add_duplicated_by'),
      blocks: I18n.t('js.relation_buttons.add_blocks'),
      blocked: I18n.t('js.relation_buttons.add_blocked_by'),
      precedes: I18n.t('js.relation_buttons.add_precedes'),
      follows: I18n.t('js.relation_buttons.add_follows')
    };

    this.workPackage.relations.$load().then(() => {
      this.relationGroups = wpRelations.getWpRelationGroups(this.workPackage);
    });
  }
}

function relationsPanelDirective() {
  return {
    restrict: 'E',
    templateUrl: '/components/wp-panels/relations-panel/relations-panel.directive.html',

    scope: {
      workPackage: '='
    },

    controller: RelationsPanelController,
    controllerAs: '$ctrl',
    bindToController: true
  };
}

wpDirectivesModule.directive('relationsPanel', relationsPanelDirective);
