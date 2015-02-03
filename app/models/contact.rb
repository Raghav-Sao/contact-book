class Contact < ActiveRecord::Base
  validates :name, :phone,  presence: true

  def as_json(options={})
    super(:include => [])
  end
end
