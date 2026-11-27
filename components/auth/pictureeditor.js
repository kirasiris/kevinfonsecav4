"use client";
import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;
const ROTATIONS = [0, 90, 180, 270];

const EDIT_LIMITS = {
	x: [0, 100, 50],
	y: [0, 100, 50],
	zoom: [MIN_ZOOM, MAX_ZOOM, 1],
	brightness: [50, 150, 100],
	contrast: [50, 150, 100],
	saturation: [0, 200, 100],
	grayscale: [0, 100, 0],
	sepia: [0, 100, 0],
};

const ADJUSTMENTS = [
	{ key: "brightness", label: "Brightness", css: "brightness", neutral: 100 },
	{ key: "contrast", label: "Contrast", css: "contrast", neutral: 100 },
	{ key: "saturation", label: "Saturation", css: "saturate", neutral: 100 },
	{ key: "grayscale", label: "Grayscale", css: "grayscale", neutral: 0 },
	{ key: "sepia", label: "Sepia", css: "sepia", neutral: 0 },
];

const PICTURE_FILTERS = [
	{
		name: "Original",
		brightness: 100,
		contrast: 100,
		saturation: 100,
		grayscale: 0,
		sepia: 0,
	},
	{
		name: "Vivid",
		brightness: 105,
		contrast: 115,
		saturation: 140,
		grayscale: 0,
		sepia: 0,
	},
	{
		name: "Warm",
		brightness: 105,
		contrast: 100,
		saturation: 115,
		grayscale: 0,
		sepia: 30,
	},
	{
		name: "Fade",
		brightness: 110,
		contrast: 85,
		saturation: 75,
		grayscale: 0,
		sepia: 0,
	},
	{
		name: "Mono",
		brightness: 100,
		contrast: 110,
		saturation: 100,
		grayscale: 100,
		sepia: 0,
	},
	{
		name: "Noir",
		brightness: 95,
		contrast: 140,
		saturation: 100,
		grayscale: 100,
		sepia: 0,
	},
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const normalizePictureEdit = (edit = {}) => {
	const normalized = {};
	for (const [key, [min, max, fallback]] of Object.entries(EDIT_LIMITS)) {
		const value = edit?.[key];
		normalized[key] = Number.isFinite(value)
			? Math.round(clamp(value, min, max) * 100) / 100
			: fallback;
	}
	normalized.rotate = ROTATIONS.includes(edit?.rotate) ? edit.rotate : 0;
	return normalized;
};

export const isSamePictureEdit = (a, b) => {
	const left = normalizePictureEdit(a);
	const right = normalizePictureEdit(b);
	return Object.keys(left).every((key) => left[key] === right[key]);
};

const filterCss = (edit) => {
	const parts = ADJUSTMENTS.filter(
		({ key, neutral }) => edit[key] !== neutral,
	).map(({ key, css }) => `${css}(${edit[key] / 100})`);
	return parts.length ? parts.join(" ") : "none";
};

const layoutPicture = (frame, natural, edit) => {
	const turned = edit.rotate % 180 !== 0;
	const boxNaturalWidth = turned ? natural.height : natural.width;
	const boxNaturalHeight = turned ? natural.width : natural.height;
	const scale =
		Math.max(frame.width / boxNaturalWidth, frame.height / boxNaturalHeight) *
		edit.zoom;
	const boxWidth = boxNaturalWidth * scale;
	const boxHeight = boxNaturalHeight * scale;
	const overflowX = Math.max(0, boxWidth - frame.width);
	const overflowY = Math.max(0, boxHeight - frame.height);
	const boxLeft = (-edit.x / 100) * overflowX;
	const boxTop = (-edit.y / 100) * overflowY;
	return {
		scale,
		boxLeft,
		boxTop,
		overflowX,
		overflowY,
		drawWidth: natural.width * scale,
		drawHeight: natural.height * scale,
		centerX: boxLeft + boxWidth / 2,
		centerY: boxTop + boxHeight / 2,
	};
};

const positionFor = (offset, overflow, current) =>
	overflow > 0.5 ? clamp((-offset / overflow) * 100, 0, 100) : current;

const panPicture = (edit, dx, dy, frame, natural) => {
	const layout = layoutPicture(frame, natural, edit);
	return {
		...edit,
		x: positionFor(layout.boxLeft + dx, layout.overflowX, edit.x),
		y: positionFor(layout.boxTop + dy, layout.overflowY, edit.y),
	};
};

const zoomPicture = (edit, zoom, anchor, frame, natural) => {
	const next = { ...edit, zoom: clamp(zoom, MIN_ZOOM, MAX_ZOOM) };
	if (!frame || !natural) return next;
	const before = layoutPicture(frame, natural, edit);
	const after = layoutPicture(frame, natural, next);
	const ratio = after.scale / before.scale;
	return {
		...next,
		x: positionFor(
			anchor.x - (anchor.x - before.boxLeft) * ratio,
			after.overflowX,
			edit.x,
		),
		y: positionFor(
			anchor.y - (anchor.y - before.boxTop) * ratio,
			after.overflowY,
			edit.y,
		),
	};
};

const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

const gestureFrom = (points, base) => {
	if (points.length >= 2) {
		const [a, b] = points;
		return {
			base,
			start: midpoint(a, b),
			distance: Math.hypot(b.x - a.x, b.y - a.y) || 1,
		};
	}
	return points.length ? { base, start: points[0], distance: 0 } : null;
};

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_ORIGINAL_SIDE = 2560;
const MAX_ORIGINAL_BYTES = 3 * 1024 * 1024;
const KEEP_AS_UPLOADED = ["image/gif", "image/svg+xml"];
const WEB_FORMATS = ["image/jpeg", "image/png", "image/webp"];
const UNREADABLE =
	"This browser can't open that image. Please try a JPG, PNG, WebP or GIF.";

const loadImage = (url) =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.decoding = "async";
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error(UNREADABLE));
		image.src = url;
	});

