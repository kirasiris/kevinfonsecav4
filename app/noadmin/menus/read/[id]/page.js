"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import ParseHtml from "@/layout/parseHtml";
import Link from "next/link";

const ReadMenu = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [menu, setMenu] = useState(null);
	const [pages, setPages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const menuId = id;

	useEffect(() => {
		const fetchMenu = async () => {
			try {
				const res = await fetchurl(`/menus/${menuId}`, "GET", "no-cache");
				setMenu(res?.data);
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

		const fetchPages = async () => {
			try {
				const res = await fetchurl(
					`/pages?resourceId=${menuId}&sort=-createdAt`,
					"GET",
					"no-cache"
				);
				setPages(res?.data);
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
		fetchMenu();
		fetchPages();
	}, [menuId]);

	return loading || menu === null || menu === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<div className="row">
			<div className="col-lg-12">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{menu.title}</div>
					<div className="card-body">
						<ParseHtml text={menu.text} />
					</div>
				</div>
				<div className="card rounded-0">
					<div className="card-header">
						<div className="float-start">
							<div className="d-flex align-items-center">
								<p className="mt-2 mb-0">Pages</p>
							</div>
						</div>
						<div className="float-end my-1">
							<div className="btn-group">
								<Link
									href={{
										pathname: `/noadmin/menus/page/${menu._id}/create`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a className="btn btn-outline-secondary btn-sm">Add page</a>
								</Link>
							</div>
						</div>
					</div>
					{pages?.length > 0 ? (
						<ul
							className="list-group list-group-flush overflow-x-hidden"
							style={{ maxHeight: "1000px" }}
						>
							{pages.map((page, index) => (
								<li key={page._id} className={`list-group-item`}>
									<div className="float-start">
										<Link
											href={`/page/${page._id}/${page.slug}`}
											passHref
											legacyBehavior
										>
											<a target="_blank">
												<span className="badge bg-secondary me-1">
													{page.orderingNumber}
												</span>
												{page.title}
											</a>
										</Link>
									</div>
									<div className="float-end">
										<span className="badge bg-info me-1">
											{page.referrerpolicy}
										</span>
										<span className="badge bg-secondary me-1">
											{page.rel}&nbsp;Views
										</span>
										<span className="badge bg-dark me-1">{page.target}</span>
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
			</div>
		</div>
	);
};

export default ReadMenu;
