require 'rubygems'
require 'open-uri'
require 'xmlsimple'
require 'json'

s=open('http://gdata.youtube.com/feeds/api/videos/-/music%7Csongs/gangnam/style?v=2&start-index=1&max-results=20').read

#puts s
#puts "++++++++++++++++++++++++++++++++++++++++++++++"
data = XmlSimple.xml_in(s)

data["entry"].each do |entry|

puts "#{entry["author"][0]["name"][0]}-#{entry["title"][0]}-----------#{entry["link"][0]["href"]}"

end

#puts data.to_json


 