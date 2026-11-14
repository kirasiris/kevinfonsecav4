"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

// Pass `models={['Blog']}` to limit it to specific models; omit for all.
const PublishDueButton = ({ models }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState("Publish due items");

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
		<button
			type="button"
			onClick={publishDue}
			className="btn btn-secondary btn-sm me-1"
		>
			{btnText}
		</button>
	);
};

export default PublishDueButton;
