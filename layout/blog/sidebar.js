"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TiWeatherCloudy } from "react-icons/ti";
import Globalsidebar from "../sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";

const Sidebar = ({ quotes = [], categories = [] }) => {
	const router = useRouter();
	const [forecast, setForecast] = useState({});
	const [, setError] = useState(false);
	const [searchParams, setSearchParams] = useState({
		keyword: "",
	});

	const { keyword } = searchParams;

	const searchData = async (e) => {
		e.preventDefault();
		router.push(
			`/blog/search?keyword=${keyword}&page=1&limit=10&sort=-createdAt`
		);
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
					true
				);
				setForecast(res);
			} catch (err) {
				setError(true);
				// const error = err.response.data.message;
				const error = err?.response?.data?.error?.errors;
				const errors = err?.response?.data?.errors;

				if (error) {
					// dispatch(setAlert(error, 'danger'));
					error &&
						Object.entries(error).map(([, value]) =>
							toast.error(value.message)
						);
				}

				if (errors) {
					errors.forEach((error) => toast.error(error.msg));
				}

				toast.error(err?.response?.statusText);
				return {
					msg: err?.response?.statusText,
					status: err?.response?.status,
				};
			}
		};
		fetchForecast();
	}, []);

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
			{quotes.data?.length > 0 && (
				<div className="card mb-4">
					<div className="card-header">Random Quote</div>
					<div className="card-body">
						{quotes.data?.map((quote, index) => (
							<figure key={quote._id}>
								<blockquote className="blockquote">
									<p>{quote.text.toUpperCase()}</p>
								</blockquote>
								<figcaption className="blockquote-footer">
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
							{categories.data
								.filter((c) => c.parentCategory === undefined)
								.filter((c) => c.timesUsed >= 1)
								.map((category, index) => (
									<li
										key={category._id}
										className={`list-group-item ${category._id + "-" + index}`}
									>
										<Link
											href={{
												pathname: `/blog/category/${category._id}/${category.slug}`,
												query: {
													page: 1,
													limit: 10,
													sort: `-createdAt`,
												},
											}}
											className="btn btn-sm btn-link"
										>
											{category.title}
										</Link>
										<span className="badge bg-secondary rounded-pill">
											{category.timesUsed}
										</span>
										<ul className="list-group list-group-flush">
											{categories.data
												.filter((c) => c.parentCategory?._id === category._id)
												.map((childC, index) => (
													<li
														key={childC._id}
														className={`list-group-item d-flex justify-content-between align-items-center ${
															childC._id + "-" + index
														}`}
													>
														<Link
															href={{
																pathname: `/blog/category/${childC._id}/${childC.slug}`,
																query: {
																	page: 1,
																	limit: 10,
																	sort: `-createdAt`,
																},
															}}
															className="btn btn-sm btn-link"
														>
															{childC.title}
														</Link>
														<span className="badge bg-secondary rounded-pill">
															{childC.timesUsed}
														</span>
													</li>
												))}
										</ul>
									</li>
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
							<TiWeatherCloudy style={{ width: "auto", height: "150px" }} />
						</div>
					</div>
				</div>
				<div className="card-footer">Based on a 3-hour forecast</div>
			</div>
		</Globalsidebar>
	);
};

export default Sidebar;
