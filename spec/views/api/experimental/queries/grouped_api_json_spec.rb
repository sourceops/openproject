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

require File.expand_path('../../../../../spec_helper', __FILE__)

describe 'api/experimental/queries/grouped.api.rabl', type: :view do
  before do
    params[:format] = 'json'

    assign(:user_queries, user_queries)
    assign(:queries, queries)
    render
  end

  subject { rendered }

  describe 'with no available queries' do
    let(:user_queries) {
      []
    }
    let(:queries) {
      []
    }

    it { is_expected.to have_json_path('user_queries') }
    it { is_expected.to have_json_type(Array).at_path('user_queries') }
    it { is_expected.to have_json_size(0).at_path('user_queries') }
    it { is_expected.to have_json_path('queries') }
    it { is_expected.to have_json_type(Array).at_path('queries') }
    it { is_expected.to have_json_size(0).at_path('queries') }
  end

  describe 'with 2 queries and no user queries' do
    let(:user_queries) {
      [['query1', 1], ['query2', 2]]
    }
    let(:queries) {
      []
    }

    it { is_expected.to have_json_path('user_queries') }
    it { is_expected.to have_json_type(Array).at_path('user_queries') }
    it { is_expected.to have_json_size(2).at_path('user_queries') }
  end

  describe 'with 2 user queries and no queries' do
    let(:user_queries) {
      []
    }
    let(:queries) {
      [['query1', 1], ['query2', 2]]
    }

    it { is_expected.to have_json_path('queries') }
    it { is_expected.to have_json_type(Array).at_path('queries') }
    it { is_expected.to have_json_size(2).at_path('queries') }
  end
end
