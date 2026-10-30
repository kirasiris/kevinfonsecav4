export const COLORS = {
	primary: "#0d6efd",
	success: "#198754",
	gray: "#6c757d",
	silver: "#adb5bd",
	dark: "#212529",
};

const MONTH_FORMAT = new Intl.DateTimeFormat("en-US", {
	month: "short",
	year: "2-digit",
	timeZone: "UTC",
});

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
	dateStyle: "medium",
	timeZone: "UTC",
});

// fetchurl resolves (never rejects) with the error on failure, so check `success`.
export const getItems = (res) =>
	res?.success && Array.isArray(res.data) ? res.data : [];

export const getTotal = (res) =>
	res?.success ? (res.countAll ?? res.data?.length ?? 0) : 0;

export const isPublished = (item) => item.status === "published";

export const monthKey = (date) => {
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return null;
	return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

const monthStart = (date, offset = 0) => {
	const d = new Date(date);
	return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + offset, 1));
};

export const monthsBetween = (from, to) => {
	const months = [];
	const end = monthStart(to);
	for (let d = monthStart(from); d <= end; d = monthStart(d, 1)) {
		months.push({ key: monthKey(d), label: MONTH_FORMAT.format(d) });
	}
	return months;
};

export const lastMonths = (count, now = new Date()) =>
	monthsBetween(monthStart(now, -(count - 1)), now);

export const countBy = (items, getKey) => {
	const counts = new Map();
	for (const item of items) {
		const key = getKey(item);
		if (key === null || key === undefined || key === "") continue;
		counts.set(key, (counts.get(key) || 0) + 1);
	}
	return counts;
};

export const topEntries = (counts, limit, otherLabel = "Other") => {
	const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
	if (sorted.length <= limit) return sorted;
	const rest = sorted.slice(limit).reduce((sum, [, n]) => sum + n, 0);
	return [...sorted.slice(0, limit), [otherLabel, rest]];
};

export const monthlySeries = (items, months) => {
	const counts = countBy(
		items,
		(item) => item.createdAt && monthKey(item.createdAt),
	);
	return months.map((m) => counts.get(m.key) || 0);
};

export const cumulativeSeries = (items, months) => {
	const firstKey = months[0]?.key;
	let running = items.filter(
		(item) => item.createdAt && monthKey(item.createdAt) < firstKey,
	).length;
	return monthlySeries(items, months).map((n) => (running += n));
};

export const earliestDate = (collections) => {
	let earliest = null;
	for (const items of collections) {
		for (const item of items) {
			const t = new Date(item.createdAt).getTime();
			if (!Number.isNaN(t) && (earliest === null || t < earliest)) earliest = t;
		}
	}
	return earliest === null ? null : new Date(earliest);
};

export const newestFirst = (items) =>
	[...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const countSince = (items, days, now = new Date()) => {
	const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
	return items.filter((item) => new Date(item.createdAt).getTime() >= cutoff)
		.length;
};

export const formatDate = (date) => {
	const d = new Date(date);
	return Number.isNaN(d.getTime()) ? "—" : DATE_FORMAT.format(d);
};

export const formatBytes = (bytes) => {
	if (!bytes) return "0 B";
	const units = ["B", "KB", "MB", "GB", "TB"];
	const exp = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1,
	);
	return `${(bytes / 1024 ** exp).toFixed(exp === 0 ? 0 : 1)} ${units[exp]}`;
};

export const capitalize = (value) => {
	const text = String(value || "");
	return text.charAt(0).toUpperCase() + text.slice(1);
};

