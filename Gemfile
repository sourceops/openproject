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

source 'https://rubygems.org'

gem 'rails', '~> 4.2.7', '>= 4.2.7.1'
gem 'actionpack-action_caching'
gem 'actionpack-xml_parser'
gem 'activerecord-session_store'
gem 'rails-observers'
gem 'responders', '~> 2.0'

gem 'coderay', '~> 1.1.0'
gem 'rubytree', '~> 0.9.7'
gem 'rdoc', '>= 2.4.2'
gem 'globalize', '~> 5.0.1'
gem 'omniauth', github: 'oliverguenther/omniauth'
gem 'request_store', '~> 1.3.0'
gem 'gravatar_image_tag', '~> 1.2.0'

gem 'warden', '~> 1.2'
gem 'warden-basic_auth', '~> 0.2.1'

# TODO: adds #auto_link which was deprecated in rails 3.1
gem 'rails_autolink', '~> 1.1.6'
gem 'will_paginate', '~> 3.1'
gem 'acts_as_list', '~> 0.7.2'

gem 'friendly_id', '~> 5.1.0'

gem 'awesome_nested_set', github: 'finnlabs/awesome_nested_set', branch: 'v2.1.6-rails4'

gem 'color-tools', '~> 1.3.0', require: 'color'

gem 'ruby-progressbar'

# Provide timezone info for TZInfo used by AR
gem 'tzinfo-data'

# to generate html-diffs (e.g. for wiki comparison)
gem 'htmldiff'

# Generate url slugs with #to_url and other string niceties
gem 'stringex', '~> 2.6.1'

# generates SVG Graphs
# used for statistics on svn repositories
gem 'svg-graph', github: 'why-el/svg-graph', branch: 'silence-class-access-warning'

gem 'date_validator', '~> 0.9.0'
gem 'ruby-duration', '~> 3.2.0'

# provide compatible filesystem information for available storage
gem 'sys-filesystem', '~> 1.1.4', require: false

# We rely on this specific version, which is the latest as of now (end of 2013),
# because we have to apply to it a bugfix which could break things in other versions.
# This can be removed as soon as said bugfix is integrated into rabl itself.
# See: config/initializers/rabl_hack.rb
gem 'rabl', '0.9.3'
gem 'multi_json', '~> 1.11.0'
gem 'oj', '~> 2.14.6'

gem 'delayed_job_active_record', '~> 4.1.0'
gem 'daemons'

# include custom rack-protection for now until rkh/rack-protection is fixed and released
# (see https://community.openproject.org/work_packages/3029)
gem 'rack-protection', git: 'https://github.com/finnlabs/rack-protection.git', ref: '5a7d1bd'

# Rack::Attack is a rack middleware to protect your web app from bad clients.
# It allows whitelisting, blacklisting, throttling, and tracking based on arbitrary properties of the request.
# https://github.com/kickstarter/rack-attack
gem 'rack-attack'

# Patch Rails HTML whitelisting for Angular curly braces
gem 'rails-angular-xss', github: 'opf/rails-angular-xss'

gem "syck", '~> 1.0.5', require: false
gem 'gon', '~> 4.0'

# catch exceptions and send them to any airbrake compatible backend
# don't require by default, instead load on-demand when actually configured
gem 'airbrake', '~> 5.1.0', require: false

gem 'transactional_lock', git: 'https://github.com/finnlabs/transactional_lock.git', branch: 'master'

gem 'prawn', '~> 2.1'
gem 'prawn-table', '~> 0.2.2'

gem 'cells-rails', '~> 0.0.6'
gem 'cells-erb', '~> 0.0.8'

group :production do
  # we use dalli as standard memcache client
  # requires memcached 1.4+
  # see https://github.clientom/mperham/dalli
  gem 'dalli', '~> 2.7.6'
end

gem 'sprockets', '~> 3.5.2'
gem 'sass-rails', '~> 5.0.3'
gem 'sass', '~> 3.4.12'
gem 'autoprefixer-rails'
gem 'bourbon', '~> 4.2.0'
gem 'i18n-js', '>= 3.0.0.rc13'

gem 'prototype-rails', git: 'https://github.com/rails/prototype-rails.git', branch: '4.2'
# remove once we no longer use the deprecated "link_to_remote", "remote_form_for" and alike methods
# replace those with :remote => true
gem 'prototype_legacy_helper', '0.0.0', git: 'https://github.com/rails/prototype_legacy_helper.git'

# small wrapper around the command line
gem 'cocaine'

# required by Procfile, for deployment on heroku or packaging with packager.io.
# also, better than thin since we can control worker concurrency.
gem 'unicorn'

gem 'nokogiri', '~> 1.6.8'

