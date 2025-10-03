"use client";
import AdminCardHeaderMenu from "@/components/noadmin/admincardheadermenu";
import Single from "./filesingle";
import NothingFoundAlert from "@/layout/nothingfoundalert";

const FileList = ({ allLink = "", pageText = "", objects = [] }) => {
	return (
		<>
			<AdminCardHeaderMenu
				allLink={allLink}
				pageText={pageText}
				currentResults={objects?.count}
				totalResults={objects?.countAll}
				addLink=""
				searchOn=""
				handleTrashAllFunction=""
				handleDeleteAllFunction=""
				classList=""
			/>
			{objects?.length > 0 ? (
				<ul
					className="list-group list-group-flush"
					style={{ maxHeight: "1000px" }}
				>
					{objects?.map((file) => (
						<Single key={file._id} object={file} />
					))}
				</ul>
			) : (
				<NothingFoundAlert
					classList="alert-danger rounded-0 m-0 border-0"
					text={`Nothing found`}
				/>
			)}
		</>
	);
};

export default FileList;
