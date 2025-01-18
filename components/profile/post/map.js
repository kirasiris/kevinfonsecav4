"use client";
import Script from "next/script";

const Map = ({ object = {} }) => {
	return (
		<>
			<Script
				src="https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.js"
				strategy="lazyOnload"
				onLoad={() => {
					mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
					const map = new mapboxgl.Map({
						container: `mapbox-${object?._id}`,
						style: "mapbox://styles/mapbox/standard",
						center: object?.location?.coordinates,
						zoom: 9,
						dragPan: false,
					}).addControl(
						new mapboxgl.AttributionControl({
							customAttribution:
								"Map design by <a href='https://kevinurielfonseca.me/' target='_blank'>Kevin Uriel Fonseca</a>",
						})
					);
					// Disable map zoom when using scroll
					// map.scrollZoom.disable();
					// Fullscreen
					// map.addControl(new mapboxgl.FullscreenControl());
					// Add zoom and rotation controls to the map.
					// map.addControl(new mapboxgl.NavigationControl());
					// Marker
					new mapboxgl.Marker({
						color: "#ff0000",
						draggable: false,
					})
						.setLngLat(object?.location?.coordinates)
						.setPopup(
							new mapboxgl.Popup().setHTML(
								`${object?.location?.formattedAddress}`
							)
						) // add popup
						.addTo(map);
				}}
			/>
			<div id={`mapbox-${object?._id}`} style={{ height: "350px" }} />
		</>
	);
};

export default Map;
