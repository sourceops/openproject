module Members
  class UserFilterCell < ::UserFilterCell
    class << self
      def filter_name_condition
        super.gsub /lastname|firstname|mail/, "users.\\0"
      end

      def filter_name_columns
        [:lastname, :firstname, :mail]
      end

      def filter_status_condition
        super.sub /status/, "users.\\0"
      end

      def filter_group_condition
        # we want to list both the filtered group itself if a member (left of OR)
        # and users of that group (right of OR)
        super.sub /group_id/, "users.id = :group_id OR group_users.\\0"
      end

      def join_group_users(query)
        query # it will be joined by the table already
      end

      def filter_role_condition
        super.sub /role_id/, "member_roles.\\0"
      end

      def join_role(query)
        query # it will be joined by the table already
      end
    end

    ##
    # Adapts the user filter counts to count members as opposed to users.
    def extra_user_status_options
      {
        all: all_members_query.count,
        blocked: blocked_members_query.count,
        active: active_members_query.count,
        invited: invited_members_query.count
      }
    end

    def all_members_query
      Member.where(project: project)
    end

    def active_members_query
      blocked_members_query false
    end

    def blocked_members_query(blocked = true)
      project_members_query User.create_blocked_scope(Member.joins(:principal), blocked),
                            include_groups: false
    end

    def invited_members_query
      project_members_query Member.joins(:principal), status: :invited, include_groups: false
    end

    def project_members_query(query, status: :active, include_groups: true)
      groups = " OR users.type = 'Group'" if include_groups

      query
        .where(project: project)
        .where("users.status = #{User::STATUSES[status]}#{groups}")
    end
  end
end
