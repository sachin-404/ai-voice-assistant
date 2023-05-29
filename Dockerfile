FROM python:3.10-slim-buster

WORKDIR /app

COPY requirements.txt /app/

RUN apt-get update && apt-get install -y espeak && apt install -y ffmpeg && \
    pip3 install --upgrade GoogleBard && \
    pip3 install -r requirements.txt

COPY . /app/

EXPOSE 5000
ENV FLASK_APP=app.py

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
