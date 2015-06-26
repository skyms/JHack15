require 'json'
    myHash = {}
    file = File.read('public/event.txt')
    data = JSON.parse(file)
    myHash["id"] = data["id"]
    myHash["title"] = data["title"]
    myHash["price"] = data["variants"][0]["price"]
    myHash["inventory_quantity"] = data["variants"][0]["inventory_quantity"]    

    puts ".....event returning.... #{myHash.to_json}"