# carrierwave 0.11.3 should allow to use fog-aws without the rest of the
# fog dependency chain. We only need aws here, so we can avoid it
# at the cost of referencing carrierwave#master for now.
gem 'fog-aws'
gem 'carrierwave', git: 'https://github.com/carrierwaveuploader/carrierwave', branch: 'master'

group :test do
  gem 'rack-test', '~> 0.6.2'
  gem 'shoulda-context', '~> 1.2'
  gem 'launchy'

  # Require factory_girl for usage with openproject plugins testing
  # FactoryGirl needs to be available when loading app otherwise factory
  # definitions from core are not available in the plugin thus specs break
  gem 'factory_girl', '~> 4.5'
  # require factory_girl_rails for convenience in core development
  gem 'factory_girl_rails', '~> 4.6', require: false

  gem 'cucumber', '~> 1.3.19'
  gem 'cucumber-rails', '~> 1.4.2', require: false
  gem 'rack_session_access'
  gem 'database_cleaner', '~> 1.5.1'
  gem 'rspec', '~> 3.4.0'
  # also add to development group, so "spec" rake task gets loaded
  gem 'rspec-rails', '~> 3.4.2', group: :development
  gem 'rspec-activemodel-mocks', '~> 1.0.3', git: 'https://github.com/rspec/rspec-activemodel-mocks'
  gem 'rspec-example_disabler', git: 'https://github.com/finnlabs/rspec-example_disabler.git'
  gem 'rspec-legacy_formatters', require: false
  gem 'capybara', '~> 2.6.2'
  gem 'capybara-screenshot', '~> 1.0.12'
  gem 'fuubar'
  gem 'capybara-select2', github: 'goodwill/capybara-select2'
  gem 'capybara-ng', '~> 0.2.2'
  gem 'selenium-webdriver', '~> 2.53.4'
  gem 'poltergeist'
  gem 'timecop', '~> 0.8'
  gem 'webmock', '~> 1.24.2', require: false

  # why in Gemfile? see: https://github.com/guard/guard-test
  gem 'ruby-prof'
  gem 'simplecov', require: false
  gem 'shoulda-matchers', '~> 3.1', require: nil
  gem 'json_spec'
  gem 'activerecord-tableless', '~> 1.0'
  gem 'codecov', require: nil
  gem 'equivalent-xml', '~> 0.6'
end

group :ldap do
  gem 'net-ldap', '~> 0.14.0'
end

group :development do
  gem 'letter_opener'
  gem 'thin', '~> 1.7.0'
  gem 'faker'
  gem 'quiet_assets'
  gem 'livingstyleguide', '~> 2.0.0.pre.1'
end

group :development, :test do
  gem 'pry-rails'
  gem 'pry-stack_explorer'
  gem 'pry-rescue'
  gem 'pry-byebug', platforms: [:mri]
  gem 'pry-doc'
  gem 'parallel_tests', '~> 2.4.1'
  gem 'rubocop'
end

# API gems
gem 'grape', '~> 0.10.1'
gem 'grape-cache_control', '~> 1.0.1'

gem 'roar',   '~> 1.0.0'
gem 'reform', '~> 1.2.6', require: false

platforms :mri, :mingw, :x64_mingw do
  group :mysql2 do
    gem 'mysql2', '~> 0.4'
  end

  group :postgres do
    gem 'pg', '~> 0.18.4'
  end
end

platforms :jruby do
  gem 'jruby-openssl'

  group :mysql do
    gem 'activerecord-jdbcmysql-adapter'
  end

  group :postgres do
    gem 'activerecord-jdbcpostgresql-adapter'
  end
end

group :opf_plugins do
  gem 'openproject-translations', git:'https://github.com/opf/openproject-translations.git', branch: 'dev'
end

# TODO: Make this group :optional when bundler v10.x
# is matured enough that we can use this everywhere
# http://bundler.io/blog/2015/06/24/version-1-10-released.html
group :docker do
  gem 'passenger'

  # Used to easily precompile assets
  gem 'sqlite3', require: false
  gem 'rails_12factor', require: !!ENV['HEROKU']
  gem 'health_check', require: !!ENV['HEROKU']
  gem 'newrelic_rpm', require: !!ENV['HEROKU']
end

# Load Gemfile.local, Gemfile.plugins, plugins', and custom Gemfiles
gemfiles = Dir.glob File.expand_path('../{Gemfile.local,Gemfile.plugins,lib/plugins/*/Gemfile}', __FILE__)
gemfiles << ENV['CUSTOM_PLUGIN_GEMFILE'] unless ENV['CUSTOM_PLUGIN_GEMFILE'].nil?
gemfiles.each do |file|
  next unless File.readable?(file)
  eval_gemfile(file)
end
