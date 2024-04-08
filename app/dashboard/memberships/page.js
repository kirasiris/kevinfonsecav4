"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/dashboard/memberships/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/layout/dashboard/dashboardcardheadermenu";
import ClientNumericPagination from "@/layout/clientnumericpagination";
import OnboardingLink from "@/components/dashboard/onboardinglink";

const DashboardMembershipsIndex = () => {
	const {
		auth,
		totalPages,
		setTotalPages,
		currentResults,
		setCurrentResults,
		totalResults,
		setTotalResults,
	} = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [memberships, setMemberships] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [sortby] = useState(`-createdAt`);
	const [params, setParams] = useState(
		`?user=${auth.user._id}&page=${page}&limit=${limit}&sort=${sortby}`
	);
	const [keyword, setKeyword] = useState("");
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchMemberships = async () => {
		try {
			const res = await fetchurl(
				`/extras/stripe/memberships${params}`,
				"GET",
				"no-cache"
			);
			setMemberships(res?.data);
			setTotalPages(res?.pagination?.totalpages);
			setCurrentResults(res?.count);
			setTotalResults({ ...totalResults, memberships: res?.countAll });
			setPage(res?.pagination?.current);
			setLoading(false);
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
		fetchMemberships();
	}, [router, params]);

	useEffect(() => {
		setList(memberships);
	}, [memberships]);

	useEffect(() => {
		if (keyword !== "") {
			const result = memberships.filter((object) => {
				return object.title.toLowerCase().startsWith(keyword.toLowerCase());
			});
			setList(result);
		} else {
			setList(memberships);
		}
	}, [keyword]);

	const activateIt = async (id) => {
		try {
			await fetchurl(
				`/extras/stripe/memberships/${id}/activateit`,
				"PUT",
				"no-cache"
			);
			toast.success("Membership activated");
			fetchMemberships();
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

	const disactivateIt = async (id) => {
		try {
			await fetchurl(
				`/extras/stripe/memberships/${id}/disactivateit`,
				"PUT",
				"no-cache"
			);
			toast.success("Membership disactivated");
			fetchMemberships();
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

	const handleDelete = async (id) => {
		try {
			await fetchurl(
				`/extras/stripe/memberships/${id}/permanently`,
				"DELETE",
				"no-cache"
			);
			toast.success("Membership deleted");
			fetchMemberships();
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

	const handleTrashAll = async () => {
		try {
			await fetchurl(`/extras/stripe/memberships/deleteall`, "PUT", "no-cache");
			toast.success("Memberships trashed");
			fetchMemberships();
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
			await fetchurl(
				`/extras/stripe/memberships/deleteall/permanently`,
				"DELETE",
				"no-cache"
			);
			toast.success("Memberships deleted");
			fetchMemberships();
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

	return (
		<>
			<AdminStatusesMenu
				allLink="/dashboard/memberships"
				publishedLink="/dashboard/memberships/published"
				draftLink="/dashboard/memberships/draft"
				scheduledLink="/dashboard/memberships/scheduled"
				trashedLink="/dashboard/memberships/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/dashboard/memberships`}
					pageText="Memberships"
					currentResults={currentResults}
					totalResults={totalResults.memberships}
					addLink={`/dashboard/memberships/create`}
					addLinkText={`membership`}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
					keyword={keyword}
					setKeyword={setKeyword}
				/>
				{list?.length > 0 ? (
					auth?.user?.stripe?.stripeChargesEnabled ? (
						<>
							<ul className="list-group list-group-flush">
								{list?.map((membership) => (
									<Single
										key={membership._id}
										object={membership}
										handleActivate={activateIt}
										handleDisactivate={disactivateIt}
										handleDelete={handleDelete}
										objects={list}
										setObjects={setMemberships}
										setTotalResults={setTotalResults}
									/>
								))}
								<li className="list-group-item">
									{page} / {totalPages}
								</li>
							</ul>
							<ClientNumericPagination
								totalPages={totalPages || Math.ceil(list.length / limit)}
								page={page}
								limit={limit}
								sortby={sortby}
								siblings={1}
								setParams={setParams}
								router={router}
							/>
						</>
					) : (
						<OnboardingLink auth={auth} />
					)
				) : (
					<div
						className={`alert alert-${
							loading ? "primary" : "danger"
						} rounded-0 m-0 border-0`}
					>
						{loading ? "Loading" : "Nothing found"}
					</div>
				)}
			</div>
		</>
	);
};

export default DashboardMembershipsIndex;
