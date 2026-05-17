import os

pages = ['men.html', 'women.html', 'jeans.html', 't-shirts.html', 'anime.html', 'track-pants.html', 'women-tops.html']

with open('shop-template.html', 'r') as f:
    template = f.read()

for filename in pages:
    with open(filename, 'w') as f:
        f.write(template)
    print(f"Updated {filename} with template")