export const buildDashboard = ({
	blogs = [],
	themes = [],
	comments = [],
	categories = [],
	files = [],
	songs = [],
	videos = [],
}) => {
	const now = new Date();
	const media = [...songs, ...videos];

	const recentMonths = lastMonths(12, now);
	const activity = {
		labels: recentMonths.map((m) => m.label),
		series: [
			{
				label: "Blogs",
				data: monthlySeries(blogs, recentMonths),
				color: COLORS.primary,
			},
			{
				label: "Comments",
				data: monthlySeries(comments, recentMonths),
				color: COLORS.success,
			},
			{
				label: "Songs & videos",
				data: monthlySeries(media, recentMonths),
				color: COLORS.gray,
			},
			{
				label: "Files",
				data: monthlySeries(files, recentMonths),
				color: COLORS.silver,
			},
		],
	};

	const firstDate = earliestDate([blogs, themes, files, media]);
	const allMonths = firstDate ? monthsBetween(firstDate, now) : [];
	const growth = {
		labels: allMonths.map((m) => m.label),
		series: [
			{
				label: "Blogs",
				data: cumulativeSeries(blogs, allMonths),
				color: COLORS.primary,
			},
			{
				label: "Files",
				data: cumulativeSeries(files, allMonths),
				color: COLORS.silver,
			},
			{
				label: "Songs & videos",
				data: cumulativeSeries(media, allMonths),
				color: COLORS.gray,
			},
		],
	};

	const statusCounts = countBy(blogs, (b) => capitalize(b.status || "unknown"));
	const blogStatus = {
		labels: [...statusCounts.keys()],
		values: [...statusCounts.values()],
		colors: [...statusCounts.keys()].map((s) =>
			s === "Published"
				? COLORS.success
				: s === "Draft"
					? COLORS.silver
					: COLORS.gray,
		),
	};

	const categoryEntries = topEntries(
		countBy(blogs, (b) => b.category?.title || "Uncategorized"),
		8,
	);
	const blogsByCategory = {
		labels: categoryEntries.map(([label]) => label),
		series: [
			{
				label: "Blogs",
				data: categoryEntries.map(([, n]) => n),
				color: COLORS.primary,
			},
		],
	};

	const fileTypeCounts = countBy(files, (f) => f.format_type || "other");
	const fileBytesByType = files.reduce((acc, f) => {
		const type = f.format_type || "other";
		acc[type] = (acc[type] || 0) + (Number(f.size) || 0);
		return acc;
	}, {});
	const fileTypePalette = [
		COLORS.primary,
		COLORS.success,
		COLORS.gray,
		COLORS.silver,
		COLORS.dark,
	];
	const filesByType = {
		labels: [...fileTypeCounts.keys()].map(capitalize),
		values: [...fileTypeCounts.values()],
		colors: [...fileTypeCounts.keys()].map(
			(_, i) => fileTypePalette[i % fileTypePalette.length],
		),
		breakdown: [...fileTypeCounts.entries()].map(([type, count]) => ({
			type: capitalize(type),
			count,
			size: formatBytes(fileBytesByType[type] || 0),
		})),
	};

	const categoryTypeEntries = topEntries(
		countBy(categories, (c) => capitalize(c.categoryType || "blog")),
		8,
	);
	const categoriesByType = {
		labels: categoryTypeEntries.map(([label]) => label),
		series: [
			{
				label: "Categories",
				data: categoryTypeEntries.map(([, n]) => n),
				color: COLORS.gray,
			},
		],
	};

	const commentTargets = new Map();
	for (const comment of comments) {
		const target = comment.resourceId;
		const id = target?._id || target;
		if (!id) continue;
		const entry = commentTargets.get(id) || {
			id,
			title: target?.title || "Untitled",
			count: 0,
		};
		entry.count += 1;
		commentTargets.set(id, entry);
	}
	const mostCommented = [...commentTargets.values()]
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	const recentBlogs = newestFirst(blogs)
		.slice(0, 6)
		.map((b) => ({
			id: b._id,
			title: b.title,
			category: b.category?.title || "Uncategorized",
			status: b.status,
			author: b.user?.username || b.user?.name || "—",
			createdAt: b.createdAt,
		}));

	const recentComments = newestFirst(comments)
		.slice(0, 6)
		.map((c) => ({
			id: c._id,
			name: c.user?.username || c.name || "Anonymous",
			title: c.title,
			target: c.resourceId?.title || "—",
			createdAt: c.createdAt,
		}));

	return {
		activity,
		growth,
		blogStatus,
		blogsByCategory,
		filesByType,
		categoriesByType,
		mostCommented,
		recentBlogs,
		recentComments,
		totalFileBytes: files.reduce((sum, f) => sum + (Number(f.size) || 0), 0),
		commentsLast30Days: countSince(comments, 30, now),
	};
};
