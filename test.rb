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
    #content_type 'application/javascript'
    response['Access-Control-Allow-Origin'] = 'http:localhost:4567'

    "#{callback}(#{products.to_json})"
end

post '/update' do
  # process the params however you want
    #shop = ShopifyAPI::Shop.current
    retStr = ''
    outData = ''
    request.body.rewind
    data = JSON.parse(request.body.read)
    data["products"].each do |product|
        retStr =  "............" + retStr + product["id"].to_s + product["price"] + product["inventory_quantity"].to_s + product["title"] + "............"
        pID = product["id"]
        tempProduct = ShopifyAPI::Product.find(pID)
        outData = outData + '----------' +  tempProduct.title + " - - " + pID.to_s + '---------- \n' 
        tempProduct.title = product["title"]
        tempProduct.variants[0].inventory_quantity = product["inventory_quantity"]
        tempProduct.variants[0].price = product["price"]
        tempProduct.save    
    end    
    # retStr = retStr + '\n' + outData
    # content_type 'text/plain'
    # response['Access-Control-Allow-Origin'] = 'http:localhost:4567'
    # retStr
    products = ShopifyAPI::Product.find(:all)
    callback = params['callback']
    content_type :js    
    #content_type 'application/javascript'
    response['Access-Control-Allow-Origin'] = 'http:localhost:4567'
    "#{callback}(#{products.to_json})"

end


post '/delete' do
  # process the params however you want
    #shop = ShopifyAPI::Shop.current
    retStr = ''
    outData = ''
    request.body.rewind
    data = JSON.parse(request.body.read)
    data["products"].each do |product|
        retStr =  "............" + retStr + product["id"].to_s + product["price"] + product["inventory_quantity"].to_s + product["title"] + "............"
        pID = product["id"]
        tempProduct = ShopifyAPI::Product.find(pID)
        outData = outData + '----------' +  tempProduct.title + " - - " + pID.to_s + '---------- \n' 
        tempProduct.destroy  
    end    
    # retStr
    products = ShopifyAPI::Product.find(:all)
    callback = params['callback']
    content_type :js    
    #content_type 'application/javascript'
    response['Access-Control-Allow-Origin'] = 'http:localhost:4567'
    "#{callback}(#{products.to_json})"
end
