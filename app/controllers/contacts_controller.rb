class ContactsController < ApplicationController
  before_action :get_contact, except: [:index, :create]
  respond_to :html, :json

  def index
    @contact = Contact.all
    respond_with(@contacts) do |format|
      format.json { render :json => @contact.as_json }
      format.html
    end
  end

  def create
    @contact = Contact.new(contact_params)
    if @contact.save
      render json: @contact.as_json, status: :ok
    else
      render json: {contact: @contact.errors, status: :no_content}
    end
  end      

  def show
    respond_with(@contact.as_json)
  end

  def update
    if @contact.update_attributes(contact_params)
      render json: @contact.as_json, status: :ok 
    else
      render json: {contact: @contact.errors, status: :unprocessable_entity}
    end
  end

  def destroy
    @contact.destroy
    render json: {status: :ok}
  end

  private

  def contact_params
    params.fetch(:contact, {}).permit(:name,:email, :phone)
  end

  def get_contact
    @contact = Contact.find(params[:id])
    render json: {status: :not_found} unless @contact
  end

end
