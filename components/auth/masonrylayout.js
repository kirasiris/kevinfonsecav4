"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import { unstable_rethrow } from "next/navigation";
import { toast } from "react-toastify";

const FALLBACK_SIZE = 800;

const MasonryLayout = ({
	setNewAvatar = async () => {},
	objects = [],
	currentId = "",
	label = "Avatar",
}) => {
	const [isPending, startTransition] = useTransition();
	const [pendingId, setPendingId] = useState("");
	const noun = label.toLowerCase();

	const choosePicture = (id) => {
		setPendingId(id);
		startTransition(async () => {
			const res = await setNewAvatar(id);

			if (res.status === "error") {
				toast.error(res.message);
				return;
			}

			if (res.status === "fail") {
				toast.error(res.message);
				return;
			}
		});
	};

	if (!objects?.length) {
		return <p className="mb-0">Your previous {noun}s will show up here.</p>;
	}

	return (
		<div className="masonry-container">
			{objects.map((object) => {
				const isCurrent = String(object._id) === String(currentId);
				return (
					<div key={object._id} className="masonry-item position-relative">
						<Image
							src={object.location.secure_location}
							alt={isCurrent ? `Current ${noun}` : `Previous ${noun}`}
							width={object.dimensions?.width || FALLBACK_SIZE}
							height={object.dimensions?.height || FALLBACK_SIZE}
							className="w-100 h-auto"
							style={{
								display: "block",
								// borderRadius: "12px",
							}}
							unoptimized
							loading="eager"
						/>
						<div className="position-absolute top-0 end-0 p-2 d-flex gap-1">
							{isCurrent ? (
								<span className="badge text-bg-success">
									<i
										aria-hidden
										className="fa-solid fa-circle-check me-1 align-middle"
									/>
									Current
								</span>
							) : (
								<button
									type="button"
									className="btn btn-secondary btn-sm"
									onClick={() => choosePicture(object._id)}
									disabled={isPending}
								>
									{isPending && pendingId === object._id
										? "Saving..."
										: `Set ${label}`}
								</button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default MasonryLayout;
