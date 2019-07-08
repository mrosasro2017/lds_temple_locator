let $loading = $('#view-file-loading');
let country=$("#select_country").find('option:selected').val();

let temples;
let feature_layer
let current_layer;

function showTemples () {
	map.removeLayer(temples);

	country=$("#select_country").find('option:selected').val();

	console.log(country);

	temples = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			url: 'https://tethys.byu.edu/geoserver/LDS_Temples/wms',
			params: { 'LAYERS': country },
			serverType: 'geoserver',
			crossOrigin: 'Anonymous'
		}),
		//opacity: 0.3
	});

	let ajax_url;

	ajax_url = 'https://tethys.byu.edu/geoserver/LDS_Temples/wfs?request=GetCapabilities';

	let capabilities = $.ajax(ajax_url, {
		type: 'GET',
		data: {
			service: 'WFS',
			version: '1.0.0',
			request: 'GetCapabilities',
			outputFormat: 'text/javascript'
		},
		success: function() {
			let x = capabilities.responseText
			.split('<FeatureTypeList>')[1]
			.split('LDS_Temples:' + country)[1]
			.split('LatLongBoundingBox ')[1]
			.split('/></FeatureType>')[0];

			let minx = Number(x.split('"')[1])-0.25;
			let miny = Number(x.split('"')[3])-0.25;
			let maxx = Number(x.split('"')[5])+0.25;
			let maxy = Number(x.split('"')[7])+0.25;

			let extent = ol.proj.transform([minx, miny], 'EPSG:4326', 'EPSG:3857').concat(ol.proj.transform([maxx, maxy], 'EPSG:4326', 'EPSG:3857'));
			//let extent = ol.proj.transform([minx, miny], 'EPSG:4326', 'EPSG:4326').concat(ol.proj.transform([maxx, maxy], 'EPSG:4326', 'EPSG:4326'));

			map.getView().fit(extent, map.getSize());

		}
	});

	map.addLayer(temples);

	feature_layer = temples;

	temples.once('render', function() {
		view.fitExtent(temples.getSource().getExtent(), map.getSize());
	});
}

let base_layer = new ol.layer.Tile({
	source: new ol.source.BingMaps({
		key: 'eLVu8tDRPeQqmBlKAjcw~82nOqZJe2EpKmqd-kQrSmg~AocUZ43djJ-hMBHQdYDyMbT-Enfsk0mtUIGws1WeDuOvjY4EXCH-9OK3edNLDgkc',
		imagerySet: 'Road'
	})
});

let map = new ol.Map({
	target: 'showMapView',
	layers: [base_layer],
	view: new ol.View({
		center: ol.proj.fromLonLat([10, 40]),
		zoom: 1.9
	})
});

map.on('pointermove', function(evt) {
	if (evt.dragging) {
		return;
	}
	let pixel = map.getEventPixel(evt.originalEvent);
	let hit = map.forEachLayerAtPixel(pixel, function(layer) {
		if (layer == feature_layer) {
			current_layer = layer;
			return true;
		}
	});
	map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

map.on("singleclick", function(evt) {

	if (map.getTargetElement().style.cursor == "pointer") {

		let view = map.getView();
		let viewResolution = view.getResolution();
		let wms_url = current_layer.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), { 'INFO_FORMAT': 'application/json' });

		if (wms_url) {

			$("#obsgraph").modal('show');
			$("#temple-info").empty()

			$.ajax({
				type: "GET",
				url: wms_url,
				dataType: 'json',
				success: function (result) {
					templename = result["features"][0]["properties"]["Temple"];
					templeaddress = result["features"][0]["properties"]["Address"];
					templecity = result["features"][0]["properties"]["City"];
					templecountry = result["features"][0]["properties"]["Country"];
					templelongitude = result["features"][0]["properties"]["Longitude"];
					templelatitude = result["features"][0]["properties"]["Latitude"];
					templephone = result["features"][0]["properties"]["Phone"];
					templecondition = result["features"][0]["properties"]["Condition"];
					templepicture = result["features"][0]["properties"]["Temple_Pic"];
					templeregion = result["features"][0]["properties"]["Region_Map"];
					$("#temple-info").append('<h3 id="Temple-Name-Tab">Temple: '+ templename
						+ '</h3><h5 id="Temple-Address-Tab">Addresss: '
						+ templeaddress + '</h5><h5 id="Temple-City-Tab">City: '
						+ templecity + '</h5><h5 id="Temple-Country-Tab">Country: '
						+ templecountry + '</h5><h5 id="Temple-Telephone-Tab">Phone: '
						+ templephone + '</h5><h5 id="Temple-Condition-Tab">Condition: '
						+ templecondition + '</h5><h5 id="Temple-Picture-Tab">Temple Picture:</h5>'
						+ '<img src= "' + templepicture + '"width="850" height="534">');
				}
			});
		}
	};
});