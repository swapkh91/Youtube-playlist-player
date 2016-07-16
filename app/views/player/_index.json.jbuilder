json.songs do
  json.data @songs_list do |song|
    json.url song.url
    json.title song.title
    json.video_id song.videoId
  end
end