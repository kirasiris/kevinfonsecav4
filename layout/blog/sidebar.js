"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Globalsidebar from "../sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";

const idOf = (value) => {
	if (!value) return "";
	if (typeof value === "string") return value;
	if (typeof value === "object" && value._id) return String(value._id);
	return "";
};

const toCategoryArray = (value) => {
	if (Array.isArray(value)) return value;
	if (value && Array.isArray(value.data)) return value.data;
	return [];
};

const ENTITIES = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	apos: "'",
	"#39": "'",
	nbsp: "\u00A0",
};
const decodeEntities = (text) =>
	String(text || "").replace(
		/&(amp|lt|gt|quot|apos|#39|nbsp);/g,
		(_, name) => ENTITIES[name],
	);

const usesOf = (c) => {
	const n = Number(c.timesUsed);
	return Number.isFinite(n) && n > 0 ? n : 0;
};

const typeOf = (c) => String(c.categoryType || "blog").toLowerCase();

const toTypeSet = (types) => {
	const list = (Array.isArray(types) ? types : types ? [types] : [])
		.map((t) => String(t).trim().toLowerCase())
		.filter(Boolean);
	return list.length ? new Set(list) : null;
};

const filterByType = (list, types, includeSubcategories) => {
	const allowed = toTypeSet(types);
	if (!allowed) return list;
	const byId = new Map(list.map((c) => [idOf(c), c]));
	const passes = (c) => {
		if (allowed.has(typeOf(c))) return true;
		if (!includeSubcategories) return false;
		const visited = new Set([idOf(c)]);
		let parent = byId.get(idOf(c.parentId));
		while (parent && !visited.has(idOf(parent))) {
			if (allowed.has(typeOf(parent))) return true;
			visited.add(idOf(parent));
			parent = byId.get(idOf(parent.parentId));
		}
		return false;
	};
	return list.filter(passes);
};

export const buildCategoryTree = (input, options = {}) => {
	const { types, includeSubcategories = true } = options;
	const published = toCategoryArray(input).filter(
		(c) => idOf(c) && (!c.status || c.status === "published"),
	);
	const list = filterByType(published, types, includeSubcategories);
	const byId = new Map(list.map((c) => [idOf(c), c]));
	const children = new Map();
	const roots = [];
	for (const c of byId.values()) {
		const id = idOf(c);
		const parentId = idOf(c.parentId);
		if (parentId && parentId !== id && byId.has(parentId)) {
			if (!children.has(parentId)) children.set(parentId, []);
			children.get(parentId).push(c);
		} else {
			roots.push(c);
		}
	}

	const byTitle = (a, b) =>
		decodeEntities(a.title).localeCompare(decodeEntities(b.title), undefined, {
			sensitivity: "base",
		});
	const seen = new Set();
	const toNode = (c) => {
		const id = idOf(c);
		if (seen.has(id)) return null;
		seen.add(id);
		const kids = (children.get(id) || [])
			.slice()
			.sort(byTitle)
			.map(toNode)
			.filter(Boolean);
		const count = usesOf(c);
		if (count === 0 && kids.length === 0) return null;
		return {
			id,
			title: decodeEntities(c.title) || "Untitled",
			slug: c.slug || "",
			count,
			children: kids,
		};
	};

	const tree = roots.slice().sort(byTitle).map(toNode).filter(Boolean);
	for (const c of [...byId.values()].sort(byTitle)) {
		if (seen.has(idOf(c))) continue;
		const node = toNode(c);
		if (node) tree.push(node);
	}
	return tree;
};

const categoryHref = (node) => ({
	pathname: node.slug
		? `/blog/category/${node.id}/${node.slug}`
		: `/blog/category/${node.id}`,
	query: { page: 1, limit: 10, sort: "-createdAt" },
});

function CategoryItem({ node, depth }) {
	return (
		<li
			className={
				depth === 0 ? "list-group-item" : "list-group-item border-0 py-1 pe-0"
			}
		>
			<div className="d-flex justify-content-between align-items-center gap-2">
				<Link
					href={categoryHref(node)}
					className="btn btn-sm btn-link text-start px-0"
				>
					{node.title}
				</Link>
				{node.count > 0 && (
					<span className="badge bg-secondary rounded-pill">
						{node.count}
						<span className="visually-hidden">
							{node.count === 1 ? " post" : " posts"}
						</span>
					</span>
				)}
			</div>
			{node.children.length > 0 && (
				<ul className="list-group list-group-flush ps-3 border-start ms-1">
					{node.children.map((child) => (
						<CategoryItem key={child.id} node={child} depth={depth + 1} />
					))}
				</ul>
			)}
		</li>
	);
}

const Sidebar = ({
	quotes = [],
	categories = [],
	categoryTypes,
	includeSubcategories = true,
}) => {
	const router = useRouter();
	const [quoteList, setQuoteList] = useState(quotes?.data);
	const [quoteIsLoading, setQuoteIsLoading] = useState(false);
	const [forecast, setForecast] = useState({});
	const [, setError] = useState(false);

	const [searchParams, setSearchParams] = useState({
		keyword: "",
	});

	const { keyword } = searchParams;

	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const searchData = async (e) => {
		e.preventDefault();
		router.push(`/blog/search?page=1&limit=10&sort=-createdAt${keywordQuery}`);
	};

	useEffect(() => {
		const fetchForecast = async () => {
			try {
				const res = await fetchurl(
					`https://api.openweathermap.org/data/2.5/weather?lat=32.8009936&lon=-97.4541233&appid=0535e4c52b3e390a1d018112afd15f98&units=imperial`,
					"GET",
					"no-cache",
					undefined,
					undefined,
					false,
					true,
				);
				setForecast(res);
			} catch (err) {
				setError(true);
				toast.error(err?.response?.statusText);
			}
		};
		fetchForecast();
	}, []);

	const generateNewQuote = async () => {
		setQuoteIsLoading(true);
		const res = await fetchurl(
			`/global/quotes/random`,
			"GET",
			"no-cache",
			undefined,
			undefined,
			false,
			false,
		);
		if (res.status === "error") {
			toast.error(res.message);
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message);
			return;
		}
		setQuoteIsLoading(false);
		setQuoteList(res?.data);
	};

	const tree = buildCategoryTree(categories, {
		types: categoryTypes,
		includeSubcategories,
	});
	if (tree.length === 0) {
		return null;
	}

	return (
		<Globalsidebar>
			{/* Search box */}
			<div className="card mb-4">
				<div className="card-header">Search</div>
				<div className="card-body">
					<form onSubmit={searchData}>
						<div className="input-group">
							<input
								id="keyword"
								name="keyword"
								value={keyword}
								onChange={(e) => {
									setSearchParams({
										...searchParams,
										keyword: e.target.value,
									});
								}}
								type="text"
								className="form-control"
								placeholder="Enter search term..."
							/>
							<button
								type="submit"
								className="btn btn-secondary"
								disabled={keyword.length > 0 ? !true : !false}
							>
								Go!
							</button>
						</div>
					</form>
				</div>
			</div>
			{/* Random quote box */}
			{quoteList?.length > 0 && (
				<div className="card mb-4">
					<div className="card-header d-flex justify-content-between align-items-center">
						<span>Random Quote</span>
						<button
							type="button"
							className="btn btn-secondary btn-sm"
							onClick={generateNewQuote}
							disabled={quoteIsLoading}
						>
							{quoteIsLoading ? (
								<i
									className="fa-solid fa-rotate fa-spin align-middle"
									aria-hidden
								/>
							) : (
								<i className="fa-solid fa-rotate align-middle" aria-hidden />
							)}
						</button>
					</div>
					<div
						className="card-body"
						aria-busy={quoteIsLoading}
						aria-live="polite"
					>
						{quoteList?.map((quote, index) => (
							<figure key={quote._id} className={`m-0 ${index}`}>
								<blockquote className="blockquote m-0">
									<p>{quote.text.toUpperCase()}</p>
								</blockquote>
								<figcaption className="blockquote-footer m-0">
									<a
										href={quote.authorUrl || "#"}
										target="_blank"
										rel="noreferrer noopener"
									>
										{quote.authorName}
									</a>
									&nbsp;-&nbsp;
									<cite title={quote.sourceWebsite}>
										<a
											href={quote.sourceUrl || "#"}
											target="_blank"
											rel="noreferrer noopener"
										>
											{quote.sourceWebsite}
										</a>
									</cite>
								</figcaption>
							</figure>
						))}
					</div>
				</div>
			)}
			{/* Categories box */}
			{categories.data?.length > 0 && (
				<div className="card mb-4">
					<div className="card-header">Categories</div>
					<div className="card-body p-0">
						<ul className="list-group list-group-flush">
							{tree.map((node) => (
								<CategoryItem key={node.id} node={node} depth={0} />
							))}
						</ul>
					</div>
				</div>
			)}
			{/* Weather APP */}
			<div className="card mb-4">
				<div className="card-header">
					Current&nbsp;Forecast&nbsp;(Fort Worth, TX)
				</div>
				<div className="card-body">
					<div className="d-flex">
						<div className="float-start">
							<span>City:</span>&nbsp;{forecast.name}
							<p className="display-1">{parseInt(forecast.main?.temp)}F°</p>
							<span>Wind:{forecast.wind?.speed}&nbsp;km/h</span>
							<br />
							<span>Longitude:&nbsp;{forecast.coord?.lon}</span>
							<br />
							<span>Latitude:&nbsp;{forecast.coord?.lat}</span>
						</div>
						<div className="float-end m-auto">
							<i className="fa-solid fa-cloud fa-10x" aria-hidden />
						</div>
					</div>
				</div>
				<div className="card-footer">Based on a 3-hour forecast</div>
			</div>
		</Globalsidebar>
	);
};

export default Sidebar;
