require 'json'
require 'sinatra'
require 'shopify_api'

Session = ShopifyAPI::Session.new("jhack.myshopify.com", "2c7904a2ae153e64e26221b5c084fa1c")
ShopifyAPI::Base.activate_session(Session)

def html_page(title, body='')
    "<html>" +
        "<head><title> #{title} </title></head>" +
        "<body><h1> #{title} </h1> #{body} </body>" +
    "</html>"
end


get '/' do 
    out = "hello, world!"
end

get '/products' do
  # process the params however you want
    #shop = ShopifyAPI::Shop.current
    products = ShopifyAPI::Product.find(:all)
    
    callback = params['callback']
    content_type :js    
    content_type 'application/javascript'
    response['Access-Control-Allow-Origin'] = 'http:localhost:4567'

    "#{callback}(#{products.to_json})"
end

