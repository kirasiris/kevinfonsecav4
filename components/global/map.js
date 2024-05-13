"use client";
import Script from "next/script";

const Map = ({ object = {} }) => {
	return (
		<>
			<Script
				src="https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.js"
				strategy="lazyOnload"
				onLoad={() => {
					mapboxgl.accessToken =
						"pk.eyJ1Ijoia2lyYXNpcmlzIiwiYSI6ImNsMW5zd3huMTB3cGMzZXF1MjBtNDNyam8ifQ.Y9omxfTV8-WjjHhDI6ZHbQ";
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
				}}
			/>
			<div id="mapbox" style={{ height: "350px" }} />
		</>
	);
};

export default Map;