export const readPictureFile = async (
	file,
	{ minWidth = 1, minHeight = 1 } = {},
) => {
	if (file.type && !file.type.startsWith("image/")) {
		throw new Error("Please choose an image file.");
	}
	if (file.size > MAX_FILE_BYTES) {
		throw new Error(
			`This image is ${(file.size / 1048576).toFixed(1)} MB. Please choose one under 25 MB.`,
		);
	}
	const url = URL.createObjectURL(file);
	try {
		const { naturalWidth: width, naturalHeight: height } = await loadImage(url);
		if (
			Math.max(width, height) < Math.max(minWidth, minHeight) ||
			Math.min(width, height) < Math.min(minWidth, minHeight)
		) {
			throw new Error(
				`This image is ${width} × ${height} px. Please choose one of at least ${minWidth} × ${minHeight} px.`,
			);
		}
		return { url, width, height };
	} catch (err) {
		URL.revokeObjectURL(url);
		throw err;
	}
};

const fetchImageBlob = async (url) => {
	try {
		const res = await fetch(url, { mode: "cors", credentials: "omit" });
		return res.ok ? await res.blob() : null;
	} catch {
		return null;
	}
};

export const loadPictureImage = async (src) => {
	if (/^(blob|data):/.test(src)) {
		return { image: await loadImage(src), release: () => {} };
	}
	const blob =
		(await fetchImageBlob(src)) ||
		(await fetchImageBlob(
			`/_next/image?url=${encodeURIComponent(src)}&w=3840&q=75`,
		));
	if (!blob) {
		throw new Error(
			"Your current picture could not be loaded for editing. Please choose the file again.",
		);
	}
	const url = URL.createObjectURL(blob);
	try {
		return {
			image: await loadImage(url),
			release: () => URL.revokeObjectURL(url),
		};
	} catch (err) {
		URL.revokeObjectURL(url);
		throw err;
	}
};

const createCanvas = (width, height) => {
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(width));
	canvas.height = Math.max(1, Math.round(height));
	return canvas;
};

const context2d = (canvas) => {
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	return ctx;
};

const releaseCanvas = (canvas) => {
	canvas.width = 0;
	canvas.height = 0;
};

const reduceForScale = (image, scale) => {
	let source = image;
	let width = image.naturalWidth;
	let height = image.naturalHeight;
	while (scale < 0.5 && width > 1 && height > 1) {
		width = Math.round(width / 2);
		height = Math.round(height / 2);
		scale *= 2;
		const canvas = createCanvas(width, height);
		context2d(canvas).drawImage(source, 0, 0, canvas.width, canvas.height);
		if (source !== image) releaseCanvas(source);
		source = canvas;
	}
	return source;
};

let canvasFilterSupport;

