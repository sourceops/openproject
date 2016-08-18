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

namespace :ldap do

  desc 'Register a LDAP auth source for the given LDAP URL and attribute mapping: ' \
       'rake ldap:register["url=<URL>, name=<Name>, onthefly=<true,false>, map_{login,firstname,lastname,mail}=attribute"]'
  task register: :environment do

    # Rake croaks when using commas in default args without properly escaping
    args = {}
    ARGV.drop(1).each do |arg|
      key, val = arg.split(/\s*=\s*/, 2)
      args[key.to_sym] = val
    end

    url = URI.parse(args[:url])
    unless %w(ldap ldaps).include?(url.scheme)
      raise "Expected #{args[:url]} to be a valid ldap(s) URI."
    end

    source = LdapAuthSource.new name: args[:name],
                                host: url.host,
                                port: url.port,
                                tls: url.scheme == 'ldaps',
                                account: url.user,
                                account_password: url.password,
                                base_dn: url.dn,
                                onthefly_register: !!args[:onthefly],
                                attr_login: args[:map_login],
                                attr_firstname: args[:map_firstname],
                                attr_lastname: args[:map_lastname],
                                attr_mail: args[:map_mail]

    if source.save
      puts "Saved new LDAP auth source #{args[:name]}."
    else
      raise "Failed to save auth source: #{source.errors.full_messages.join("\n")}"
    end
  end

  desc 'Creates a dummy LDAP auth source for logging in any user using the password "dummy".'
  task create_dummy: :environment do
    source_name = 'DerpLAP'
    otf_reg = ARGV.include?('onthefly_register')

    source = DummyAuthSource.create name: source_name, onthefly_register: otf_reg

    puts
    if source.valid?
      puts "Created dummy auth source called \"#{source_name}\""
      puts 'On-the-fly registration support: ' + otf_reg.to_s
      unless otf_reg
        puts "use `rake ldap:create_dummy[onthefly_register]` to enable on-the-fly registration"
      end
    else
      puts "Dummy auth source already exists. It's called \"#{source_name}\"."
    end

    puts
    puts 'Note: Dummy auth sources cannot be edited, so clicking on them'
    puts "      in the 'LDAP Authentication' view will result in an error. Bummer!"
  end

  desc 'Delete all Dummy auth sources'
  task delete_dummies: :environment do
    DummyAuthSource.destroy_all

    puts
    puts 'Deleted all dummy auth sources. Users who used it are out of luck! :o'
  end
end
