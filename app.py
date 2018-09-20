# Author:- Harshit Budhraja
# A webhook for NIIT University Mess
# Actions App on Google Assistant
from flask import Flask, redirect, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/webhook', methods=['POST'])
def webhook():
	req = request.get_json(silent=True, force=True)
	print("Request:\n" + json.dumps(req, indent=4))
    
    #res = processRequest(req)
    #res = json.dumps(res, indent=4)
    # print(res)
    #r = make_response(res)
    #r.headers['Content-Type'] = 'application/json'
	return json.dumps(req)

if __name__ == '__main__':
	app.run()