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

MEALS = ["breakfast", "lunch", "hi-tea", "dinner"]
MENU_URL = "https://raw.githubusercontent.com/harshitbudhraja/harshitbudhraja.github.io/master/data/DH.json"

def getResponse(req):
	parameters = req.get("queryResult").get("parameters")
	date = parameters.get("date")
	meal = parameters.get("meal")
	queryString = req.get("queryResult").get("queryText")
	if meal not in MEALS:
		# the meal parameter in request is not a valid meal
		return "I didn't get that, could you say it again?"
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
		if not menu:
			return ("I'm sorry but I could not find out the menu you asked for. I've contacted Harshit about this problem of yours and he'll probably look into it soon.") 
		else:
			text = "The mess is serving "
			menu_items = ""
			for item in menu:
				if "_" not in item:
					menu_items = menu_items + ", " + item.strip()
			menu_items = menu_items[2:len(menu_items)]
			return text + menu_items + " for " + queryString + "."


def parseMenu(day, meal):
	print("parseMenu() Query: " + day + " - " + meal)
	r = requests.get(MENU_URL)
	mm = list()
	if r.status_code == 200:
		# the menu is found on the given url
		print(r.text)
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
			ret = {}
		print(ret)
		return ret
	elif r.status_code == 404:
		# the menu is not found on the url
		return {}

