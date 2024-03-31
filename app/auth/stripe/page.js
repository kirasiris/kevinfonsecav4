"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";

const StripeSettings = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [stripeData, setStripeData] = useState({
		stripeCustomerId: null,
		stripeAccountId: null,
		stripeChargesEnabled: false,
		stripeOnboardingLink: undefined,
		latestStripeCheckoutLink: undefined,
	});

	const {
		stripeCustomerId,
		stripeAccountId,
		stripeChargesEnabled,
		stripeOnboardingLink,
		latestStripeCheckoutLink,
	} = stripeData;

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [btnText, setBtnText] = useState(`Request OnBoardLink`);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetchurl(`/auth/me`, "GET", "no-cache");
				setProfile(res?.data);
				setStripeData({
					stripeCustomerId: res?.data?.stripe?.stripeCustomerId,
					stripeAccountId: res?.data?.stripe?.stripeAccountId,
					stripeChargesEnabled: res?.data?.stripe?.stripeChargesEnabled,
					stripeOnboardingLink: res?.data?.stripe?.stripeOnboardingLink,
					latestStripeCheckoutLink: res?.data?.stripe?.latestStripeCheckoutLink,
				});
				setLoading(false);
			} catch (err) {
				console.log(err);
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
		fetchUser();
	}, [loading]);

	const assignStripeOnBoardingLink = async (e) => {
		e.preventDefault();
		try {
			setBtnText("Request OnBoardLink...");
			const res = await fetchurl(
				`/extras/stripe/accounts/${auth?.user?._id}/assignstripeonboardinglink`,
				"PUT",
				"no-cache",
				{
					website: "beFree",
				}
			);
			setStripeData({
				...stripeData,
				stripeOnboardingLink: res.stripe.url,
			});
			setBtnText(btnText);
		} catch (err) {
			console.log(err);
			setError(true);
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

	return loading || profile === null || profile === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">
							<div className="float-start">
								<p className="m-1">Stripe&nbsp;Settings</p>
							</div>
							<div className="float-end">
								{stripeOnboardingLink !== "" &&
									stripeOnboardingLink !== undefined &&
									stripeOnboardingLink !== null && (
										<button
											type="button"
											className="btn btn-secondary btn-sm"
											onClick={assignStripeOnBoardingLink}
										>
											{btnText}
										</button>
									)}
							</div>
						</div>
						<ul className="list-group list-group-flush">
							{stripeCustomerId !== "" &&
								stripeCustomerId !== undefined &&
								stripeCustomerId !== null && (
									<li className="list-group-item">
										Customer&nbsp;ID:&nbsp;<code>{stripeCustomerId}</code>
									</li>
								)}
							{stripeAccountId !== "" &&
								stripeAccountId !== undefined &&
								stripeAccountId !== null && (
									<li className="list-group-item">
										Account&nbsp;ID:&nbsp;<code>{stripeAccountId}</code>
									</li>
								)}
							<li className="list-group-item">
								Charges&nbsp;Enabled:&nbsp;
								<code>{stripeChargesEnabled.toString()}</code>
							</li>
							{stripeOnboardingLink !== "" &&
								stripeOnboardingLink !== undefined &&
								stripeOnboardingLink !== null && (
									<li className="list-group-item">
										OnBoarding&nbsp;Link:&nbsp;
										<code>{stripeOnboardingLink}</code>
									</li>
								)}
							{latestStripeCheckoutLink !== "" &&
								latestStripeCheckoutLink !== undefined &&
								latestStripeCheckoutLink !== null && (
									<li className="list-group-item">
										Latest&nbsp;Checkout&nbsp;Link:&nbsp;
										<code>{latestStripeCheckoutLink}</code>
									</li>
								)}
						</ul>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default StripeSettings;
