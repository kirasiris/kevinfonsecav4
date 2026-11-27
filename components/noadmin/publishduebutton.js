"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

// Pass `models={['Blog']}` to limit it to specific models; omit for all.
const PublishDueButton = ({ models }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState("Publish due Items");

	const publishDue = async () => {
		setBtnText("Publishing...");
		const res = await fetchurl(
			`/noadmin/maintenanceops/scheduler/publishdue`,
			"PUT",
			"no-cache",
			models,
			undefined,
			false,
			false,
		);

		if (res.status === "error") {
			toast.error(res.message);
			setBtnText(btnText);
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message);
			setBtnText(btnText);
			return;
		}

		if (res?.data?.total > 0) {
			toast.success(
				`Published ${res?.data?.total} item${res?.data?.total === 1 ? "" : "s"}`,
			);
		}

		setBtnText(btnText);

		router.refresh();
	};

	return (
		<div className="btn-group ms-auto">
			<button
				type="button"
				onClick={publishDue}
				className="btn btn-secondary btn-sm"
			>
				{btnText}
			</button>
			<Link
				href={{
					pathname: process.env.NEXT_PUBLIC_WEBSITE_URL,
					query: {},
				}}
				className="btn btn-secondary btn-sm"
				target="_blank"
			>
				View Site
			</Link>
		</div>
	);
};

export default PublishDueButton;
