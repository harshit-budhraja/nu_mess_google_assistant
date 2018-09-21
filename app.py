# Author:- Harshit Budhraja
# Date:- 20/09/2018

# A webhook for NIIT University Mess
# Actions App on Google Assistant

from flask import Flask, redirect, jsonify, request, render_template
from flask_cors import CORS
import json
from brain import *

app = Flask(__name__)
CORS(app)

@app.route('/webhook', methods=['POST'])
def webhook():
	req = request.get_json(silent=True, force=True)
	response = getResponse(req)
	return jsonify({
		"fulfillmentText": response
		})

@app.route('/analytics')
def analytics():
	return render_template('analytics.html')

if __name__ == '__main__':
	app.run()