const supportsCanvasFilter = () => {
	if (canvasFilterSupport === undefined) {
		const ctx = createCanvas(1, 1).getContext("2d");
		ctx.filter = "brightness(0)";
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, 1, 1);
		canvasFilterSupport = ctx.getImageData(0, 0, 1, 1).data[0] === 0;
	}
	return canvasFilterSupport;
};

const saturateMatrix = (s) => [
	0.213 + 0.787 * s,
	0.715 - 0.715 * s,
	0.072 - 0.072 * s,
	0.213 - 0.213 * s,
	0.715 + 0.285 * s,
	0.072 - 0.072 * s,
	0.213 - 0.213 * s,
	0.715 - 0.715 * s,
	0.072 + 0.928 * s,
];

const grayscaleMatrix = (amount) => {
	const a = 1 - amount;
	return [
		0.2126 + 0.7874 * a,
		0.7152 - 0.7152 * a,
		0.0722 - 0.0722 * a,
		0.2126 - 0.2126 * a,
		0.7152 + 0.2848 * a,
		0.0722 - 0.0722 * a,
		0.2126 - 0.2126 * a,
		0.7152 - 0.7152 * a,
		0.0722 + 0.9278 * a,
	];
};

const sepiaMatrix = (amount) => {
	const a = 1 - amount;
	return [
		0.393 + 0.607 * a,
		0.769 - 0.769 * a,
		0.189 - 0.189 * a,
		0.349 - 0.349 * a,
		0.686 + 0.314 * a,
		0.168 - 0.168 * a,
		0.272 - 0.272 * a,
		0.534 - 0.534 * a,
		0.131 + 0.869 * a,
	];
};

const clampByte = (value) => (value < 0 ? 0 : value > 255 ? 255 : value);

const applyFilterPixels = (ctx, width, height, edit) => {
	const pixels = ctx.getImageData(0, 0, width, height);
	const { data } = pixels;
	const brightness = edit.brightness / 100;
	const contrast = edit.contrast / 100;
	const matrices = [
		edit.saturation !== 100 && saturateMatrix(edit.saturation / 100),
		edit.grayscale !== 0 && grayscaleMatrix(edit.grayscale / 100),
		edit.sepia !== 0 && sepiaMatrix(edit.sepia / 100),
	].filter(Boolean);
	for (let i = 0; i < data.length; i += 4) {
		let r = data[i];
		let g = data[i + 1];
		let b = data[i + 2];
		if (brightness !== 1) {
			r = clampByte(r * brightness);
			g = clampByte(g * brightness);
			b = clampByte(b * brightness);
		}
		if (contrast !== 1) {
			r = clampByte((r - 127.5) * contrast + 127.5);
			g = clampByte((g - 127.5) * contrast + 127.5);
			b = clampByte((b - 127.5) * contrast + 127.5);
		}
		for (const m of matrices) {
			const nextR = clampByte(m[0] * r + m[1] * g + m[2] * b);
			const nextG = clampByte(m[3] * r + m[4] * g + m[5] * b);
			const nextB = clampByte(m[6] * r + m[7] * g + m[8] * b);
			r = nextR;
			g = nextG;
			b = nextB;
		}
		data[i] = r;
		data[i + 1] = g;
		data[i + 2] = b;
	}
	ctx.putImageData(pixels, 0, 0);
};

const hasTransparency = (ctx, width, height) => {
	const { data } = ctx.getImageData(0, 0, width, height);
	for (let i = 3; i < data.length; i += 4) {
		if (data[i] < 250) return true;
	}
	return false;
};

const canvasBlob = (canvas, type, quality) =>
	new Promise((resolve) => canvas.toBlob(resolve, type, quality));

const encodeCanvas = async (canvas, ctx, transparent) => {
	if (transparent) {
		const webp = await canvasBlob(canvas, "image/webp", 0.9);
		if (webp?.type === "image/webp") return { blob: webp, extension: "webp" };
		const png = await canvasBlob(canvas, "image/png");
		if (png) return { blob: png, extension: "png" };
	} else {
		ctx.globalCompositeOperation = "destination-over";
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalCompositeOperation = "source-over";
		const jpeg = await canvasBlob(canvas, "image/jpeg", 0.9);
		if (jpeg) return { blob: jpeg, extension: "jpg" };
	}
	throw new Error(
		"This browser could not prepare the picture. Please try another image.",
	);
};

