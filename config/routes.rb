SongPalyer::Application.routes.draw do
  root :to => 'player#index'
  post '/player/add_song' => 'player#add_song'
end
