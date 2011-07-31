# automatic deployment to gh-pages

require 'fileutils'
require 'uglifier'

# move files for deployment
files = %w( Icons ShopPrices.html priceInfo.js search.js style.css )
FileUtils.mkdir '.deploy'
FileUtils.mv files, '.deploy'

# switch branch
`git checkout gh-pages`

# remove all other files (ignores directories starting with .)
FileUtils.rm_rf Dir.glob '*'

# move files back
FileUtils.mv files.map { |f| File.join '.deploy', f }, '.'
FileUtils.rm_rf '.deploy'

# rename to index.html
FileUtils.mv 'ShopPrices.html', 'index.html'

# minify JS
Dir.glob('*.js').each do |f|
	minjs = Uglifier.compile File.read f
	File.open f, 'w' do |file|
		file.write minjs
	end
end

`git add .`

puts 'Done'
