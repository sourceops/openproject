class WorkPackageField
  include Capybara::DSL
  include RSpec::Matchers

  attr_reader :selector,
              :property_name
  attr_accessor :field_type

  def initialize(context,
                 property_name,
                 selector: nil)

    @property_name = property_name
    @context = context
    @selector = selector || ".inplace-edit.#{property_name}"

    ensure_page_loaded
  end

  def expect_state_text(text)
    expect(element).to have_selector(trigger_link_selector, text: text)
  end

  def expect_text(text)
    expect(element).to have_content(text)
  end

  def expect_value(value)
    expect(input_element.value).to eq(value)
  end

  def element
    @context.find(@selector)
  end

  ##
  # Activate the field and check it opened correctly
  def activate!
    element.find(trigger_link_selector).click
    expect_active!
  end

  def expect_active!
    expect(element).to have_selector(field_type, wait: 10)
  end

  def expect_inactive!
    expect(element).to have_no_selector(field_type, wait: 10)
  end

  def expect_invalid
    expect(element).to have_selector("#{input_selector}:invalid")
  end

  def expect_error
    expect(page).to have_selector("#{field_selector}.-error")
  end

  def save!
    if @property_name.to_s == 'description'
      submit_by_dashboard
    else
      submit_by_enter
    end
  end

  ##
  # Set or select the given value.
  # For fields of type select, will check for an option with that value.
  def set_value(content)
    if input_element.tag_name == 'select'
      input_element.find(:option, content).select_option
    else
      input_element.set(content)
    end
  end

  def trigger_link
    element.find trigger_link_selector
  end

  def trigger_link_selector
    '.inplace-edit--read-value'
  end

  def field_selector
    @selector
  end

  def activate_edition
    element.find("#{trigger_link_selector}").click
  end

  def input_element
    element.find input_selector
  end

  def submit_by_click
    ActiveSupport::Deprecation.warn('submit_by_click is no longer available')
    submit_by_enter
  end

  def submit_by_dashboard
    element.find('.inplace-edit--control--save > a', wait: 5).click
  end

  def submit_by_enter
    input_element.native.send_keys(:return)
  end

  def cancel_by_click
    ActiveSupport::Deprecation.warn('cancel_by_click is no longer available')
    cancel_by_escape
  end

  def cancel_by_escape
    input_element.native.send_keys :escape
  end

  def editable?
    element['class'].include? '-editable'
  end

  def editing?
    element.find(input_selector)
    true
  rescue
    false
  end

  def errors_text
    element.find('.inplace-edit--errors--text').text
  end

  def errors_element
    element.find('.inplace-edit--errors')
  end

  def ensure_page_loaded
    if Capybara.current_driver == Capybara.javascript_driver
      extend ::Angular::DSL unless singleton_class.included_modules.include?(::Angular::DSL)
      ng_wait

      expect(page).to have_selector('#work-packages-list-view-button.-active,
        .work-packages--details--title,
        .work-package-details-activities-activity-contents,
        #work-packages--edit-actions-save'.squish)
    end
  end

  def input_selector
    '.wp-inline-edit--field'
  end

  def field_type
    @field_type ||= begin
      case property_name
      when :assignee,
           :responsible,
           :priority,
           :project,
           :status,
           :type,
           :category
        :select
      else
        :input
      end.to_s
    end
  end
end
