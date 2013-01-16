require "open-uri"
require "rdio.rb"

class UsersController < ApplicationController

  def index
  end
  def search

	keyword = params[:keyword].split.join('%20')
	begin

	data = open("http://tinysong.com/s/#{keyword}?format=json&limit=50&key=5d5a73becf2fbb5f9c59f801b9edeb6c").read

	puts "DATA #{data}"
	@playlist = JSON.parse(data)
        puts "PARSED DATA #{@playlist}"
	rescue Exception=>e
		puts "EXCEPTION :: #{e.message}"
	end
     respond_to do |format|
      format.js
     end

  end

  def search_spotify
	keyword = params[:keyword].split.join('+')
	begin

	data = open("http://ws.spotify.com/search/1/track.json?q=#{keyword}").read

	puts "DATA #{data}"
	@playlist = JSON.parse(data)['tracks']
        puts "PARSED DATA #{@playlist}"
	rescue Exception=>e
		puts "EXCEPTION :: #{e.message}"
	end
     respond_to do |format|
      format.js
     end
  end


  def search_soundcloud

	keyword = params[:keyword]
	begin
	
	# create a client object with your app credentials
	client = Soundcloud.new(:client_id => 'f7e97d20f4e0a7044abfb7a4e79700f0')

	# find all sounds of buskers licensed under 'creative commons share alike'
	tracks = client.get('/tracks', :q => keyword,:limit => 50, :licence => 'cc-by-sa')

	puts "TRACKS #{tracks}"
	@playlist = tracks #JSON.parse(tracks)
        puts "PARSED DATA #{@playlist}"
	rescue Exception=>e
		puts "EXCEPTION :: #{e.message}"
	end
     respond_to do |format|
      format.js
     end
  end


  def search_rdio

	keyword = params[:keyword]
	begin
	puts "AAAAAAAAAAAAA"
	rdio = Rdio.new(["cvswsfupv9d2svsfm936mxjs", "fG5t3EF7eG"])
	puts "KKKKKKKKKKKKKKK"
	data =  rdio.call('search', {'query'=>keyword,'types'=>'Artist,Album,Track,Playlist','count'=>50})
	puts "BBBBBBBBBBBB"
	@playlist = data['result']['results']
	puts "CCCCCCCCCCCCCCCCC #{@playlist}"
        puts "PARSED DATA #{@playlist}"
	rescue Exception=>e
		puts "EXCEPTION :: #{e.message}"
	end
     respond_to do |format|
      format.js
     end
  end


end