export const renderPicture = async (
	image,
	edit,
	{ width, height, name = "picture" },
) => {
	const settings = normalizePictureEdit(edit);
	const natural = { width: image.naturalWidth, height: image.naturalHeight };
	const shrink = Math.min(
		1,
		1 / layoutPicture({ width, height }, natural, settings).scale,
	);
	const frame = {
		width: Math.max(1, Math.round(width * shrink)),
		height: Math.max(1, Math.round(height * shrink)),
	};
	const layout = layoutPicture(frame, natural, settings);
	const source = reduceForScale(image, layout.scale);
	const canvas = createCanvas(frame.width, frame.height);
	const ctx = context2d(canvas);
	const filter = filterCss(settings);
	const useCanvasFilter = filter !== "none" && supportsCanvasFilter();
	try {
		if (useCanvasFilter) ctx.filter = filter;
		ctx.translate(layout.centerX, layout.centerY);
		ctx.rotate((settings.rotate * Math.PI) / 180);
		ctx.drawImage(
			source,
			-layout.drawWidth / 2,
			-layout.drawHeight / 2,
			layout.drawWidth,
			layout.drawHeight,
		);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.filter = "none";
		if (filter !== "none" && !useCanvasFilter) {
			applyFilterPixels(ctx, frame.width, frame.height, settings);
		}
		const { blob, extension } = await encodeCanvas(
			canvas,
			ctx,
			hasTransparency(ctx, frame.width, frame.height),
		);
		return {
			blob,
			filename: `${name}.${extension}`,
			width: frame.width,
			height: frame.height,
		};
	} finally {
		if (source !== image) releaseCanvas(source);
		releaseCanvas(canvas);
	}
};

export const preparePictureFile = async (file, image) => {
	const longSide = Math.max(image.naturalWidth, image.naturalHeight);
	if (
		KEEP_AS_UPLOADED.includes(file.type) ||
		(WEB_FORMATS.includes(file.type) &&
			longSide <= MAX_ORIGINAL_SIDE &&
			file.size <= MAX_ORIGINAL_BYTES)
	) {
		return { blob: file, filename: file.name };
	}
	const scale = Math.min(1, MAX_ORIGINAL_SIDE / longSide);
	const source = reduceForScale(image, scale);
	const canvas = createCanvas(
		image.naturalWidth * scale,
		image.naturalHeight * scale,
	);
	const ctx = context2d(canvas);
	try {
		ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
		const transparent =
			file.type !== "image/jpeg" &&
			hasTransparency(ctx, canvas.width, canvas.height);
		const { blob, extension } = await encodeCanvas(canvas, ctx, transparent);
		const baseName = file.name.replace(/\.[^.]+$/, "") || "picture";
		return { blob, filename: `${baseName}.${extension}` };
	} finally {
		if (source !== image) releaseCanvas(source);
		releaseCanvas(canvas);
	}
};

const THIRDS_GRID = {
	backgroundImage:
		"linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)",
	backgroundSize: "33.333% 33.333%",
	backgroundPosition: "-1px -1px",
};

