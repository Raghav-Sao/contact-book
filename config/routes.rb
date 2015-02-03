Rails.application.routes.draw do
  # You can have the root of your site routed with "root"
  resources :contacts
  root 'contacts#index'
end
