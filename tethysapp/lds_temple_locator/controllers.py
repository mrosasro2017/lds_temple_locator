from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import SelectInput
from .app import LdsTempleLocator as app
import os


@login_required()
def home(request):
	"""
    Controller for the app home page.
    """

	context = {
	}

	return render(request, 'lds_temple_locator/home.html')


def country_location(request):
	"""
    Controller for the app home page.
    """

	app_workspace = app.get_app_workspace()
	dirs = next(os.walk(app_workspace.path))[1]

	countries = []

	for entry in dirs:
		country = (entry.replace("_", " "), entry)
		countries.append(country)
		countries = sorted(countries, key=lambda tup: (tup[0], tup[1]))

	# Add selection option
	countries.insert(0, ("", ""))

	print(countries)

	select_country = SelectInput(display_text='Select Country', name='select_country', multiple=False,
	                             options=countries, initial='', attributes={'onchange': 'showTemples()'})

	context = {
		'select_country': select_country
	}

	return render(request, 'lds_temple_locator/country_location.html', context)


def state_location(request):
	"""
    Controller for the app home page.
    """

	app_workspace = app.get_app_workspace()
	dirs = next(os.walk(app_workspace.path + '/United_States/States'))[1]

	states = []

	for entry in dirs:
		state = (entry.replace("_", " "), entry)
		states.append(state)

		states = sorted(states, key=lambda tup: (tup[0], tup[1]))

	# Add selection option
	states.insert(0, ("", ""))

	select_state = SelectInput(display_text='Select State', name='select_state', multiple=False,
	                             options=states, initial='', attributes={'onchange': 'showTemples()'})

	context = {
		'select_state': select_state
	}

	return render(request, 'lds_temple_locator/state_location.html', context)


def about(request):
	"""
    Controller for the app home page.
    """

	context = {
	}

	return render(request, 'lds_temple_locator/about.html')
