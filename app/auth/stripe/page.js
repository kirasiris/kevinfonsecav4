import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import { revalidatePath } from "next/cache";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const StripeSettings = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const assignStripeOnBoardingLink = async (formData) => {
		"use server";
		// const rawFormData = {};
		await fetchurl(
			`/extras/stripe/accounts/${auth.data._id}/assignstripeonboardinglink`,
			"PUT",
			"no-cache",
			{
				website: "beFree",
			}
		);
		revalidatePath(`/auth/stripe`);
	};

	return (
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
								{auth.data.stripe.stripeOnboardingLink !== "" &&
									auth.data.stripe.stripeOnboardingLink !== undefined &&
									auth.data.stripe.stripeOnboardingLink !== null && (
										<form action={assignStripeOnBoardingLink}>
											<button
												type="submit"
												className="btn btn-secondary btn-sm"
											>
												Request OnBoardLink
											</button>
										</form>
									)}
							</div>
						</div>
						<ul className="list-group list-group-flush">
							{auth.data.stripe.stripeCustomerId !== "" &&
								auth.data.stripe.stripeCustomerId !== undefined &&
								auth.data.stripe.stripeCustomerId !== null && (
									<li className="list-group-item">
										Customer&nbsp;ID:&nbsp;
										<code>{auth.data.stripe.stripeCustomerId}</code>
									</li>
								)}
							{auth.data.stripe.stripeAccountId !== "" &&
								auth.data.stripe.stripeAccountId !== undefined &&
								auth.data.stripe.stripeAccountId !== null && (
									<li className="list-group-item">
										Account&nbsp;ID:&nbsp;
										<code>{auth.data.stripe.stripeAccountId}</code>
									</li>
								)}
							<li className="list-group-item">
								Charges&nbsp;Enabled:&nbsp;
								<code>{auth.data.stripe.stripeChargesEnabled.toString()}</code>
							</li>
							{auth.data.stripe.stripeOnboardingLink !== "" &&
								auth.data.stripe.stripeOnboardingLink !== undefined &&
								auth.data.stripe.stripeOnboardingLink !== null && (
									<li className="list-group-item">
										OnBoarding&nbsp;Link:&nbsp;
										<code>{auth.data.stripe.stripeOnboardingLink}</code>
									</li>
								)}
							{auth.data.stripe.latestStripeCheckoutLink !== "" &&
								auth.data.stripe.latestStripeCheckoutLink !== undefined &&
								auth.data.stripe.latestStripeCheckoutLink !== null && (
									<li className="list-group-item">
										Latest&nbsp;Checkout&nbsp;Link:&nbsp;
										<code>{auth.data.stripe.latestStripeCheckoutLink}</code>
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
