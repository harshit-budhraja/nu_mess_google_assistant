# Author:- Harshit Budhraja
# Date:- 20/09/2018

# The brain of the Google Assistant webhook
# It requests the json file on my github where
# the mess menu is stored and works on creating
# a response by parsing the request parameters
# and processing them on this json menu object.

# Menu format:
# Breakfast - 6 items
# Lunch - 7 items
# Hi-Tea - 2 items
# Dinner - 6 items

import requests
import json
import datetime
from isodate import *
from responses import *

db_api_key = 'wmAphKS81eprJ6FTgjFeDvw2G22GICQ94D3z29UG'
MEALS = ["breakfast", "lunch", "hi-tea", "dinner"]
MENU_URL = "https://raw.githubusercontent.com/harshitbudhraja/old_harshitbudhraja.github.io/master/data/DH.json"

def getResponse(req):
	parameters = req.get("queryResult").get("parameters")
	date = parameters.get("date")
	meal = parameters.get("meal")
	queryString = req.get("queryResult").get("queryText")
	if meal not in MEALS:
		# the meal parameter in request is not a valid meal
		return generateResponse(MEAL_PARAM_404_RES)
	else:
		# the meal parameter in the request is a valid meal
		# can proceed with further processing
		d = parse_datetime(date).weekday()
		day = ""
		if d == 0:
			day = "Monday"
		elif d == 1:
			day = "Tuesday"
		elif d == 2:
			day = "Wednesday"
		elif d == 3:
			day = "Thursday"
		elif d == 4:
			day = "Friday"
		elif d == 5:
			day = "Saturday"
		elif d == 6:
			day = "Sunday"
		menu = parseMenu(day, meal)
		if menu == "parse_error":
			return generateResponse(MENU_PARSE_ERROR_RES)
		elif menu == "404_error":
			return generateResponse(MENU_404_ERROR_RES)
		else:
			text = "The mess serves "
			menu_items = ""
			for item in menu:
				if "_" not in item:
					menu_items = menu_items + ", " + item.strip()
			menu_items = menu_items[2:len(menu_items)]
			return text + menu_items + " for " + meal + " every " + day + "."


def parseMenu(day, meal):
	print("parseMenu() Query: " + day + " - " + meal)
	r = requests.get(MENU_URL)
	print(r)
	print(r.status_code)
	mm = list()
	if r.status_code == 200:
		# the menu is found on the given url
		menu = json.loads(r.text)
		ret = list()
		for item in menu["Sheet1"]:
			mm.append(item[day])
		if meal == "breakfast":
			ret = mm[0:6]
		elif meal == "lunch":
			ret = mm[6:13]
		elif meal == "hi-tea":
			ret = mm[13:15]
		elif meal == "dinner":
			ret = mm[15:21]
		else:
			ret = "parse_error"
		return ret
	elif r.status_code == 404:
		# the menu is not found on the url
		return "404_error"

def logIncoming(req):
	headers = {'Content-Type': 'application/json'}
	r = requests.post('https://tracker.dashbot.io/track?platform=google&v=10.1.1-rest&type=incoming&apiKey=' + db_api_key, headers=headers, data=json.dumps(req))
	return r.text

def logOutgoing(res):
	header = {'Content-Type': 'application/json'}
	r = requests.post('https://tracker.dashbot.io/track?platform=google&v=10.1.1-rest&type=outgoing&apiKey=' + db_api_key, headers=header, data=json.dumps(res))
	return r.text
