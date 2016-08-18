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

class WorkPackage::PdfExport::WorkPackageListToPdf
  include WorkPackage::PdfExport::Common

  attr_accessor :work_packages,
                :pdf,
                :project,
                :query,
                :results,
                :options

  def initialize(work_packages, project, query, results, options = {})
    @cell_padding = options.delete(:cell_padding)

    self.work_packages = work_packages
    self.project = project
    self.query = query
    self.results = results
    self.options = options

    self.pdf = get_pdf(current_language)

    pdf.options[:page_size] = 'EXECUTIVE'
    pdf.options[:page_layout] = :landscape
  end

  def render!
    write_title!
    write_work_packages!

    write_footers!

    pdf
  end

  def write_title!
    pdf.title = title
    pdf.font style: :bold, size: 11
    pdf.text title
    pdf.move_down 20
  end

  def title
    title = query.new_record? ? I18n.t(:label_work_package_plural) : query.name

    if project
      "#{project} - #{title}"
    else
      title
    end
  end

  def write_footers!
    pdf.number_pages format_date(Date.today),
                     at: [pdf.bounds.left, 0],
                     style: :italic

    pdf.number_pages "<page>/<total>",
                     at: [pdf.bounds.right - 25, 0],
                     style: :italic
  end

  def write_work_packages!
    pdf.font style: :normal, size: 8
    pdf.table(data, column_widths: column_widths)
  end

  def column_widths
    widths = query.columns.map do |col|
      if col.name == :subject || text_column?(col)
        4.0
      else
        1.0
      end
    end
    ratio = pdf.bounds.width / widths.sum

    widths.map { |w| w * ratio }
  end

  def description_colspan
    query.columns.size
  end

  def text_column?(column)
    column.is_a?(QueryCustomFieldColumn) &&
      ['string', 'text'].include?(column.custom_field.field_format)
  end

  def data
    [data_headers] + data_rows
  end

  def data_headers
    query.columns.map(&:caption).map do |caption|
      pdf.make_cell caption, font_style: :bold, background_color: 'CCCCCC'
    end
  end

  def data_rows
    previous_group = nil

    work_packages.flat_map do |work_package|
      values = query.columns.map do |column|
        make_column_value work_package, column
      end

      result = [values]

      if options[:show_descriptions]
        make_description(work_package.description.to_s).each do |segment|
          result << [segment]
        end
      end

      if query.grouped? && (group = query.group_by_column.value(work_package)) != previous_group
        label = (group.blank? ? 'None' : group.to_s) +
          " (#{results.work_package_count_for(group)})"
        previous_group = group

        result.insert 0, [
          pdf.make_cell(label, font_style: :bold,
                               colspan: query.columns.size,
                               background_color: 'DDDDDD')
        ]
      end

      result
    end
  end

  def make_column_value(work_package, column)
    if column.is_a?(QueryCustomFieldColumn)
      make_custom_field_value work_package, column
    else
      make_field_value work_package, column.name
    end
  end

  def make_field_value(work_package, column_name)
    pdf.make_cell field_value(work_package, column_name),
                  padding: cell_padding
  end

  def make_custom_field_value(work_package, column)
    value = work_package
      .custom_values
      .detect { |v| v.custom_field_id == column.custom_field.id }

    pdf.make_cell show_value(value),
                  padding: cell_padding
  end
end
