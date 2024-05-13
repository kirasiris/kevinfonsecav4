"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import ParseHtml from "@/layout/parseHtml";
import Image from "next/image";
import Link from "next/link";
import Map from "@/components/global/map";

const ReadCompany = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [company, setCompany] = useState(null);
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const companyId = id;

	useEffect(() => {
		const fetchCompany = async () => {
			try {
				const res = await fetchurl(
					`/companies/${companyId}`,
					"GET",
					"no-cache"
				);
				setCompany(res?.data);
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

		const fetchJobs = async () => {
			try {
				const res = await fetchurl(
					`/jobs?resourceId=${companyId}&sort=-createdAt`,
					"GET",
					"no-cache"
				);
				setJobs(res?.data);
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
		fetchCompany();
		fetchJobs();
	}, [companyId]);

	return loading || company === null || company === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<div className="row">
			<div className="col-lg-8">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{company.title}</div>
					<div className="card-body">
						<ParseHtml text={company.text} />
					</div>
				</div>
				<div className="card rounded-0 mb-3">
					<div className="card-header">
						<div className="float-start">
							<div className="d-flex align-items-center">
								<p className="mt-2 mb-0">Jobs</p>
							</div>
						</div>
						<div className="float-end my-1">
							<div className="btn-group">
								<Link
									href={{
										pathname: `/noadmin/companies/job/${company._id}/create`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a className="btn btn-outline-secondary btn-sm">Add job</a>
								</Link>
							</div>
						</div>
					</div>
					{jobs?.length > 0 ? (
						<ul
							className="list-group list-group-flush overflow-x-hidden"
							style={{ maxHeight: "1000px" }}
						>
							{jobs.map((job, index) => (
								<li key={job._id} className={`list-group-item ${job._id}`}>
									<div className="float-start">
										<Link href={`/job/${job._id}`} passHref legacyBehavior>
											<a target="_blank">
												<span className="badge bg-secondary me-1">{index}</span>
												{job.title}
											</a>
										</Link>
									</div>
									<div className="float-end">
										{/*
										<span className="badge bg-info me-1">
											{job.duration}
										</span>
										<span className="badge bg-secondary me-1">
											{job.views}&nbsp;Views
										</span>
										<span className="badge bg-dark me-1">
											{job.language.toUpperCase()}
										</span> */}
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="alert alert-danger rounded-0  m-0 border-0">
							Nothing&nbsp;found
						</div>
					)}
				</div>
				<div className="card rounded-0 mb-3">
					<div className="card-header">Address</div>
					<div className="card-body p-0">
						<Map object={company} />
					</div>
				</div>
			</div>
			<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
				<figure className="mb-3 bg-dark">
					<Image
						className="img-fluid p-3"
						src={
							company?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/260x370`
						}
						alt={`${company?.files?.avatar?.location?.filename}'s featured image`}
						width={440}
						height={570}
						priority
					/>
				</figure>
			</div>
		</div>
	);
};

export default ReadCompany;
