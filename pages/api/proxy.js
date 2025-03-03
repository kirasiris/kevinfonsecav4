export default async function handler(req, res) {
	const { method, headers, body, url } = req;

	// Extract the path after `/api/proxy`
	const apiPath = url.replace("/api/proxy", "/api/v1");

	// Construct the API URL
	const apiUrl = `https://befree.herokuapp.com${apiPath}`;

	try {
		const response = await fetch(apiUrl, {
			method,
			headers: {
				...headers,
				host: "befree.herokuapp.com", // Ensure correct host
			},
			body: method !== "GET" ? JSON.stringify(body) : null,
		});

		const contentType = response.headers.get("content-type");
		let data;
		if (contentType && contentType.includes("application/json")) {
			data = await response.json();
			res.status(response.status).json(data);
		} else {
			data = await response.text();
			res.status(response.status).send(data);
		}
	} catch (error) {
		res
			.status(500)
			.json({ error: "Proxy request failed", details: error.message });
	}
}
