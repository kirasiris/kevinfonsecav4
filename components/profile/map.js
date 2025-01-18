"use client";
import Script from "next/script";

const Map = ({ objects = [] }) => {
	return (
		<>
			<Script
				src="https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.js"
				strategy="lazyOnload"
				onLoad={() => {
					// Token
					mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
					if (!mapboxgl.supported()) {
						const map = document.getElementById("mapbox");
						map.style.height = "350px";
						map.style.backgroundColor = "#f3f3f3";
						const notsupported = document.createElement("b");
						notsupported.appendChild(
							document.createTextNode("Mapbox not supported on this browser")
						);
						notsupported.style.alignItems = "center";
						notsupported.style.display = "flex";
						notsupported.style.justifyContent = "center";
						notsupported.style.height = "100%";
						map.appendChild(notsupported);
					} else {
						// RTL text plugin
						mapboxgl.setRTLTextPlugin(
							"https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
							null,
							true // Lazy load the plugin
						);

						const map = new mapboxgl.Map({
							container: `mapbox`,
							style: "mapbox://styles/mapbox/standard",
							projection: "globe", // Display the map as a globe, since satellite-v9 defaults to Mercator
							center: objects.data[0].location.coordinates,
							zoom: 2,
							dragPan: true,
						}).addControl(
							new mapboxgl.AttributionControl({
								customAttribution:
									"Map design by <a href='https://kevinurielfonseca.me/' target='_blank'>Kevin Uriel Fonseca</a>",
							})
						);
						// Disable map zoom when using scroll
						map.scrollZoom.disable();
						// Fullscreen
						map.addControl(new mapboxgl.FullscreenControl());
						// Add zoom and rotation controls to the map.
						map.addControl(new mapboxgl.NavigationControl());
						// Layer switch
						// const layerSelector = document.getElementById("map-style-selector");
						// layerSelector.addEventListener("change", function () {
						// 	const selectedStyle = layerSelector.value;
						// 	map.setStyle("mapbox://styles/mapbox/" + selectedStyle);
						// });
						// Add markers

						for (const marker of objects.data) {
							// Markers
							new mapboxgl.Marker({
								color: "#ff0000",
								draggable: false,
							})
								.setLngLat(marker.location.coordinates)
								.setPopup(
									new mapboxgl.Popup().setHTML(marker.location.formattedAddress)
								) // add popup
								.addTo(map);
						}

						// At low zooms, complete a revolution every two minutes.
						const secondsPerRevolution = 120;
						// Above zoom level 5, do not rotate.
						const maxSpinZoom = 5;
						// Rotate at intermediate speeds between zoom levels 3 and 5.
						const slowSpinZoom = 3;

						let userInteracting = false;
						let spinEnabled = true;

						function spinGlobe() {
							const zoom = map.getZoom();
							if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
								let distancePerSecond = 360 / secondsPerRevolution;
								if (zoom > slowSpinZoom) {
									// Slow spinning at higher zooms
									const zoomDif =
										(maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
									distancePerSecond *= zoomDif;
								}
								const center = map.getCenter();
								center.lng -= distancePerSecond;
								// Smoothly animate the map over one second.
								// When this animation is complete, it calls a 'moveend' event.
								map.easeTo({ center, duration: 1000, easing: (n) => n });
							}
						}

						// Pause spinning on interaction
						map.on("mousedown", () => {
							userInteracting = true;
						});

						// Restart spinning the globe when interaction is complete
						map.on("mouseup", () => {
							userInteracting = false;
							spinGlobe();
						});

						// These events account for cases where the mouse has moved
						// off the map, so 'mouseup' will not be fired.
						map.on("dragend", () => {
							userInteracting = false;
							spinGlobe();
						});
						map.on("pitchend", () => {
							userInteracting = false;
							spinGlobe();
						});
						map.on("rotateend", () => {
							userInteracting = false;
							spinGlobe();
						});

						// When animation is complete, start spinning if there is no ongoing interaction
						map.on("moveend", () => {
							spinGlobe();
						});

						spinGlobe();
					}
				}}
			/>
			<div id="mapbox" style={{ width: "100%", height: "50vh" }} />
		</>
	);
};

export default Map;
