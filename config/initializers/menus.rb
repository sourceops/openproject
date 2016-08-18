#-- encoding: UTF-8
#-- copyright
# OpenProject is a project management system.
# Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License version 3.
#
# OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
# Copyright (C) 2006-2013 Jean-Philippe Lang
# Copyright (C) 2010-2013 the ChiliProject Team
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
# See doc/COPYRIGHT.rdoc for more details.
#++

require 'redmine/menu_manager'

Redmine::MenuManager.map :top_menu do |menu|
  menu.push :my_page,
            { controller: '/my', action: 'page' },
            context: :main,
            html: { class: 'icon5 icon-star' },
            if: Proc.new { User.current.logged? },
            omit_path_check: true

  # projects menu will be added by
  # Redmine::MenuManager::TopMenuHelper#render_projects_top_menu_node

  menu.push :news,
            { controller: '/news', project_id: nil, action: 'index' },
            context: :modules,
            if: Proc.new {
              (User.current.logged? || !Setting.login_required?) &&
                User.current.allowed_to?(:view_news, nil, global: true)
            },
            omit_path_check: true
  menu.push :time_sheet,
            { controller: '/time_entries', project_id: nil, action: 'index' },
            context: :modules,
            caption: I18n.t('label_time_sheet_menu'),
            if: Proc.new {
              (User.current.logged? || !Setting.login_required?) &&
                User.current.allowed_to?(:view_time_entries, nil, global: true)
            },
            omit_path_check: true
  menu.push :help, OpenProject::Static::Links.help_link,
            last: true,
            caption: '',
            html: { accesskey: OpenProject::AccessKeys.key_for(:help),
                    title: I18n.t('label_help'),
                    class: 'icon5 icon-help1',
                    target: '_blank' },
            omit_path_check: true

  # work packages menu will be added by
  # Redmine::MenuManager::TopMenuHelper#render_work_packages_top_menu_node

  menu.push :new_work_packages,
            { controller: '/work_packages', action: 'index', state: 'new' },
            param: :project_id,
            context: :work_packages,
            caption: I18n.t(:label_work_package_new),
            html: {
              class: "icon-add icon4 form--separator",
              accesskey: OpenProject::AccessKeys.key_for(:new_work_package)
            },
            if: Proc.new { |project|
              User.current.allowed_to?(:add_work_packages, project, global: project.nil?)
            }

  menu.push :list_work_packages,
            { controller: '/work_packages', action: 'index', project_id: nil },
            context: :work_packages,
            caption: I18n.t(:label_all),
            if: Proc.new {
              User.current.allowed_to?(:view_work_packages, nil, global: true)
            }

  menu.push :work_packages_filter_assigned_to_me,
            :work_packages_assigned_to_me_path,
            context: :work_packages,
            caption: I18n.t(:label_assigned_to_me),
            if: Proc.new {
              User.current.logged? &&
                User.current.allowed_to?(:view_work_packages, nil, global: true)
            },
            omit_path_check: true

  menu.push :work_packages_filter_reported_by_me,
            :work_packages_reported_by_me_path,
            context: :work_packages,
            caption: I18n.t(:label_reported_by_me),
            if: Proc.new {
              User.current.logged? &&
                User.current.allowed_to?(:view_work_packages, nil, global: true)
            },
            omit_path_check: true

  menu.push :work_packages_filter_responsible_for,
            :work_packages_responsible_for_path,
            context: :work_packages,
            caption: I18n.t(:label_responsible_for),
            if: Proc.new {
              User.current.logged? &&
                User.current.allowed_to?(:view_work_packages, nil, global: true)
            },
            omit_path_check: true

  menu.push :work_packages_filter_watched_by_me,
            :work_packages_watched_path,
            context: :work_packages,
            caption: I18n.t(:label_watched_by_me),
            if: Proc.new {
              User.current.logged? &&
                User.current.allowed_to?(:view_work_packages, nil, global: true)
            },
            omit_path_check: true
end

Redmine::MenuManager.map :account_menu do |menu|
  menu.push :administration,
            { controller: '/admin', action: 'projects' },
            html: { class: 'hidden-for-mobile' },
            if: Proc.new { User.current.admin? },
            omit_path_check: true
  menu.push :my_account,
            { controller: '/my', action: 'account' },
            html: { class: 'hidden-for-mobile' },
            if: Proc.new { User.current.logged? },
            omit_path_check: true
  menu.push :logout, :signout_path,
            if: Proc.new { User.current.logged? },
            omit_path_check: true
end

Redmine::MenuManager.map :application_menu do |_menu|
  # Empty
end

Redmine::MenuManager.map :my_menu do |menu|
  menu.push :account,
            { controller: '/my', action: 'account' },
            caption: :label_profile,
            html: { class: 'icon2 icon-user' }
  menu.push :settings,
            { controller: '/my', action: 'settings' },
            caption: :label_settings,
            html: { class: 'icon2 icon-settings2' }
  menu.push :password,
            { controller: '/my', action: 'password' },
            caption: :button_change_password,
            if: Proc.new { User.current.change_password_allowed? },
            html: { class: 'icon2 icon-locked' }
  menu.push :access_token,
            { controller: '/my', action: 'access_token' },
            caption: I18n.t('my_account.access_tokens.access_token'),
            html: { class: 'icon2 icon-key' }
  menu.push :mail_notifications,
            { controller: '/my', action: 'mail_notifications' },
            caption: I18n.t('activerecord.attributes.user.mail_notification'),
            html: { class: 'icon2 icon-news' }

  menu.push :delete_account, :deletion_info_path,
            caption: I18n.t('account.delete'),
            param: :user_id,
            if: Proc.new { Setting.users_deletable_by_self? },
            last: :delete_account,
            html: { class: 'icon2 icon-delete' }
