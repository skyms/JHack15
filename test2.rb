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

before do
  cache_control :public, :must_revalidate, :max_age => 0
end

get '/' do 
    out = "Hackaton application.!"
end

get '/products' do
  # process the params however you want
    #shop = ShopifyAPI::Shop.current
    products = ShopifyAPI::Product.find(:all)
    callback = params['callback']
    content_type :json    
    #content_type 'application/javascript'
    response['Access-Control-Allow-Origin'] = '*'
    products.to_json
end

post '/updateold' do
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
    response['Access-Control-Allow-Origin'] = '*'
    "#{callback}(#{products.to_json})"

end


post '/update' do
  # process the params however you want
    #shop = ShopifyAPI::Shop.current
    retStr = ''
    outData = ''
    request.body.rewind
    data = JSON.parse(request.body.read)

    puts data    

    data["products"].each do |product|
        #retStr =  "............" + retStr + product["id"].to_s + product["price"] + product["inventory_quantity"].to_s + product["title"] + "............"
        pID = product["id"]
        tempProduct = ShopifyAPI::Product.find(pID)
        #outData = outData + '----------' +  tempProduct.title + " - - " + pID.to_s + '---------- \n' 
        tempProduct.title = product["title"]
        tempProduct.variants[0].inventory_quantity = product["inventory_quantity"]
        tempProduct.variants[0].price = product["price"].to_s
        tempProduct.save    
    end    
    # retStr = retStr + '\n' + outData
    # content_type 'text/plain'
    # response['Access-Control-Allow-Origin'] = 'http:localhost:4567'
    # retStr
    products = ShopifyAPI::Product.find(:all)
    content_type :json
    #content_type 'application/javascript'
    response['Access-Control-Allow-Origin'] = '*'
    products.to_json

end


post '/delete' do
  # process the params however you want
    #shop = ShopifyAPI::Shop.current
    retStr = ''
    outData = ''
    request.body.rewind
    data = JSON.parse(request.body.read)
    data["products"].each do |product|
        #retStr =  "............" + retStr + product["id"].to_s + product["price"] + product["inventory_quantity"].to_s + product["title"] + "............"
        pID = product["id"]
        tempProduct = ShopifyAPI::Product.find(pID)
        #outData = outData + '----------' +  tempProduct.title + " - - " + pID.to_s + '---------- \n' 
        tempProduct.destroy  
    end    
    # retStr
    products = ShopifyAPI::Product.find(:all)
    callback = params['callback']
    content_type :js    
    #content_type 'application/javascript'
    response['Access-Control-Allow-Origin'] = '*'
    products.to_json
end

options "*" do
  response.headers["Allow"] = "HEAD,GET,PUT,DELETE,OPTIONS"

  # Needed for AngularJS
  response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept"
  response['Access-Control-Allow-Origin'] = '*'
  halt 200
end


post '/events' do
  # process the params however you want
    #shop = ShopifyAPI::Shop.current
    request.body.rewind
    data = request.body.read
    puts ".....starting event handling from shopify...."    
    File.open('public/event.txt', 'w') { |file| file.write(data) }
    puts ".....returning event handling from shopify...."
    data.to_json
end

get '/myevents' do
    myHash = {}
    if File.zero?("public/event.txt")
    	404
    else
	    file = File.read('public/event.txt')
	    data = JSON.parse(file)
	    myHash["id"] = data["id"]
	    myHash["title"] = data["title"]
	    myHash["inventory_quantity"] = data["variants"][0]["inventory_quantity"]    
	    myHash["price"] = data["variants"][0]["price"]    
	    puts ".....event returning...."
		File.open('public/event.txt', 'w') {|f| f.truncate(0) }
	    myHash.to_json
	end
end


delete '/event' do
  # process the params however you want
    #shop = ShopifyAPI::Shop.current
    begin
        File.delete('public/event1.txt')
    rescue => err
    #Ignore this error
	end
    204
end

