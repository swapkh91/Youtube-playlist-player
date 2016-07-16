class Song < ActiveRecord::Base
  attr_accessible :title, :url, :videoId
end
