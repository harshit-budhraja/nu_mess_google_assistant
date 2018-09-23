# Author:- Harshit Budhraja
# Date:- 23/09/2018

########################################################## Response Types ############################################################
"""
MEAL_PARAM_404_RES: When the given meal does not belong to the valid meals i.e. breakfast, lunch, hi-tea and dinner served in the mess
MENU_PARSE_ERROR_RES: When the given query could not executed successfully on the parsed menu. This is mostly never occur as there is a 
					  validation in place before reaching this error, which will trigger MEAL_PARAM_404_RES
MENU_404_ERROR_RES: When the DH.json file cannot be found on the URL or there's some internet issue that's blocking the request
"""
#######################################################################################################################################

import random

MENU_PARSE_ERROR_RES = [
	"I'm sorry but I could not find out the menu you asked for. I've contacted Harshit about this problem of yours and he'll probably look into it soon.",
	"I'm sorry but I'm unable to get to your requested menu right now. Please try again in a while.",
	"I'm facing some problem giving you an answer about the menu. Please try again in a while.",
	"The requested menu could not be retrieved because of some internal issue. Please try again in a while."
]

MENU_404_ERROR_RES = [
	"Your request could not be completed because I couldn't find NIIT University's Mess Menu where it was supposed to be. I'll check with Harshit and maybe you can try asking me again in a while.",
	"Oops! I think your mess' menu is playing hide-and-seek with me right now. I couldn't find it where it usually hides. Give me a few minutes to find it.",
	"I'm sorry but I think the mess menu's misplaced. Let me find it and get back to you?",
	"There's a small problem. My brain's messed up and I cannot find your menu where it's supposed to be. Give me sometime so that I can fix this."
]

MEAL_PARAM_404_RES = [
	"I didn't get that, could you say it again?",
	"I'm sorry I didn't catch that. Could you say it again?",
	"I'm sorry, what meal?",
	"What meal?",
	"I'm sorry I was a bit occupied and missed what you just asked me. Could you maybe say it again?",
	"I'm sorry I kind of missed what you just asked me. Could you maybe say it one more time?",
	"I didn't really get your question. Was it about breakfast, lunch, evening snacks or the dinner?"
]


def generateResponse(res_type):
	rand = random.randint(0, len(res_type)-1)
	return res_type[rand]