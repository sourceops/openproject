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

module API
  module Decorators
    class LinkObject < Single
      def initialize(model,
                     property_name:,
                     path: :"#{property_name}",
                     namespace: path.to_s.pluralize,
                     getter: :"#{property_name}_id",
                     title_getter: -> (*) { model.send(property_name).name },
                     setter: :"#{getter}=")
        @property_name = property_name
        @path = path
        @namespace = namespace
        @getter = getter
        @title_getter = title_getter
        @setter = setter

        super(model, current_user: nil)
      end

      property :href,
               exec_context: :decorator,
               getter: -> (*) {
                 id = represented.send(@getter) if represented

                 return nil if id.nil? || id == 0

                 api_v3_paths.send(@path, id)
               },
               setter: -> (value, *) {
                 if value
                   id = ::API::Utilities::ResourceLinkParser.parse_id value,
                                                                      property: @property_name,
                                                                      expected_version: '3',
                                                                      expected_namespace: @namespace
                 end

                 represented.send(@setter, id)
               },
               render_nil: true

      property :title,
               exec_context: :decorator,
               getter: -> (*) {
                 attribute = ::API::Utilities::PropertyNameConverter.to_ar_name(
                   @property_name,
                   context: represented
                 )
                 represented.try(attribute).try(:name)
               },
               writeable: false,
               render_nil: false
    end
  end
end
