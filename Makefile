# install:
# 	python3 -m venv venv
# 	. venv/bin/activate && pip install -r requirements.txt

# run:
# 	. venv/bin/activate && flask run --host=0.0.0.0 --port=3000

install:
	python -m venv venv
	venv\Scripts\pip install -r requirements.txt

run:
	set FLASK_APP=app.py&& venv\Scripts\flask run --host=localhost --port=3000

