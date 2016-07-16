class PlayerController < ApplicationController
  layout 'application'
  def index
    @songs_list = Song.all
  end

  def add_song
    song = Song.new(:url => params[:url], :title => params[:video_title], :videoId => params[:videoId])
    if song.save
      respond_to do |format|
        format.json { render :json => {title: song.title, url: song.url, video_id: song.videoId} }
        format.html { render :json => {title: song.title, url: song.url, video_id: song.videoId} }
      end
    end
  end
end
