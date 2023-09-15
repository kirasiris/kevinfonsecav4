"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ParseHtml from "@/layout/parseHtml";

const ReadReport = () => {
	const router = useRouter();

	const [report, setReport] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const reportId = id;

	useEffect(() => {
		const fetchReport = async () => {
			try {
				const res = await axios.get(`/reports/${reportId}`);
				setReport(res?.data?.data);
				setLoading(false);
			} catch (err) {
				console.log(err);
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
		fetchReport();
	}, [reportId]);

	return loading || report === null || report === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<header className="mb-4">
						<h1>{report?.title}</h1>
						<div className="text-muted fst-italic mb-2">
							Posted on {report?.createdAt}
						</div>
					</header>
					<section className="mb-5">
						<ParseHtml text={report?.text} />
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadReport;
