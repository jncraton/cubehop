all: js/three.min.js

lint:
	npx prettier@3.6.2 --check .

format:
	npx prettier@3.6.2 --write .

js/three.min.js:
	mkdir -p js
	wget -O js/three.min.js https://unpkg.com/three@0.160.0/build/three.min.js

test: js/three.min.js
	uv run --with pytest-playwright==0.7.2 python -m playwright install chromium firefox
	uv run --with pytest-playwright==0.7.2 python -m pytest

clean:
	rm -rf .pytest_cache __pycache__ js/three.min.js
