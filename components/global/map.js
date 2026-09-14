"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

const RTL_TEXT_PLUGIN =
	"https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MAP_STYLES = [
	{ value: "satellite-streets-v12", label: "Satellite Streets" },
	{ value: "light-v11", label: "Light" },
	{ value: "dark-v11", label: "Dark" },
	{ value: "streets-v12", label: "Streets" },
	{ value: "outdoors-v12", label: "Outdoors" },
];

const FALLBACK_STYLE = {
	version: 8,
	sources: {
		osm: {
			type: "raster",
			tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
			tileSize: 256,
			attribution: "&copy; OpenStreetMap contributors",
		},
	},
	layers: [{ id: "osm", type: "raster", source: "osm" }],
};

const resolveStyle = (styleKey) =>
	MAPBOX_TOKEN ? `mapbox://styles/mapbox/${styleKey}` : FALLBACK_STYLE;

const Map = ({ object = {}, height = 350, id = "mapbox" }) => {
	const containerRef = useRef(null);
	const mapRef = useRef(null);
	const sdkRef = useRef(null);
	const markerRef = useRef(null);

	const [mapReady, setMapReady] = useState(false);
	const [mapStyle, setMapStyle] = useState("satellite-streets-v12");
	const [unsupported, setUnsupported] = useState(false);

	const appliedStyleRef = useRef(mapStyle);

	const rawCoordinates = object?.location?.coordinates;

	const [lng, lat] = Array.isArray(rawCoordinates)
		? rawCoordinates.map(Number)
		: [];
	const formattedAddress = object?.location?.formattedAddress ?? "";
	const hasCoordinates = Number.isFinite(lng) && Number.isFinite(lat);

	useEffect(() => {
		if (!hasCoordinates) return;

		let cancelled = false;

		(async () => {
			const mapboxgl = (await import("mapbox-gl")).default;

			if (cancelled || !containerRef.current) return;

			sdkRef.current = mapboxgl;
			mapboxgl.accessToken = MAPBOX_TOKEN || "no-token";

			if (typeof mapboxgl.supported === "function" && !mapboxgl.supported()) {
				setUnsupported(true);
				return;
			}

			if (mapboxgl.getRTLTextPluginStatus() === "unavailable") {
				mapboxgl.setRTLTextPlugin(RTL_TEXT_PLUGIN, null, true);
			}

			const map = new mapboxgl.Map({
				container: containerRef.current,
				style: resolveStyle(mapStyle),
				center: [lng, lat],
				zoom: 13,
				dragPan: false,
				attributionControl: false,
			});

			mapRef.current = map;
			appliedStyleRef.current = mapStyle;

			map.scrollZoom.disable();
			map.addControl(
				new mapboxgl.AttributionControl({
					customAttribution:
						"Map design by <a href='https://kevinurielfonseca.me/' target='_blank' rel='noreferrer'>Kevin Uriel Fonseca</a>",
				}),
			);
			map.addControl(new mapboxgl.FullscreenControl());
			map.addControl(new mapboxgl.NavigationControl());

			map.on("error", (event) =>
				console.error("[Map]", event?.error?.message ?? event),
			);

			map.on("load", () => map.resize());

			setMapReady(true);
		})();

		return () => {
			cancelled = true;
			mapRef.current?.remove();
			mapRef.current = null;
			setMapReady(false);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasCoordinates]);

	useEffect(() => {
		const map = mapRef.current;
		const mapboxgl = sdkRef.current;
		if (!mapReady || !map || !mapboxgl) return;

		const marker = new mapboxgl.Marker({ color: "#ff0000", draggable: false })
			.setLngLat([lng, lat])
			.addTo(map);
		if (formattedAddress) {
			marker.setPopup(
				new mapboxgl.Popup({ offset: 24 }).setHTML(formattedAddress),
			);
		}
		markerRef.current = marker;
		map.setCenter([lng, lat]);

		return () => {
			marker.remove();
			markerRef.current = null;
		};
	}, [mapReady, lng, lat, formattedAddress]);

	useEffect(() => {
		const map = mapRef.current;

		if (!mapReady || !map || !MAPBOX_TOKEN) return;
		if (mapStyle === appliedStyleRef.current) return;

		let cancelled = false;
		const applyStyle = () => {
			if (cancelled) return;
			appliedStyleRef.current = mapStyle;

			map.setStyle(resolveStyle(mapStyle), { diff: false });
		};

		if (map.isStyleLoaded()) applyStyle();
		else map.once("style.load", applyStyle);

		return () => {
			cancelled = true;
			map.off("style.load", applyStyle);
		};
	}, [mapReady, mapStyle]);

	let message = "";
	if (!hasCoordinates) message = "No coordinates available for this address";
	else if (unsupported) message = "Mapbox not supported on this browser";

	return (
		<>
			<div className="input-group mb-3">
				<span className="input-group-text">
					<i className="fa-solid fa-caret-down" aria-hidden />
				</span>
				<div className="form-floating">
					<select
						id={`${id}-style-selector`}
						className="form-select"
						value={mapStyle}
						onChange={(event) => setMapStyle(event.target.value)}
					>
						{MAP_STYLES.map((style) => (
							<option key={style.value} value={style.value}>
								{style.label}
							</option>
						))}
					</select>
					<label htmlFor={`${id}-style-selector`}>Map Style</label>
				</div>
			</div>

			<div
				className="position-relative overflow-hidden rounded"
				style={{ height }}
			>
				<div
					id={id}
					ref={containerRef}
					className="w-100 h-100"
					role="region"
					aria-label={
						formattedAddress ? `Map of ${formattedAddress}` : "Location map"
					}
				/>
				{message && (
					<div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-body-secondary text-body-secondary text-center px-3">
						<b>{message}</b>
					</div>
				)}
			</div>
		</>
	);
};

export default Map;
