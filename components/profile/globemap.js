"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";

const RTL_TEXT_PLUGIN =
	"https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const SOURCE_ID = "locations";
const CLUSTER_LAYER = "clusters";
const CLUSTER_COUNT_LAYER = "cluster-count";
const POINT_LAYER = "unclustered-point";

const SECONDS_PER_REVOLUTION = 120;
const MAX_SPIN_ZOOM = 5;
const SLOW_SPIN_ZOOM = 3;

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

const resolveStyle = () =>
	MAPBOX_TOKEN ? "mapbox://styles/mapbox/standard" : FALLBACK_STYLE;

const toFeatureCollection = (objects) => {
	const items = Array.isArray(objects) ? objects : (objects?.data ?? []);
	const features = [];

	for (const item of items) {
		const raw = item?.location?.coordinates;
		if (!Array.isArray(raw) || raw.length < 2) continue;

		const [lng, lat] = raw.map(Number);
		if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
		if (Math.abs(lat) > 90 || Math.abs(lng) > 180) continue;

		features.push({
			type: "Feature",
			geometry: { type: "Point", coordinates: [lng, lat] },
			properties: {
				title: item?.location?.formattedAddress ?? item?.name ?? "",
			},
		});
	}

	return { type: "FeatureCollection", features };
};

const GlobeMap = ({
	objects,
	height = "50vh",
	id = "globe",
	spin = true,
	clusterRadius = 50,
}) => {
	const containerRef = useRef(null);
	const mapRef = useRef(null);
	const sdkRef = useRef(null);
	const popupRef = useRef(null);

	const [mapReady, setMapReady] = useState(false);
	const [unsupported, setUnsupported] = useState(false);

	const featureCollection = useMemo(
		() => toFeatureCollection(objects),
		[objects],
	);
	const pointCount = featureCollection.features.length;

	const dataRef = useRef(featureCollection);
	const didCenterRef = useRef(false);

	const spinRef = useRef(spin);
	const interactingRef = useRef(false);
	const popupOpenRef = useRef(false);
	useEffect(() => {
		spinRef.current = spin;
	}, [spin]);

	useEffect(() => {
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

			const first = dataRef.current.features[0];
			if (first) didCenterRef.current = true;

			const map = new mapboxgl.Map({
				container: containerRef.current,
				style: resolveStyle(),
				projection: "globe",
				center: first ? first.geometry.coordinates : [0, 20],
				zoom: 2,
				dragPan: true,
				scrollZoom: true,
				attributionControl: false,
			});
			mapRef.current = map;

			map.addControl(
				new mapboxgl.AttributionControl({
					customAttribution:
						"Map design by <a href='https://kevinurielfonseca.me/' target='_blank' rel='noreferrer'>Kevin Uriel Fonseca</a>",
				}),
			);
			map.addControl(new mapboxgl.FullscreenControl());
			map.addControl(new mapboxgl.NavigationControl());

			map.on("error", (event) =>
				console.error("[GlobeMap]", event?.error?.message ?? event),
			);

			const addDataLayers = () => {
				if (map.getSource(SOURCE_ID)) return;

				map.addSource(SOURCE_ID, {
					type: "geojson",
					data: dataRef.current,
					cluster: true,
					clusterMaxZoom: 14,
					clusterRadius,
				});

				map.addLayer({
					id: CLUSTER_LAYER,
					type: "circle",
					source: SOURCE_ID,
					filter: ["has", "point_count"],
					slot: "top",
					paint: {
						"circle-color": "#ff0000",
						"circle-opacity": 0.85,
						"circle-radius": [
							"step",
							["get", "point_count"],
							16,
							10,
							22,
							50,
							30,
						],
						"circle-stroke-width": 2,
						"circle-stroke-color": "#ffffff",
					},
				});

				if (MAPBOX_TOKEN) {
					map.addLayer({
						id: CLUSTER_COUNT_LAYER,
						type: "symbol",
						source: SOURCE_ID,
						filter: ["has", "point_count"],
						slot: "top",
						layout: {
							"text-field": ["get", "point_count_abbreviated"],
							"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
							"text-size": 12,
							"text-allow-overlap": true,
						},
						paint: { "text-color": "#ffffff" },
					});
				}

				map.addLayer({
					id: POINT_LAYER,
					type: "circle",
					source: SOURCE_ID,
					filter: ["!", ["has", "point_count"]],
					slot: "top",
					paint: {
						"circle-color": "#ff0000",
						"circle-radius": 7,
						"circle-stroke-width": 2,
						"circle-stroke-color": "#ffffff",
					},
				});
			};

			map.on("style.load", () => {
				addDataLayers();
				setMapReady(true);
			});

			map.on("load", () => map.resize());

			map.on("click", CLUSTER_LAYER, (event) => {
				const feature = event.features?.[0];
				if (!feature) return;
				map
					.getSource(SOURCE_ID)
					.getClusterExpansionZoom(
						feature.properties.cluster_id,
						(error, zoom) => {
							if (error) return;
							map.easeTo({ center: feature.geometry.coordinates, zoom });
						},
					);
			});

			map.on("click", POINT_LAYER, (event) => {
				const feature = event.features?.[0];
				const title = feature?.properties?.title;
				if (!title) return;

				const coordinates = feature.geometry.coordinates.slice();

				while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				popupRef.current?.remove();
				popupOpenRef.current = true;
				map.stop();
				popupRef.current = new mapboxgl.Popup({ offset: 12 })
					.setLngLat(coordinates)
					.setText(title)
					.addTo(map);
				popupRef.current.on("close", () => {
					popupOpenRef.current = false;
					spinGlobe();
				});
			});

			for (const layer of [CLUSTER_LAYER, POINT_LAYER]) {
				map.on("mouseenter", layer, () => {
					map.getCanvas().style.cursor = "pointer";
				});
				map.on("mouseleave", layer, () => {
					map.getCanvas().style.cursor = "";
				});
			}

			const reducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)",
			);

			const SPIN_EVENT = { spin: true };
			let externalMove = false;
			let spinStepActive = false;

			const canSpin = () => {
				if (cancelled || !mapRef.current) return false;
				if (!spinRef.current || reducedMotion.matches) return false;
				if (interactingRef.current || popupOpenRef.current) return false;
				if (externalMove || spinStepActive) return false;
				if (map.isMoving() || map.isZooming() || map.isRotating()) return false;
				return map.getZoom() < MAX_SPIN_ZOOM;
			};

			const spinGlobe = () => {
				if (!canSpin()) return;

				const zoom = map.getZoom();
				let degreesPerSecond = 360 / SECONDS_PER_REVOLUTION;
				if (zoom > SLOW_SPIN_ZOOM) {
					degreesPerSecond *=
						(MAX_SPIN_ZOOM - zoom) / (MAX_SPIN_ZOOM - SLOW_SPIN_ZOOM);
				}

				const center = map.getCenter();
				center.lng -= degreesPerSecond;
				map.easeTo({ center, duration: 1000, easing: (n) => n }, SPIN_EVENT);

				spinStepActive = true;
			};

			map.on("mousedown", () => {
				interactingRef.current = true;
			});
			map.on("touchstart", () => {
				interactingRef.current = true;
			});

			for (const event of [
				"mouseup",
				"touchend",
				"dragend",
				"pitchend",
				"rotateend",
			]) {
				map.on(event, () => {
					interactingRef.current = false;
					spinGlobe();
				});
			}

			map.on("movestart", (event) => {
				if (event.spin) return;
				externalMove = true;
			});

			map.on("moveend", (event) => {
				if (event.spin) spinStepActive = false;
				else externalMove = false;

				queueMicrotask(spinGlobe);
			});

			map.on("idle", spinGlobe);

			spinGlobe();
		})();

		return () => {
			cancelled = true;
			popupRef.current?.remove();
			popupRef.current = null;
			mapRef.current?.remove();
			mapRef.current = null;
			setMapReady(false);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		dataRef.current = featureCollection;

		const map = mapRef.current;
		if (!mapReady || !map) return;

		map.getSource(SOURCE_ID)?.setData(featureCollection);

		const first = featureCollection.features[0];
		if (!didCenterRef.current && first) {
			didCenterRef.current = true;
			map.jumpTo({ center: first.geometry.coordinates });
		}
	}, [mapReady, featureCollection]);

	let message = "";
	if (unsupported) message = "Mapbox not supported on this browser";
	else if (mapReady && pointCount === 0) message = "No locations to display";

	return (
		<div
			className="position-relative overflow-hidden rounded"
			style={{ height }}
		>
			<div
				id={id}
				ref={containerRef}
				className="w-100 h-100"
				role="region"
				aria-label={`Globe showing ${pointCount} location${pointCount === 1 ? "" : "s"}`}
			/>
			{message && (
				<div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-body-secondary text-body-secondary text-center px-3">
					<b>{message}</b>
				</div>
			)}
			<ul className="visually-hidden">
				{featureCollection.features.map((feature) => (
					<li
						key={`${feature.geometry.coordinates.join(",")}-${feature.properties.title}`}
					>
						{feature.properties.title ||
							feature.geometry.coordinates.join(", ")}
					</li>
				))}
			</ul>
		</div>
	);
};

export default GlobeMap;
