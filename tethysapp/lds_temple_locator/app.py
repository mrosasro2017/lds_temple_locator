from tethys_sdk.base import TethysAppBase, url_map_maker


class LdsTempleLocator(TethysAppBase):
	"""
    Tethys app class for LDS Temple Locator.
    """

	name = 'LDS Temple Locator'
	index = 'lds_temple_locator:home'
	icon = 'lds_temple_locator/images/icon_app.jpeg'
	package = 'lds_temple_locator'
	root_url = 'lds-temple-locator'
	color = '#d35400'
	description = 'Place a brief description of your app here.'
	tags = ''
	enable_feedback = False
	feedback_emails = []

	def url_maps(self):
		"""
        Add controllers
        """
		UrlMap = url_map_maker(self.root_url)

		url_maps = (
			UrlMap(
				name='home',
				url='lds-temple-locator',
				controller='lds_temple_locator.controllers.home'
			),
			UrlMap(
				name='country_location',
				url='lds-temple-locator/country_location',
				controller='lds_temple_locator.controllers.country_location'
			),
			UrlMap(
				name='state_location',
				url='lds-temple-locator/state_location',
				controller='lds_temple_locator.controllers.state_location'
			),
			UrlMap(
				name='about',
				url='lds-temple-locator/about',
				controller='lds_temple_locator.controllers.about'
			),
		)

		return url_maps
