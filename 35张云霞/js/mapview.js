require([
	"esri/Map",
	"esri/layers/GeoJSONLayer",
	"esri/views/SceneView",
	"esri/widgets/Legend",
	"esri/widgets/ScaleBar",
	"esri/tasks/support/Query",
	"esri/core/lang",
	"esri/core/promiseUtils",
	"esri/core/watchUtils",
	"esri/geometry/Circle",
	"esri/geometry/Point",
	"esri/geometry",

	"dojo/on",
	"dojo/dom",
	"dojo/domReady!"
], function(Map, GeoJSONLayer, SceneView, Legend, ScaleBar, Query, lang, promiseUtils, watchUtils, Circle, Point,
	geometry, on, dom) {

	const feallayer = new GeoJSONLayer({
		url: "https://skyezyx.github.io/population/sphp.json",
	});

	var ditu = "osm";
	var change = document.getElementById("change");

	var symbolpark = {
		type: "web-style",
		styleName: "EsriIconsStyle",
		name: "Park"
	};

	var rendererpark = {
		type: "simple",
		label: "park",
		symbol: symbolpark
	};

	var symbolschool = {
		type: "web-style",
		styleName: "EsriIconsStyle",
		name: "School"
	};

	var rendererschool = {
		type: "simple",
		label: "school",
		symbol: symbolschool
	};

	var symbolhospital = {
		type: "web-style",
		styleName: "EsriIconsStyle",
		name: "Hospital"
	};

	var rendererhospital = {
		type: "simple",
		label: "hospital",
		symbol: symbolhospital
	};

	var symbolpolice = {
		type: "web-style",
		styleName: "EsriIconsStyle",
		name: "Police"
	};

	var rendererpolice = {
		type: "simple",
		label: "police",
		symbol: symbolpolice
	};

	//				renderer.symbol.fetchSymbol().then(function(LiquidambarSymbol) {
	//						var objectSymbolLayer = LiquidambarSymbol.symbolLayers.getItemAt(0);
	//						objectSymbolLayer.height *= 10;
	//						objectSymbolLayer.width *= 10;
	//						objectSymbolLayer.depth *= 10;
	//		
	//						renderer.symbol = LiquidambarSymbol;
	//					});

	var template = {
		title: "{name}",
		content: [{
			type: "fields",
			fieldInfos: [{
					fieldName: "name",
					visible: true,
					label: "name"
				},
				{
					fieldName: "address",
					visible: true,
					label: "address"
				}
			]
		}]
	}

	const park = new GeoJSONLayer({
		url: "https://skyezyx.github.io/population/parka.json",
		title: "park",
		renderer: rendererpark,
		outFields: ["*"],
		popupTemplate: template
	});

	const school = new GeoJSONLayer({
		url: "https://skyezyx.github.io/population/school.json",
		title: "school",
		renderer: rendererschool,
		outFields: ["*"],
		popupTemplate: template
	});

	const hospital = new GeoJSONLayer({
		url: "https://skyezyx.github.io/population/hospital.json",
		title: "hospital",
		renderer: rendererhospital,
		outFields: ["*"],
		popupTemplate: template
	});

	const police = new GeoJSONLayer({
		url: "https://skyezyx.github.io/population/police.json",
		title: "police",
		renderer: rendererpolice,
		outFields: ["*"],
		popupTemplate: template
	});

	var map = new Map({
		basemap: ditu,
		ground: "world-elevation",
		layers: [feallayer]
	});

	const view = new SceneView({
		container: "viewDiv",
		map: map,
		center: [114.311, 30.588],
		zoom: 12,
		highlightOptions: {
			color: "black",
			haloOpacity: 0,
			fillOpacity: 0.7
		}
	});

	view.ui.add("title", "bottom-right");

	view.when(function() {
		var legend = new Legend({
			view: view
		});
		view.ui.add(legend, "bottom-left");
	});

	//切换底图
	document.getElementById('topo').addEventListener("click", function(event) {
		ditu = "topo";
		map.basemap = ditu;
	});
	document.getElementById('gray').addEventListener("click", function(event) {
		ditu = "gray";
		map.basemap = ditu;
	});
	document.getElementById('hybrid').addEventListener("click", function(event) {
		ditu = "hybrid";
		map.basemap = ditu;
	});
	document.getElementById('national-geographic').addEventListener("click", function(event) {
		ditu = "national-geographic";
		map.basemap = ditu;
	});
	document.getElementById('oceans').addEventListener("click", function(event) {
		ditu = "oceans";
		map.basemap = ditu;
	});
	document.getElementById('osm').addEventListener("click", function(event) {
		ditu = "osm";
		map.basemap = ditu;
	});
	document.getElementById('satellite').addEventListener("click", function(event) {
		ditu = "satellite";
		map.basemap = ditu;
	});

	//图层的动态添加与显示、删除
	var parkToggle = document.getElementById("park");

	parkToggle.addEventListener("change", function() {
		if (parkToggle.checked) {
			map.add(park);
			park.when(function() {
				view.goTo(park.fullExtent);
			});
		} else {
			map.remove(park);
		}

	});

	var policeToggle = document.getElementById("police");

	policeToggle.addEventListener("change", function() {
		if (policeToggle.checked) {
			map.add(police);
			police.when(function() {
				view.goTo(police.fullExtent);
			});
		} else {
			map.remove(police);
		}
	});

	var schoolToggle = document.getElementById("school");

	schoolToggle.addEventListener("change", function() {
		if (schoolToggle.checked) {
			map.add(school);
			school.when(function() {
				view.goTo(school.fullExtent);
			});
		} else {
			map.remove(school);
		}

	});

	var hospitalToggle = document.getElementById("hospital");

	hospitalToggle.addEventListener("change", function() {
		if (hospitalToggle.checked) {
			map.add(hospital);
			hospital.when(function() {
				view.goTo(hospital.fullExtent);
			});
		} else {
			map.remove(hospital);
		}

	});

	var swToggle = document.getElementById("sw");

	swToggle.addEventListener("change", function() {
		if (swToggle.checked) {
			// window.location.href='3d.html'
			window.open("3d.html");
			
		} 
	});

	//显示当前坐标点的经纬度以及地图中心的坐标
	var coordsWidget = document.getElementById("position");

	//显示坐标
	function showCoordinates(pt) {
		var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) + " | Scale:" + Math.round(view.scale *
			1) / 1 + " | Zoom:" + view.zoom.toFixed(0)
		coordsWidget.innerText = coords;
	}

	//获取屏幕中心点，当视图发生改变时更新坐标
	view.watch(["stationary"], function() {
		showCoordinates(view.center);
	});

	//鼠标点击移动时间，传入鼠标点坐标已显示坐标
	view.on(["pointer-down", "pointer-move"], function(evt) {
		showCoordinates(view.toMap({
			x: evt.x,
			y: evt.y
		}));
	});

	var policetext = dom.byId("value-police");
	var hospitaltext = dom.byId("value-hospital");
	var parktext = dom.byId("value-park");
	var schooltext = dom.byId("value-school");

	let highlightHandle;
	var setdistance = dom.byId("distance");
	view.when()
		.then(function() {
			on(setdistance, "input", function() {
				dom.byId("distance-value").innerText = setdistance.value;
				dom.byId("distance-value2").innerText = setdistance.value;

				let pointerMoveHandler;
				view.whenLayerView(feallayer).then(function(layerView) {

					watchUtils.whenFalseOnce(layerView, "updating", function(val) {

						pointerMoveHandler = view.on("pointer-move",
							function(event) {

								var qr = feallayer.createQuery();
								qr.geometry = view.toMap(event);
								qr.distance = setdistance.value;
								qr.units = "kilometers";
								feallayer.queryFeatures(qr).then(function(result) {
									if (highlightHandle) {
										highlightHandle.remove();
									}
									highlightHandle = layerView.highlight(result.features);
								});

								querybeauty(layerView, event);

							});
					});

				});
			});

		});
	//查询函数
	function querybeauty(layerView, event) {
		//设置不同类型的查询实例
		var qrpolice = layerView.layer.createQuery();
		var qrhospital = layerView.layer.createQuery();
		var qrpark = layerView.layer.createQuery();
		var qrschool = layerView.layer.createQuery();

		//根据设置改变查询半径
		qrpolice.distance = setdistance.value;
		qrhospital.distance = setdistance.value;
		qrpark.distance = setdistance.value;
		qrschool.distance = setdistance.value;

		//进行每种查询

		//查询gas
		qrpolice.where = "type = 'police'";
		qrpolice.geometry = view.toMap(event); // converts the screen point to a map poin
		qrpolice.units = "kilometers";
		var police = feallayer.queryFeatures(qrpolice)
			.then(function(response) {
				var stats1 = response.features.length;
				policetext.innerText = stats1;
				return stats1;
			});

		//查询hospital
		qrhospital.where = "type = 'hospital'";
		qrhospital.geometry = view.toMap(event); // converts the screen point to a map poin
		qrhospital.units = "kilometers";
		var hospital = feallayer.queryFeatures(qrhospital)
			.then(function(response) {
				var stats2 = response.features.length;
				hospitaltext.innerText = stats2;
				return stats2;
			});

		//查询park
		qrpark.where = "type = 'park'";
		qrpark.geometry = view.toMap(event); // converts the screen point to a map poin
		qrpark.units = "kilometers";
		var park = feallayer.queryFeatures(qrpark)
			.then(function(response) {
				var stats3 = response.features.length;
				parktext.innerText = stats3;
				return stats3;
			});

		//查询school
		qrschool.where = "type = 'school'";
		qrschool.geometry = view.toMap(event);
		qrschool.units = "kilometers";
		var school = feallayer.queryFeatures(qrschool)
			.then(function(response) {
				var stats4 = response.features.length;
				schooltext.innerText = stats4;
				return stats4;
			});

		//		layerView.queryObjectIds(qr)
		//			.then(function(ids) {
		//				if(highlightHandle) {
		//					highlightHandle.remove();
		//					highlightHandle = null;
		//				}
		//				highlightHandle = layerView.highlight(ids);
		//			});

		return promiseUtils.eachAlways([police, hospital, park, school]);

	}

});
