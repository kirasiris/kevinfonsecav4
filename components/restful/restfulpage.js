"use client";

import { useState } from "react";

const RestfulPage = ({ searchParams }) => {
	const [response, setResponse] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [endpoint, setEndpoint] = useState("");
	const [params, setParams] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await fetch(`www.google.com/search?q=${params}`);
			const data = await res.json();
			setResponse(data);
		} catch (err) {
			setError(err.message);
		}

		setLoading(false);
	};

	return (
		<div className="container-fluid">
			<div className="row">
				<form onSubmit={handleSubmit}>
					<label htmlFor="endpoint">Endpoint:</label>
					<input
						type="text"
						id="endpoint"
						value={endpoint}
						onChange={(e) => setEndpoint(e.target.value)}
					/>
					<br />
					<label htmlFor="params">Parameters:</label>
					<input
						type="text"
						id="params"
						value={params}
						onChange={(e) => setParams(e.target.value)}
					/>
					<br />
					<button type="submit" disabled={loading}>
						{loading ? "Loading..." : "Submit"}
					</button>
				</form>
				{error && <p>{error}</p>}
				{response && <pre>{JSON.stringify(response, null, 2)}</pre>}
			</div>
		</div>
	);
};

export default RestfulPage;
