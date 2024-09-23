from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from korea_ai import stream_chat_response
import os

app = Flask(__name__)
CORS(app)
# Handling GET request
@app.route('/get_example', methods=['GET'])
def get_example():
    name = request.args.get('name', 'Guest')
    return f"Hello, {name}!"

# Handling POST request
@app.route('/post_example', methods=['POST'])
def post_example():
    data = request.json
    if data:
        name = data.get('name', 'Guest')
        return jsonify(message=f"Hello, {name}!")
    else:
        return jsonify(error="No data received"), 400

# Handling POST request for chat input
@app.route('/chat_gen', methods=['POST'])
def gen_chat():
    data = request.json
    if data:
        prompt = data.get('prompt', 'Guest')
        bible_ans = stream_chat_response(prompt)
        return jsonify(ans=f"{bible_ans}")
        # Using Response with a generator to stream data
        # return Response(stream_chat_response(prompt), content_type='text/event-stream')
    else:
        return jsonify(error="No data received"), 400

if __name__ == '__main__':
    # app.run(debug=True,port=)
    port = int(os.getenv("PORT", 8000))  # Default to 8000 if PORT is not set or falsy
    app.run(debug=True, port=port)

