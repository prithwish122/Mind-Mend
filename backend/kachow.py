import subprocess
import json

print("ASK/PROMPT :")
prompt = input()

# Prepare the curl command
curl_command = [
    "curl",
    "-X", "POST", "https://bible.us.gaianet.network/v1/chat/completions",
    "-H", "accept: application/json",
    "-H", "Content-Type: application/json",
    "-d", json.dumps({
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        "stream":True
    })
]

# Execute the curl command and stream the output
process = subprocess.Popen(curl_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

try:
    # Read the output line by line
    for line in process.stdout:
        if line.startswith("data:"):
            # Extract the JSON part after "data: "
            json_data = line[5:].strip()
            if json_data:  # Ensure it's not empty
                try:
                    # Parse the JSON
                    parsed_data = json.loads(json_data)
                    # Extract and print the content value
                    content_value = parsed_data["choices"][0]["delta"]["content"]
                    print(content_value, end='', flush=True)  # Print without newline, flush output
                except (json.JSONDecodeError, KeyError) as e:
                    print()
                    # print(f"Error parsing JSON: {e}")  # Handle errors in parsing
except Exception as e:
    print("An error occurred:", str(e))
finally:
    process.stdout.close()
    process.wait()