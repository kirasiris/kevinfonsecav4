"use client";
import { useMemo, useRef } from "react";
import UseDropzone from "@/components/global/dropzone";
import List from "@/components/noadmin/files/list";
import { UploadBridgeContext } from "@/context/uploadbridgecontext";
import AdminCardHeaderMenu from "./filecardheadermenu";

const FilesWorkSpace = ({
	auth = {},
	token = {},
	onModel = "Blog",
	allLink = "",
	pageText = "",
	searchOn = "",
	objects = [],
	searchParams = {},
	handleDeleteAllFunction = () => {},
	handleDeleteAllUnusedPermanently = () => {},
}) => {
	// Lazy-init the subscriber set so it is allocated exactly once per mount
	const subscribersRef = useRef(null);
	if (subscribersRef.current === null) {
		subscribersRef.current = new Set();
	}

	const bridge = useMemo(
		() => ({
			subscribe(fn) {
				subscribersRef.current.add(fn);
				return () => subscribersRef.current.delete(fn);
			},
			publish(file) {
				subscribersRef.current.forEach((fn) => fn(file));
			},
		}),
		[],
	);
	return (
		<UploadBridgeContext.Provider value={bridge}>
			<div className="card rounded-0 mb-1">
				<AdminCardHeaderMenu
					allLink={allLink}
					pageText={pageText}
					currentResults={objects?.count}
					totalResults={objects?.countAll}
					searchOn={searchOn}
					handleDeleteAllFunction={handleDeleteAllFunction}
					handleDeleteAllUnusedPermanently={handleDeleteAllUnusedPermanently}
					classList="border-bottom-0"
				/>
			</div>
			<div className="container">
				<UseDropzone auth={auth} token={token} onModel={onModel} />
				<List objects={objects} searchParams={searchParams} />
			</div>
		</UploadBridgeContext.Provider>
	);
};

export default FilesWorkSpace;
