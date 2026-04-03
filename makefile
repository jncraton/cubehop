all: js/three.module.js

lint:
	npx prettier@3.6.2 --check .

format:
	npx prettier@3.6.2 --write .

js/three.module.js:
	mkdir -p js
	wget -O js/three.module.js https://unpkg.com/three@0.160.0/build/three.module.js

test:
	uv run --with pytest-playwright==0.7.2 python -m playwright install chromium firefox
	uv run --with pytest-playwright==0.7.2 python -m pytest

clean:
	rm -rf .pytest_cache __pycache__ js/three.module.js
