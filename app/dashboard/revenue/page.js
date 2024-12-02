import { fetchurl } from "@/helpers/setTokenOnServer";
import { stripeCurrencyFormatter } from "befree-utilities";
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
				You&nbsp;get&nbsp;paid&nbsp;directly&nbsp;from&nbsp;Stripe&nbsp;to&nbsp;your&nbsp;bank&nbsp;account&nbsp;every&nbsp;48hrs.
			</p>
			<ul className="list-group list-group-flush">
				<li className="list-group-item d-flex justify-content-between align-items-center">
					<p className="m-0">Pending&nbsp;Balance</p>
					{balance?.data?.pending &&
						balance?.data?.pending.map((bp, i) => (
							<span key={i}>{stripeCurrencyFormatter(bp.amount, "USD")}</span>
						))}
				</li>
				<li className="list-group-item d-flex justify-content-between align-items-center">
					<p className="m-0">
						Update&nbsp;your&nbsp;Stripe&nbsp;account&nbsp;details&nbsp;or&nbsp;view&nbsp;your&nbsp;previous&nbsp;payouts.
					</p>
					<form action={fetchStripeAccountSettings}>
						<button type="submit" className="btn btn-link btn-sm">
							Payout settings
						</button>
					</form>
					<p className="m-0">
						You&nbsp;have&nbsp;to&nbsp;
						<b className="text-bg-primary text-decoration-underline">
							wait&nbsp;a&nbsp;few&nbsp;seconds&nbsp;after&nbsp;clicking&nbsp;the&nbsp;link&nbsp;above&nbsp;before&nbsp;being&nbsp;redirected.
						</b>
					</p>
				</li>
			</ul>
		</div>
	);
};

export default RevenueIndex;
