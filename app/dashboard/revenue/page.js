"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
// SINGLE
import { AuthContext } from "@/helpers/globalContext";
import { stripeCurrencyFormatter } from "@/helpers/utilities";

const RevenueIndex = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [balance, setBalance] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchBalance = async () => {
		try {
			const res = await fetchurl(
				`/extras/stripe/accounts/balance`,
				"GET",
				"no-cache"
			);
			console.log("balance withing balance file", balance);
			setBalance(res?.data);
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
		fetchBalance();
	}, [router]);

	const fetchStripeAccountSettings = async () => {
		try {
			const res = await fetchurl(
				`/extras/stripe/accounts/payoutsettings`,
				"GET",
				"no-cache"
			);
			console.log("Created link", res);
			// window.location.href = res;
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
		<div className="card">
			<div className="card-header">Revenue</div>
			<div className="card-body">
				<p className="lead mb-0">
					You get paid directly from Stripe to your bank account every 48hrs.
				</p>
				<ul className="list-group list-group-flush">
					<li className="list-group-item d-flex justify-content-between align-items-center">
						<p className="m-0">Pending Balance</p>
						{!loading &&
							balance.pending &&
							balance.pending.map((bp, i) => (
								<span key={i}>{stripeCurrencyFormatter(bp, "USD")}</span>
							))}
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-center">
						<p className="m-0">
							Update your Stripe account details or view your previous payouts.
						</p>
						<button
							className="btn btn-link btn-sm"
							onClick={() => fetchStripeAccountSettings()}
						>
							Payout settings
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default RevenueIndex;
