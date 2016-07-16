class DropTableSongs < ActiveRecord::Migration
  def up
    drop_table :songs
  end

  def down
  end
end
