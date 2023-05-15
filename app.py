from flask import Flask, render_template, request, jsonify
from Bard import Chatbot
import re
import pyttsx3
import os

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

token = os.environ.get('API_KEY')
chatbot = Chatbot(token)

engine = pyttsx3.init()

def generate_response(prompt):
    response = chatbot.ask(prompt)
    content = response['content']
    content = re.sub(r'\*', '', content)  # Remove asterisks from the content
    content = re.sub(r'\n+', '\n', content)  # Replace consecutive newlines with a single newline
    content = content.strip()  # Remove leading/trailing whitespace
    return content

def convert_text_to_voice(text):
    engine.save_to_file(text, 'static/response.wav')
    engine.runAndWait()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_prompt', methods=['POST'])
def process_prompt():
    prompt = request.json['prompt']
    print(f"Prompt: {prompt}")

    # Generate response
    response = generate_response(prompt)
    print(f"Response: {response}")

    # Convert response to voice
    convert_text_to_voice(response)

    response_data = {
        'text': response,
        'audio': '/static/response.wav'
    }

    return jsonify(response_data)


if __name__ == '__main__':
    if not os.path.exists('static/response.wav'):
        app.run()
    else:
        os.remove('static/response.wav')
        app.run()