end

Redmine::MenuManager.map :admin_menu do |menu|
  menu.push :projects,
            { controller: '/admin', action: 'projects' },
            caption: :label_project_plural,
            html: { class: 'icon2 icon-show-all-projects' }

  menu.push :users,
            { controller: '/users' },
            caption: :label_user_plural,
            html: { class: 'icon2 icon-user' }

  menu.push :groups,
            { controller: '/groups' },
            caption: :label_group_plural,
            html: { class: 'icon2 icon-group' }
  menu.push :roles,
            { controller: '/roles' },
            caption: :label_role_and_permissions,
            html: { class: 'icon2 icon-settings' }

  menu.push :types,
            { controller: '/types' },
            caption: :label_work_package_types,
            html: { class: 'icon2 icon-types' }

  menu.push :statuses,
            { controller: '/statuses' },
            caption: :label_work_package_status_plural,
            html: { class: 'statuses icon2 icon-flag' }

  menu.push :workflows,
            { controller: '/workflows', action: 'edit' },
            caption: Proc.new { Workflow.model_name.human },
            html: { class: 'icon2 icon-workflow' }

  menu.push :custom_fields,
            { controller: '/custom_fields' },
            caption: :label_custom_field_plural,
            html: { class: 'custom_fields icon2 icon-custom-fields' }

  menu.push :enumerations,
            { controller: '/enumerations' },
            html: { class: 'icon2 icon-enumerations' }

  menu.push :settings,
            { controller: '/settings' },
            caption: :label_system_settings,
            html: { class: 'icon2 icon-settings2' }

  menu.push :ldap_authentication,
            { controller: '/ldap_auth_sources', action: 'index' },
            html: { class: 'server_authentication icon2 icon-flag' },
            if: proc { !OpenProject::Configuration.disable_password_login? }

  menu.push :announcements,
            { controller: '/announcements', action: 'edit' },
            caption: 'Announcement',
            html: { class: 'icon2 icon-news' }

  menu.push :plugins,
            { controller: '/admin', action: 'plugins' },
            last: true,
            html: { class: 'icon2 icon-plugins' }

  menu.push :info,
            { controller: '/admin', action: 'info' },
            caption: :label_information_plural,
            last: true,
            html: { class: 'icon2 icon-info1' }

  menu.push :colors,
            { controller: '/planning_element_type_colors', action: 'index' },
            caption:    :'timelines.admin_menu.colors',
            html: { class: 'icon2 icon-status' }

  menu.push :project_types,
            { controller: '/project_types', action: 'index' },
            caption:    :'timelines.admin_menu.project_types',
            html: { class: 'icon2 icon-project-types' }
end

Redmine::MenuManager.map :project_menu do |menu|
  menu.push :overview,
            { controller: '/projects', action: 'show' },
            html: { class: 'icon2 icon-show-all-projects' }

  menu.push :activity,
            { controller: '/activities', action: 'index' },
            param: :project_id,
            if: Proc.new { |p| p.module_enabled?('activity') },
            html: { class: 'icon2 icon-checkmark' }

  menu.push :roadmap,
            { controller: '/versions', action: 'index' },
            param: :project_id,
            if: Proc.new { |p| p.shared_versions.any? },
            html: { class: 'icon2 icon-roadmap' }

  menu.push :work_packages,
            { controller: '/work_packages', action: 'index', state: nil },
            param: :project_id,
            caption: :label_work_package_plural,
            html: {
              id: 'main-menu-work-packages',
              class: 'icon2 icon-work-packages',
              'data-ui-route' => '',
              query_menu_item: 'query_menu_item'
            }

  menu.push :summary_field,
            { controller: '/work_packages/reports', action: 'report' },
            param: :project_id,
            caption: :label_workflow_summary,
            parent: :work_packages,
            html: { class: 'icon2 icon-chart3' }

  menu.push :timelines,
            { controller: '/timelines', action: 'index' },
            param: :project_id,
            caption: :'timelines.project_menu.timelines',
            html: { class: 'icon2 icon-view-timeline' }

  menu.push :calendar,
            { controller: '/work_packages/calendars', action: 'index' },
            param: :project_id,
            caption: :label_calendar,
            html: { class: 'icon2 icon-calendar' }

  menu.push :news,
            { controller: '/news', action: 'index' },
            param: :project_id,
            caption: :label_news_plural,
            html: { class: 'icon2 icon-news' }

  menu.push :boards,
            { controller: '/boards', action: 'index', id: nil },
            param: :project_id,
            if: Proc.new { |p| p.boards.any? },
            caption: :label_board_plural,
            html: { class: 'icon2 icon-ticket-note' }

  menu.push :repository,
            { controller: '/repositories', action: 'show' },
            param: :project_id,
            if: Proc.new { |p| p.repository && !p.repository.new_record? },
            html: { class: 'icon2 icon-folder-open' }

  menu.push :time_entries,
            { controller: '/timelog', action: 'index' },
            param: :project_id,
            if: -> (project) { User.current.allowed_to?(:view_time_entries, project) },
            caption: :label_time_sheet_menu,
            html: { class: 'icon2 icon-cost-reports' }

  menu.push :members,
            { controller: :members, action: :index },
            param: :project_id,
            caption: :label_member_plural,
            html: { class: 'icon2 icon-group' }

  menu.push :settings,
            { controller: '/projects', action: 'settings' },
            caption: :label_project_settings,
            last: true,
            html: { class: 'icon2 icon-settings2' }
end
