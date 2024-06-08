import { fetchurl } from "@/helpers/setTokenOnServer";
import { stripeCurrencyFormatter } from "@/helpers/utilities";
import { redirect } from "next/navigation";

async function getBalance() {
	const res = await fetchurl(
		`/extras/stripe/accounts/balance`,
		"GET",
		"no-cache"
	);
	return res;
}

const RevenueIndex = async ({ params, searchParams }) => {
	const balance = await getBalance();

	const fetchStripeAccountSettings = async (formData) => {
		"use server";
		// const rawFormData = {}
		const res = await fetchurl(
			`/extras/stripe/accounts/payoutsettings`,
			"GET",
			"no-cache"
		);
		redirect(res.data.url);
	};

	return (
		<div className="card">
			<div className="card-header">Revenue</div>
			<p className="lead p-within-card-without-body mb-0">
				You get paid directly from Stripe to your bank account every 48hrs.
			</p>
			<ul className="list-group list-group-flush">
				<li className="list-group-item d-flex justify-content-between align-items-center">
					<p className="m-0">Pending Balance</p>
					{balance?.data?.pending &&
						balance?.data?.pending.map((bp, i) => (
							<span key={i}>{stripeCurrencyFormatter(bp.amount, "USD")}</span>
						))}
				</li>
				<li className="list-group-item d-flex justify-content-between align-items-center">
					<p className="m-0">
						Update your Stripe account details or view your previous payouts.
					</p>
					<form action={fetchStripeAccountSettings}>
						<button type="submit" className="btn btn-link btn-sm">
							Payout settings
						</button>
					</form>
				</li>
			</ul>
		</div>
	);
};

export default RevenueIndex;
