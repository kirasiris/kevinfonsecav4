"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/quotes/single";
import MyTextArea from "@/layout/mytextarea";
import { useContext } from "react";
import AuthContext from "@/helpers/globalContext";

const AdminQuotesIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [quotes, setQuotes] = useState([]);

	const [params] = useState(`?page=1&sort=-createdAt`);

	const fetchQuotes = async () => {
		try {
			const res = await axios.get(`/extras/quotes${params}`);
			setQuotes(res?.data?.data);
			setTotalResults({ ...totalResults, blogs: res?.data?.countAll });
		} catch (err) {
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
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

	useEffect(() => {
		fetchQuotes();
	}, [router]);

	const [quoteData, setQuoteData] = useState({
		text: ``,
		authorName: ``,
		authorUrl: `#`,
		sourceWebsite: ``,
		sourceUrl: `#`,
		status: `draft`,
		embedding: false,
	});

	const {
		text,
		authorName,
		authorUrl,
		sourceWebsite,
		sourceUrl,
		status,
		embedding,
	} = quoteData;

	const createQuote = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(`/extras/quotes`, quoteData);
			setQuotes([res?.data?.data, ...quotes]);
			setTotalResults({ ...totalResults, quotes: quotes.length + 1 });
			toast.success(`Item created`);
			resetForm();
		} catch (err) {
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/extras/quotes/${id}`);
			toast.success("Quote deleted");
			fetchQuotes();
		} catch (err) {
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
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

	const handleDeleteAll = async () => {
		try {
			await axios.delete(`/extras/quotes/deleteall`);
			toast.success("Quotes deleted");
			fetchQuotes();
		} catch (err) {
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
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

	const resetForm = () => {
		setQuoteData({
			text: ``,
			authorName: ``,
			authorUrl: `#`,
			sourceWebsite: ``,
			sourceUrl: `#`,
			status: `draft`,
			embedding: false,
		});
	};

	return (
		<>
			<div className="bg-body-secondary mb-3 p-1">
				<Link
					href={{
						pathname: "/noadmin/quotes",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">All</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/quotes/published",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Published</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/quotes/draft",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Draft</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/quotes/scheduled",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Scheduled</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/quotes/trashed",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Trashed</a>
				</Link>
			</div>
			<div className="row">
				<div className="col">
					<form onSubmit={createQuote}>
						<label
							htmlFor="blog-text multipurpose-textarea"
							className="form-label"
						>
							Text
						</label>
						<MyTextArea
							id="category-text"
							name="text"
							value={text}
							handleChangeValue={(e) =>
								setQuoteData({
									...quoteData,
									text: e.target.value,
								})
							}
						/>
						<label htmlFor="authorName" className="form-label">
							Author Name
						</label>
						<input
							id="authorName"
							name="authorName"
							value={authorName}
							onChange={(e) => {
								setQuoteData({
									...quoteData,
									authorName: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder="Someone"
						/>
						<label htmlFor="authorUrl" className="form-label">
							Author Url
						</label>
						<input
							id="authorUrl"
							name="authorUrl"
							value={authorUrl}
							onChange={(e) => {
								setQuoteData({
									...quoteData,
									authorUrl: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder="#"
						/>
						<label htmlFor="sourceWebsite" className="form-label">
							Source Website
						</label>
						<input
							id="sourceWebsite"
							name="sourceWebsite"
							value={sourceWebsite}
							onChange={(e) => {
								setQuoteData({
									...quoteData,
									sourceWebsite: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder="Somewhere"
						/>
						<label htmlFor="sourceUrl" className="form-label">
							Source Url
						</label>
						<input
							id="sourceUrl"
							name="sourceUrl"
							value={sourceUrl}
							onChange={(e) => {
								setQuoteData({
									...quoteData,
									sourceUrl: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder="#"
						/>
						<label htmlFor="embedding" className="form-label">
							Embedding
						</label>
						<select
							id="embedding"
							name="embedding"
							value={embedding}
							onChange={(e) => {
								setQuoteData({
									...quoteData,
									embedding: e,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
						<label htmlFor="status" className="form-label">
							Status
						</label>
						<select
							id="status"
							name="status"
							value={status}
							onChange={(e) => {
								setQuoteData({
									...quoteData,
									status: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`draft`}>Draft</option>
							<option value={`published`}>Published</option>
							<option value={`trash`}>Trash</option>
							<option value={`scheduled`}>Scheduled</option>
						</select>
						<br />
						<button
							type="submit"
							className="btn btn-secondary btn-sm float-start"
							disabled={authorName.length > 0 ? !true : !false}
						>
							Submit
						</button>
						<button
							type="button"
							className="btn btn-secondary btn-sm float-end"
							onClick={resetForm}
						>
							Reset
						</button>
					</form>
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<div className="card-header">
							<Link
								href={{
									pathname: "/noadmin/quotes",
									query: { page: 1, limit: 10 },
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm float-start">
									Quotes - ({totalResults.quotes})
								</a>
							</Link>
							<div className="btn-group float-end">
								<button
									className="btn btn-danger btn-sm"
									type="button"
									onClick={handleDeleteAll}
								>
									Delete all
								</button>
							</div>
						</div>
						{quotes?.length > 0 ? (
							<ul className="list-group list-group-flush">
								{quotes?.map((quote) => (
									<Single
										key={quote._id}
										linkTo={`/noadmin/quotes/update/${quote._id}`}
										object={quote}
										handleDelete={handleDelete}
										quotes={quotes}
										setQuotes={setQuotes}
										// totalResults={totalResults}
										setTotalResults={setTotalResults}
									/>
								))}
							</ul>
						) : (
							<div className="alert alert-danger rounded-0 m-0 border-0">
								Nothing found
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminQuotesIndex;
