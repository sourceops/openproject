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
  module V3
    module WorkPackages
      module WorkPackageListHelpers
        extend Grape::API::Helpers

        def work_packages_by_params(project: nil)
          query = Query.new(name: '_', project: project)
          query_params = {}

          begin
            apply_filters query, query_params
            apply_sorting query, query_params
            groups = apply_and_generate_groups query, query_params

            total_sums = generate_total_sums query.results, query_params
          rescue ::JSON::ParserError => error
            raise ::API::Errors::InvalidQuery.new(error.message)
          end

          work_packages = query
                          .results
                          .sorted_work_packages

          collection_representer(work_packages,
                                 project: project,
                                 query_params: query_params,
                                 groups: groups,
                                 sums: total_sums)
        end

        def apply_filters(query, query_params)
          if params[:filters]
            filters = parse_filters_from_json(params[:filters])
            set_filters(query, filters)
            query_params[:filters] = params[:filters]
          end
        end

        # Expected format looks like:
        # [
        #   {
        #     "filtered_field_name": {
        #       "operator": "a name for a filter operation",
        #       "values": ["values", "for the", "operation"]
        #     }
        #   },
        #   { /* more filters if needed */}
        # ]
        def parse_filters_from_json(json)
          filters = JSON.parse(json)
          operators = {}
          values = {}
          filters.each do |filter|
            attribute = filter.keys.first # there should only be one attribute per filter
            ar_attribute = convert_attribute attribute, append_id: true
            operators[ar_attribute] = filter[attribute]['operator']
            values[ar_attribute] = filter[attribute]['values']
          end

          {
            attributes: values.keys,
            operators: operators,
            values: values
          }
        end

        def set_filters(query, filters)
          query.filters = []
          query.add_filters(filters[:attributes], filters[:operators], filters[:values])

          bad_filter = query.filters.detect(&:invalid?)
          if bad_filter
            raise_invalid_query(bad_filter.errors)
          end
        end

        def apply_sorting(query, query_params)
          if params[:sortBy]
            query.sort_criteria = parse_sorting_from_json(params[:sortBy])
            query_params[:sortBy] = params[:sortBy]
          else
            query.sort_criteria = [['parent', 'desc']]
            query_params[:sortBy] = 'parent:desc'
          end
        end

        def parse_sorting_from_json(json)
          JSON.parse(json).map { |(attribute, order)|
            [convert_attribute(attribute), order]
          }
        end

        def apply_and_generate_groups(query, query_params)
          if params[:groupBy]
            query.group_by = convert_attribute params[:groupBy]
            query_params[:groupBy] = params[:groupBy]

            generate_groups query.results
          end
        end

        def generate_groups(results)
          results.work_package_count_by_group.map { |group, count|
            sums = nil
            if params[:showSums] == 'true'
              sums = format_query_sums results.all_sums_for_group(group)
            end

            ::API::Decorators::AggregationGroup.new(group, count, sums: sums)
          }
        end

        def generate_total_sums(results, query_params)
          if params[:showSums] == 'true'
            query_params[:showSums] = 'true'
            format_query_sums results.all_total_sums
          end
        end

        def format_query_sums(sums)
          OpenStruct.new(format_column_keys(sums))
        end

        def format_column_keys(hash_by_column)
          ::Hash[
            hash_by_column.map { |column, value|
              match = /cf_(\d+)/.match(column.name.to_s)

              column_name = if match
                              "custom_field_#{match[1]}"
                            else
                              column.name.to_s
                            end

              [column_name, value]
            }
          ]
        end

        def collection_representer(work_packages, project:, query_params:, groups:, sums:)
          self_link = if project
                        api_v3_paths.work_packages_by_project(project.id)
                      else
                        api_v3_paths.work_packages
                      end

          ::API::V3::WorkPackages::WorkPackageCollectionRepresenter.new(
            work_packages,
            self_link,
            project: project,
            query: query_params,
            page: params[:offset] ? params[:offset].to_i : nil,
            per_page: params[:pageSize] ? params[:pageSize].to_i : nil,
            groups: groups,
            total_sums: sums,
            current_user: current_user)
        end

        def convert_attribute(attribute, append_id: false)
          @conversion_wp ||= WorkPackage.new
          ::API::Utilities::PropertyNameConverter.to_ar_name(attribute,
                                                             context: @conversion_wp,
                                                             refer_to_ids: append_id)
        end

        def raise_invalid_query(errors)
          api_errors = errors.full_messages.map { |message|
            ::API::Errors::InvalidQuery.new(message)
          }

          raise ::API::Errors::MultipleErrors.create_if_many api_errors
        end
      end
    end
  end
end
