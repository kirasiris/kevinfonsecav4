import {
	buildTransferStats,
	capitalize,
	countSince,
	isOnHand,
	newestFirst,
	summarizeTypes,
} from "@/helpers/dashboard/dashboardstats";

const POST_TYPE_LABELS = {
	course: "Course",
	product: "Product",
	realestate: "Real Estate",
};

const toNumber = (value) => {
	const n = Number(String(value ?? "").replace(/[^0-9.]/g, ""));
	return Number.isFinite(n) ? n : 0;
};

const stockOf = (p) => Number(p.stockQuantity) || 0;

export const formatUSD = (amount) =>
	amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const isLowStock = (p) =>
	Boolean(p.trackInventory) && stockOf(p) <= (Number(p.lowStockThreshold) || 0);

export const buildBusinessDashboard = ({
	transfers = [],
	catalog = [],
	requests = [],
	reviews = [],
	weapons = [],
	now = new Date(),
}) => {
	const transferStats = buildTransferStats(transfers, now);

	const recentTransfers = newestFirst(
		transfers.map((t) => ({ ...t, createdAt: t.receiptdate || t.createdAt })),
	)
		.slice(0, 6)
		.map((t) => ({
			id: t._id,
			firearm: [t.manufacturer?.split(";")[0], t.title]
				.filter(Boolean)
				.join(" "),
			detail: [capitalize(t.type || ""), t.caliber].filter(Boolean).join(" · "),
			receivedAt: t.receiptdate,
			onHand: isOnHand(t),
			fee: t.fee || "",
		}));

	const inventoryWatch = catalog
		.filter((p) => p.trackInventory)
		.sort((a, b) => stockOf(a) - stockOf(b))
		.slice(0, 6)
		.map((p) => ({
			id: p._id,
			title: p.title || "Untitled",
			type: POST_TYPE_LABELS[p.postType] || capitalize(p.postType || "product"),
			stock: stockOf(p),
			threshold: Number(p.lowStockThreshold) || 0,
			low: isLowStock(p),
			price: p.price?.inHumanFormat || "",
		}));

	const recentRequests = newestFirst(requests)
		.slice(0, 6)
		.map((r) => ({
			id: r._id,
			name: r.name || "Unknown",
			subject: capitalize((r.subject || "general").replace(/-/g, " ")).replace(
				/^Nfa\b/,
				"NFA",
			),
			unread: r.status !== "read",
			createdAt: r.createdAt,
		}));

	const recentReviews = newestFirst(reviews)
		.slice(0, 6)
		.map((c) => ({
			id: c._id,
			name: c.user?.username || c.name || "Anonymous",
			title: c.title,
			target: c.resourceId?.title || "—",
			createdAt: c.createdAt,
		}));
	const ratings = reviews
		.map((c) => Number(c.rating))
		.filter((n) => Number.isFinite(n) && n > 0);

	return {
		transferFlow: transferStats.flow,
		transfersByType: transferStats.byType,
		onHand: transferStats.onHand,
		disposed: transferStats.disposed,
		feesCollected: transfers.reduce((sum, t) => sum + toNumber(t.fee), 0),
		recentTransfers,
		inventoryWatch,
		lowStock: catalog.filter(isLowStock).length,
		catalogValue:
			catalog.reduce(
				(sum, p) => sum + toNumber(p.price?.inCentsFormat) * stockOf(p),
				0,
			) / 100,
		recentRequests,
		unreadRequests: requests.filter((r) => r.status !== "read").length,
		requestsLast30Days: countSince(requests, 30, now),
		recentReviews,
		averageRating: ratings.length
			? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
			: null,
		weaponTypes: summarizeTypes(weapons),
	};
};
