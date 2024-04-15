"use client";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/profile/loading";
import Carousel from "react-bootstrap/Carousel";
import Badge from "react-bootstrap/Badge";
import ExportModal from "@/components/global/exportmodal";
import { DropdownButton, Button } from "react-bootstrap";
import Waveform from "@/layout/waveform";
import Script from "next/script";

const Map = ({ object = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
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
			<article className={`${object?._id} mb-3`}>
				<div className="card">
					<div className="card-header">AUTHOR</div>
					<div className={`card-body p-0`}>
						<div id="mapbox" style={{ height: "350px" }} />
					</div>
					<div className="card-footer">
						<div className="float-end">
							<ExportModal object={object} />
						</div>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Map;
