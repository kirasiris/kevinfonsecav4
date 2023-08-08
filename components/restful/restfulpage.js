"use client";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Tab, Tabs } from "react-bootstrap";

const RestfulPage = ({ searchParams }) => {
	const [data, setData] = useState({});
	const [restfulData, setRestfulData] = useState({
		apiURL: ``,
		paramsAPI: [
			{
				key: "",
				value: "",
				description: "",
			},
		],
		methodAPI: "GET",
		headersAPI: [
			{
				key: "",
				value: "",
				description: "",
			},
		],
		bodyAPI: {},
		modeAPI: ["cors", "no-cors", "same-origin"],
		credentialsAPI: [],
	});

	const {
		apiURL,
		paramsAPI,
		methodAPI,
		headersAPI,
		bodyAPI,
		modeAPI,
		credentialsAPI,
	} = restfulData;

	const [error, setError] = useState("");

	const [checkWebsiteBtnText, setCheckWebsiteBtnText] = useState("Test API");

	const handleParamsChange = (index, field) => (e) => {
		const newParams = [...paramsAPI];
		newParams[index][field] = e.target.value;

		if (index === restfulData.paramsAPI.length - 1 && e.target.value !== "") {
			newParams.push({ key: "", value: "", description: "" });
		}

		let newApiURL = restfulData.apiURL;

		/*
		ALGUIEN QUE ME AYUDE A ARREGLAR ESTO? La funcion hace un appending inapropiado de strings
		XD
		*/
		// let prevValue = "";

		// newParams.forEach((param, i) => {
		// 	if (param.key.trim() !== "" && param.value.trim() !== "") {
		// 		const encodedKey = encodeURIComponent(param.key);
		// 		const encodedValue = encodeURIComponent(param.value);

		// 		if (newApiURL.match(new RegExp(`[?&]${encodedKey}=[^&]*`))) {
		// 			newApiURL = newApiURL.replace(
		// 				new RegExp(`[?&]${encodedKey}=[^&]*`),
		// 				""
		// 			);
		// 		}

		// 		if (param.value.trim() !== "" && param.value !== prevValue) {
		// 			if (i === 0 && !newApiURL.includes("?")) {
		// 				newApiURL += `?${encodedKey}=${encodedValue}`;
		// 			} else {
		// 				newApiURL += `${
		// 					newApiURL.startsWith("?") ? "&" : "&"
		// 				}${encodedKey}=${encodedValue}`;
		// 			}
		// 			prevValue = param.value;
		// 		}
		// 	}
		// });

		let urlParams = new URLSearchParams();

		newParams.forEach((param) => {
			if (param.key.trim() !== "" && param.value.trim() !== "") {
				const encodedKey = encodeURIComponent(param.key);
				const encodedValue = encodeURIComponent(param.value);

				urlParams.append(encodedKey, encodedValue);
			}
		});

		const queryString = urlParams.toString();
		newApiURL = queryString ? `${newApiURL}?${queryString}` : newApiURL;

		setRestfulData({
			...restfulData,
			paramsAPI: newParams,
			apiURL: newApiURL,
		});
	};

	const handleAddRow = () => {
		paramsAPI.push({ key: "", value: "", description: "" });
	};

	const handleRemoveRow = (index) => () => {
		const newParams = paramsAPI.filter((_, i) => i !== index);
		setRestfulData({
			...restfulData,
			paramsAPI: newParams,
		});
	};

	const testRemoteAPI = async (e) => {
		e.preventDefault();
		setCheckWebsiteBtnText("...");
		await fetch(`${apiURL}`, {
			method: methodAPI.toString().toUpperCase(),
			headers: {
				...headersAPI,
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				setCheckWebsiteBtnText(checkWebsiteBtnText);
				setData(data);
			})
			.catch((err) => {
				console.log(err.message);
				setError(err.message);
			});
	};

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-lg-6">
					<form onSubmit={testRemoteAPI} className="row">
						<div className="col-lg-9">
							<div className="input-group">
								<select
									id="methodAPI"
									name="methodAPI"
									value={methodAPI}
									onChange={(e) => {
										setRestfulData({
											...restfulData,
											methodAPI: e.target.value,
										});
									}}
									className="form-select"
								>
									<option value="GET">GET</option>
									<option value="POST">POST</option>
									<option value="PUT">PUT</option>
									<option value="PATCH">PATCH</option>
									<option value="DELETE">DELETE</option>
									<option value="HEAD">HEAD</option>
									<option value="OPTIONS">OPTIONS</option>
								</select>
								<input
									id="apiURL"
									name="apiURL"
									value={apiURL}
									onChange={(e) => {
										setRestfulData({
											...restfulData,
											apiURL: e.target.value,
										});
									}}
									type="text"
									className="form-control w-75"
									placeholder="http://localhost:5000/"
								/>
							</div>
						</div>
						<div className="col-lg-3">
							<button
								type="submit"
								disabled={apiURL.length > 0 ? !true : !false}
								className="btn btn-secondary rounded-0 w-100"
							>
								{checkWebsiteBtnText}
							</button>
						</div>
						<div className="col-lg-12 mt-3">
							<Tabs defaultActiveKey="params" className="mb-3" fill>
								<Tab eventKey="params" title="Params">
									<table className="table table-striped table-hover">
										<thead>
											<tr>
												<th scope="col">#</th>
												<th scope="col">Key</th>
												<th scope="col">Value</th>
												<th scope="col">Description</th>
											</tr>
										</thead>
										<tbody>
											{paramsAPI?.length > 0 &&
												paramsAPI?.map((param, index) => (
													<tr key={index}>
														<th scope="row">{index + 1}</th>
														<td>
															<input
																id={`paramsAPI[${index}].key`}
																name={`paramsAPI[${index}].key`}
																value={param.key}
																onChange={handleParamsChange(index, "key")}
																type="text"
																className="form-control w-75"
																placeholder=""
															/>
														</td>
														<td>
															<input
																id={`paramsAPI[${index}].value`}
																name={`paramsAPI[${index}].value`}
																value={param.value}
																onChange={handleParamsChange(index, "value")}
																type="text"
																className="form-control w-75"
																placeholder=""
															/>
														</td>
														<td>
															<input
																id={`paramsAPI[${index}].description`}
																name={`paramsAPI[${index}].description`}
																value={param.description}
																onChange={handleParamsChange(
																	index,
																	"description"
																)}
																type="text"
																className="form-control w-75"
																placeholder=""
															/>
														</td>
														<td>
															{index === paramsAPI.length - 1 ? (
																<button
																	className="btn btn-success"
																	onClick={handleAddRow}
																>
																	+
																</button>
															) : (
																<button
																	className="btn btn-danger"
																	onClick={handleRemoveRow(index)}
																>
																	x
																</button>
															)}
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</Tab>
								<Tab eventKey="authorization" title="Authorization">
									Tab content for Authorization
								</Tab>
								<Tab eventKey="headers" title="Headers">
									<table className="table table-striped table-hover">
										<thead>
											<tr>
												<th scope="col">#</th>
												<th scope="col">Key</th>
												<th scope="col">Value</th>
												<th scope="col">Description</th>
											</tr>
										</thead>
										<tbody>
											{/* {headersAPI.map((header, index) => (
												<tr key={index}>
													<th scope="row">{index + 1}</th>
													<td>
														<input
															id={`headersAPI[${index}].key`}
															name={`headersAPI[${index}].key`}
															value={header.key}
															// onChange={handleChange(index, "key")}
															type="text"
															className="form-control w-75"
															placeholder=""
														/>
													</td>
													<td>
														<input
															id={`headersAPI[${index}].value`}
															name={`headersAPI[${index}].value`}
															value={header.value}
															// onChange={handleChange(index, "value")}
															type="text"
															className="form-control w-75"
															placeholder=""
														/>
													</td>
													<td>
														<input
															id={`headersAPI[${index}].description`}
															name={`headersAPI[${index}].description`}
															value={header.description}
															// onChange={handleChange(index, "description")}
															type="text"
															className="form-control w-75"
															placeholder=""
														/>
													</td>
												</tr>
											))} */}
										</tbody>
									</table>
								</Tab>
								<Tab eventKey="body" title="Body">
									Tab content for Body
								</Tab>
							</Tabs>
						</div>
					</form>
					<pre>
						<code>{JSON.stringify(restfulData, null, 4)}</code>
					</pre>
				</div>
				<div className="col-lg-6">
					{error && <p>{error}</p>}
					{data && (
						<CodeMirror
							value={JSON.stringify(data, null, 4)}
							theme={vscodeDark}
							extensions={[loadLanguage("json")]}
							readOnly
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default RestfulPage;
