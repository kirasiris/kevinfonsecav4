import { notFound, redirect } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import FormButtons from "@/components/global/formbuttons";

async function getNewsletterSubscriber(params) {
	const res = await fetchurl(
		`/global/newslettersubscribers${params}`,
		"GET",
		"no-cache"
	);
	if (!res.success) notFound();
	return res;
}

const UpdateNewsletterSubscriber = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const newslettersubscriber = await getNewsletterSubscriber(
		`/${awtdParams.id}`
	);

	const upgradeNewsletterSubscriber = async (formData) => {
		"use server";
		const rawFormData = {
			email: formData.get("email"),
		};
		await fetchurl(
			`/noadmin/newslettersubscribers/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/newslettersubscribers`);
	};

	return (
		<form className="row" action={upgradeNewsletterSubscriber}>
			<div className="col">
				<label htmlFor="email" className="form-label">
					Email
				</label>
				<input
					id="email"
					name="email"
					defaultValue={newslettersubscriber?.data?.email}
					type="email"
					className="form-control mb-3"
					placeholder=""
				/>
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateNewsletterSubscriber;