const PictureEditor = ({
	src = "",
	alt = "",
	label = "Picture",
	shape = "rect",
	aspectRatio = 1,
	maxWidth,
	value,
	onChange,
	onStatusChange,
	disabled = false,
}) => {
	const id = useId();
	const frameRef = useRef(null);
	const latest = useRef(null);
	const pointers = useRef(new Map());
	const gesture = useRef(null);

	const [frame, setFrame] = useState(null);
	const [loaded, setLoaded] = useState({
		src: "",
		natural: null,
		failed: false,
	});
	const [isDragging, setIsDragging] = useState(false);
	const [hasInteracted, setHasInteracted] = useState(false);

	const edit = normalizePictureEdit(value);
	const natural = loaded.src === src ? loaded.natural : null;
	const status = !src
		? "empty"
		: loaded.src === src && loaded.failed
			? "error"
			: natural
				? "ready"
				: "loading";
	const interactive = status === "ready" && !disabled;
	const layout = natural && frame ? layoutPicture(frame, natural, edit) : null;
	const filter = filterCss(edit);
	const rotation = edit.rotate ? `rotate(${edit.rotate}deg)` : undefined;
	const activeFilter = PICTURE_FILTERS.find((preset) =>
		ADJUSTMENTS.every(({ key }) => preset[key] === edit[key]),
	);

	useLayoutEffect(() => {
		latest.current = { edit, frame, natural, interactive, onChange };
	});

	useEffect(() => {
		onStatusChange?.(status);
	}, [status, onStatusChange]);

	useEffect(() => {
		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			setFrame((current) =>
				current?.width === width && current?.height === height
					? current
					: { width, height },
			);
		});
		observer.observe(frameRef.current);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const node = frameRef.current;
		const handleWheel = (e) => {
			const state = latest.current;
			if (!(e.ctrlKey || e.metaKey) || !state?.interactive || !state.frame) {
				return;
			}
			e.preventDefault();
			const rect = node.getBoundingClientRect();
			const delta = clamp(
				e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY,
				-50,
				50,
			);
			setHasInteracted(true);
			state.onChange?.(
				zoomPicture(
					state.edit,
					state.edit.zoom * Math.exp(-delta / 100),
					{ x: e.clientX - rect.left, y: e.clientY - rect.top },
					state.frame,
					state.natural,
				),
			);
		};
		node.addEventListener("wheel", handleWheel, { passive: false });
		return () => node.removeEventListener("wheel", handleWheel);
	}, []);

	useEffect(() => {
		if (!isDragging) return;
		const handleMove = (e) => {
			if (!pointers.current.has(e.pointerId)) return;
			if (e.pointerType === "mouse" && e.buttons === 0) {
				handleUp(e);
				return;
			}
			pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
			const state = latest.current;
			const current = gesture.current;
			if (!current || !state?.interactive || !state.frame) return;
			const points = [...pointers.current.values()];
			if (points.length >= 2 && current.distance) {
				const [a, b] = points;
				const mid = midpoint(a, b);
				const rect = frameRef.current.getBoundingClientRect();
				const zoomed = zoomPicture(
					current.base,
					current.base.zoom *
						(Math.hypot(b.x - a.x, b.y - a.y) / current.distance),
					{ x: current.start.x - rect.left, y: current.start.y - rect.top },
					state.frame,
					state.natural,
				);
				state.onChange?.(
					panPicture(
						zoomed,
						mid.x - current.start.x,
						mid.y - current.start.y,
						state.frame,
						state.natural,
					),
				);
				return;
			}
			const [point] = points;
			state.onChange?.(
				panPicture(
					current.base,
					point.x - current.start.x,
					point.y - current.start.y,
					state.frame,
					state.natural,
				),
			);
		};
		const handleUp = (e) => {
			if (!pointers.current.delete(e.pointerId)) return;
			gesture.current = gestureFrom(
				[...pointers.current.values()],
				latest.current.edit,
			);
			if (!pointers.current.size) setIsDragging(false);
		};
		window.addEventListener("pointermove", handleMove);
		window.addEventListener("pointerup", handleUp);
		window.addEventListener("pointercancel", handleUp);
		return () => {
			window.removeEventListener("pointermove", handleMove);
			window.removeEventListener("pointerup", handleUp);
			window.removeEventListener("pointercancel", handleUp);
		};
	}, [isDragging]);

	const markLoaded = useCallback((node) => {
		setLoaded({
			src: node.getAttribute("src"),
			natural: { width: node.naturalWidth, height: node.naturalHeight },
			failed: false,
		});
	}, []);

	const imageRef = useCallback(
		(node) => {
			if (node?.complete && node.naturalWidth) markLoaded(node);
		},
		[markLoaded],
	);

	const handlePointerDown = (e) => {
		if (!interactive || (e.pointerType === "mouse" && e.button !== 0)) return;
		e.preventDefault();
		frameRef.current.focus({ preventScroll: true });
		pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
		gesture.current = gestureFrom([...pointers.current.values()], edit);
		setIsDragging(true);
		setHasInteracted(true);
	};

	const handleKeyDown = (e) => {
		if (!interactive || !frame) return;
		const step = e.shiftKey ? 50 : 10;
		const center = { x: frame.width / 2, y: frame.height / 2 };
		const moves = {
			ArrowLeft: [-step, 0],
			ArrowRight: [step, 0],
			ArrowUp: [0, -step],
			ArrowDown: [0, step],
		};
		let next;
		if (moves[e.key]) {
			next = panPicture(edit, ...moves[e.key], frame, natural);
		} else if (e.key === "+" || e.key === "=") {
			next = zoomPicture(edit, edit.zoom + 0.1, center, frame, natural);
		} else if (e.key === "-" || e.key === "_") {
			next = zoomPicture(edit, edit.zoom - 0.1, center, frame, natural);
		} else {
			return;
		}
		e.preventDefault();
		setHasInteracted(true);
		onChange?.(next);
	};

	const zoomTo = (zoom) =>
		onChange?.(
			zoomPicture(
				edit,
				zoom,
				frame && { x: frame.width / 2, y: frame.height / 2 },
				frame,
				natural,
			),
		);

	const rotate = () =>
		onChange?.({ ...edit, rotate: (edit.rotate + 90) % 360, x: 50, y: 50 });

	const recenter = () => onChange?.({ ...edit, x: 50, y: 50 });

	const applyFilter = ({ name, ...values }) =>
		onChange?.({ ...edit, ...values });

	const imageStyle = layout
		? {
				left: layout.centerX - layout.drawWidth / 2,
				top: layout.centerY - layout.drawHeight / 2,
				width: layout.drawWidth,
				height: layout.drawHeight,
				maxWidth: "none",
				transform: rotation,
				filter: filter === "none" ? undefined : filter,
			}
		: {
				left: 0,
				top: 0,
				width: "100%",
				height: "100%",
				objectFit: "cover",
				opacity: 0,
			};

	return (
		<div className={`mb-3${disabled ? " opacity-75" : ""}`}>
			<div className="d-flex justify-content-center">
				<div
					ref={frameRef}
					className="position-relative overflow-hidden rounded bg-dark user-select-none focus-ring w-100"
					style={{
						maxWidth,
						aspectRatio,
						touchAction: "none",
						cursor: interactive
							? isDragging
								? "grabbing"
								: "grab"
							: "default",
					}}
					role="application"
					aria-label={`${label} editor`}
					aria-describedby={`${id}-help`}
					tabIndex={status === "ready" ? 0 : -1}
					onPointerDown={handlePointerDown}
					onKeyDown={handleKeyDown}
				>
					{src ? (
						// eslint-disable-next-line @next/next/no-img-element -- sized and positioned by hand for the crop
						<img
							ref={imageRef}
							src={src}
							alt={alt}
							draggable={false}
							onLoad={(e) => markLoaded(e.currentTarget)}
							onError={(e) =>
								setLoaded({
									src: e.currentTarget.getAttribute("src"),
									natural: null,
									failed: true,
								})
							}
							className="position-absolute pe-none"
							style={imageStyle}
						/>
					) : null}
					{shape === "circle" && status === "ready" ? (
						<div
							aria-hidden
							className="position-absolute top-0 start-0 w-100 h-100 rounded-circle pe-none"
							style={{
								boxShadow: "0 0 0 100vmax rgba(0, 0, 0, 0.55)",
								border: "2px solid rgba(255, 255, 255, 0.85)",
							}}
						/>
					) : null}
					{isDragging ? (
						<div
							aria-hidden
							className="position-absolute top-0 start-0 w-100 h-100 pe-none"
							style={THIRDS_GRID}
						/>
					) : null}
					{interactive && !hasInteracted ? (
						<span
							aria-hidden
							className="position-absolute bottom-0 start-50 translate-middle-x mb-2 badge rounded-pill text-bg-dark pe-none"
						>
							<i className="fa-solid fa-up-down-left-right me-1 align-middle" />
							Drag to reposition
						</span>
					) : null}
					{status !== "ready" ? (
						<div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-2 p-3 text-center text-light">
							{status === "loading" ? (
								<span
									className="spinner-border spinner-border-sm"
									role="status"
								>
									<span className="visually-hidden">Loading picture</span>
								</span>
							) : (
								<>
									<i
										aria-hidden
										className={`fa-solid ${status === "error" ? "fa-triangle-exclamation" : "fa-image"} fa-2x align-middle`}
									/>
									<span className="small">
										{status === "error"
											? "This picture could not be loaded. Choose a new file below."
											: "Choose a picture below to get started."}
									</span>
								</>
							)}
						</div>
					) : null}
				</div>
			</div>
			<p id={`${id}-help`} className="visually-hidden">
				Drag the picture or use the arrow keys to move it, and plus or minus to
				zoom. Hold Shift to move faster.
			</p>

			<div className="d-flex flex-wrap align-items-center gap-2 mt-3">
				<div
					className="d-flex align-items-center gap-2 flex-grow-1"
					style={{ minWidth: "15rem" }}
				>
					<button
						type="button"
						className="btn btn-outline-secondary btn-sm"
						onClick={() => zoomTo(edit.zoom - 0.25)}
						disabled={!interactive || edit.zoom <= MIN_ZOOM}
						aria-label="Zoom out"
					>
						<i
							aria-hidden
							className="fa-solid fa-magnifying-glass-minus align-middle"
						/>
					</button>
					<label htmlFor={`${id}-zoom`} className="visually-hidden">
						Zoom
					</label>
					<input
						id={`${id}-zoom`}
						type="range"
						className="form-range"
						min={MIN_ZOOM}
						max={MAX_ZOOM}
						step={0.01}
						value={edit.zoom}
						onChange={(e) => zoomTo(Number(e.target.value))}
						disabled={!interactive}
						aria-valuetext={`${edit.zoom.toFixed(1)}x zoom`}
					/>
					<button
						type="button"
						className="btn btn-outline-secondary btn-sm"
						onClick={() => zoomTo(edit.zoom + 0.25)}
						disabled={!interactive || edit.zoom >= MAX_ZOOM}
						aria-label="Zoom in"
					>
						<i
							aria-hidden
							className="fa-solid fa-magnifying-glass-plus align-middle"
						/>
					</button>
					<output
						htmlFor={`${id}-zoom`}
						className="small text-body-secondary text-end"
						style={{ minWidth: "2.5rem" }}
					>
						{edit.zoom.toFixed(1)}×
					</output>
				</div>
				<div
					className="btn-group btn-group-sm"
					role="group"
					aria-label="Position"
				>
					<button
						type="button"
						className="btn btn-outline-secondary"
						onClick={rotate}
						disabled={!interactive}
					>
						<i
							aria-hidden
							className="fa-solid fa-rotate-right me-1 align-middle"
						/>
						Rotate
					</button>
					<button
						type="button"
						className="btn btn-outline-secondary"
						onClick={recenter}
						disabled={!interactive}
					>
						<i
							aria-hidden
							className="fa-solid fa-crosshairs me-1 align-middle"
						/>
						Center
					</button>
				</div>
			</div>

			<fieldset className="mt-3" disabled={!interactive}>
				<legend className="form-label fs-6 mb-2">Filter</legend>
				<div className="d-flex gap-2 overflow-x-auto pb-1">
					{PICTURE_FILTERS.map((preset) => {
						const isActive = activeFilter?.name === preset.name;
						return (
							<button
								key={preset.name}
								type="button"
								aria-pressed={isActive}
								onClick={() => applyFilter(preset)}
								className={`btn btn-sm p-1 flex-shrink-0 d-flex flex-column align-items-center gap-1 ${isActive ? "btn-secondary" : "btn-outline-secondary"}`}
							>
								<span
									className="d-block overflow-hidden rounded bg-dark"
									style={{ width: 56, height: 56 }}
								>
									{src && natural ? (
										// eslint-disable-next-line @next/next/no-img-element -- live filter preview of a blob or remote URL
										<img
											src={src}
											alt=""
											draggable={false}
											className="w-100 h-100 object-fit-cover"
											style={{
												filter: filterCss({ ...edit, ...preset }),
												transform: rotation,
											}}
										/>
									) : null}
								</span>
								<span className="small">{preset.name}</span>
							</button>
						);
					})}
				</div>
			</fieldset>

			<details className="mt-3">
				<summary className="small fw-semibold">Fine-tune</summary>
				<fieldset className="row g-3 mt-0" disabled={!interactive}>
					<legend className="visually-hidden">Adjustments</legend>
					{ADJUSTMENTS.map(({ key, label: name }) => {
						const [min, max] = EDIT_LIMITS[key];
						return (
							<div className="col-12 col-sm-6" key={key}>
								<label
									htmlFor={`${id}-${key}`}
									className="form-label small d-flex justify-content-between mb-1"
								>
									<span>{name}</span>
									<span aria-hidden className="text-body-secondary">
										{edit[key]}%
									</span>
								</label>
								<input
									id={`${id}-${key}`}
									type="range"
									className="form-range"
									min={min}
									max={max}
									step={1}
									value={edit[key]}
									onChange={(e) =>
										onChange?.({ ...edit, [key]: Number(e.target.value) })
									}
									aria-valuetext={`${edit[key]}%`}
								/>
							</div>
						);
					})}
				</fieldset>
			</details>
		</div>
	);
};

export default PictureEditor;
