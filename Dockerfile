FROM python:3.10-slim-buster

WORKDIR /app

COPY requirements.txt /app/

RUN pip3 install --upgrade GoogleBard && \
    pip install -r requirements.txt

COPY . /app/

EXPOSE 5000
ENV FLASK_APP=app.py

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
