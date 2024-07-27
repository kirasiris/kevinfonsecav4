"use client";
import { CgStyle } from "react-icons/cg";
import Script from "next/script";

const Map = ({ object = {} }) => {
	return (
		<>
			<div className="input-group mb-3">
				<span className="input-group-text">
					<CgStyle />
				</span>
				{/* See a list of Mapbox-hosted public styles at https://docs.mapbox.com/api/maps/styles/#mapbox-styles */}
				<div className="form-floating">
					<select id="map-style-selector" className="form-control">
						<option value="satellite-streets-v12">Satellite Streets</option>
						<option value="light-v11">Light</option>
						<option value="dark-v11">Dark</option>
						<option value="streets-v12" defaultChecked>
							Streets
						</option>
						<option value="outdoors-v12">Outdoors</option>
					</select>
					<label htmlFor="map-style-selector">Map Style</label>
				</div>
			</div>
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
							center: object.location.coordinates,
							zoom: 9,
							dragPan: false,
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
						const layerSelector = document.getElementById("map-style-selector");
						layerSelector.addEventListener("change", function () {
							const selectedStyle = layerSelector.value;
							map.setStyle("mapbox://styles/mapbox/" + selectedStyle);
						});

						// Marker
						new mapboxgl.Marker({
							color: "#ff0000",
							draggable: false,
						})
							.setLngLat(object.location.coordinates)
							.setPopup(
								new mapboxgl.Popup().setHTML(
									`${object.location.formattedAddress}`
								)
							) // add popup
							.addTo(map);
					}
				}}
			/>
			<div id="mapbox" style={{ height: "350px" }} />
		</>
	);
};

export default Map;
