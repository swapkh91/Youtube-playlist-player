class CreateTableSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :title
      t.string :url
      t.string :videoId

      t.timestamps
    end
  end

end
