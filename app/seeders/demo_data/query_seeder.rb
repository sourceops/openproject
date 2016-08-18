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
module DemoData
  class QuerySeeder < Seeder
    attr_reader :project

    def initialize(project)
      @project = project
    end

    def seed_data!
      print '    ↳ Creating Queries'

      data.each do |attributes|
        print '.'
        attributes[:project_id] = project.id
        query = Query.create!(attributes)

        query_menu_item = MenuItems::QueryMenuItem.find_or_initialize_by(
          navigatable_id: query.id) { |item|
            item.name  = SecureRandom.uuid
            item.title = query.name
          }
        query_menu_item.save!
      end

      puts
    end

    def data
      [
        { name: "Bugs",         filters: [Queries::WorkPackages::Filter.new(:status_id, operator: "o"), Queries::WorkPackages::Filter.new(:type_id, operator: "=", values: ['7'])], user_id: User.admin.first.id, is_public: true, column_names: [:id, :type, :status, :priority, :subject, :assigned_to, :create_at] },
        { name: "Milestones",   filters: [Queries::WorkPackages::Filter.new(:status_id, operator: "o"), Queries::WorkPackages::Filter.new(:type_id, operator: "=", values: ['2'])], user_id: User.admin.first.id, is_public: true, column_names: [:id, :type, :status, :subject, :start_date, :due_date] },
        { name: "Phases",       filters: [Queries::WorkPackages::Filter.new(:status_id, operator: "o"), Queries::WorkPackages::Filter.new(:type_id, operator: "=", values: ['3'])], user_id: User.admin.first.id, is_public: true, column_names: [:id, :type, :status, :subject, :start_date, :due_date] },
        { name: "Tasks",        filters: [Queries::WorkPackages::Filter.new(:status_id, operator: "o"), Queries::WorkPackages::Filter.new(:type_id, operator: "=", values: ['1'])], user_id: User.admin.first.id, is_public: true, column_names: [:id, :type, :status, :priority, :subject, :assigned_to] },
        { name: "User Stories", filters: [Queries::WorkPackages::Filter.new(:status_id, operator: "o"), Queries::WorkPackages::Filter.new(:type_id, operator: "=", values: ['6'])], user_id: User.admin.first.id, is_public: true, column_names: [:id, :type, :status, :priority, :subject, :assigned_to] }
      ]
    end
  end
end
