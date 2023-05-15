FROM python:3.12.0a7-buster

WORKDIR /app

COPY requirements.txt /app/

RUN apt-get update && apt-get install -y espeak && \
    pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 5000
ENV FLASK_APP=app.py

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
