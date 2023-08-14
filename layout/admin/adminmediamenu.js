"use client";
import Link from "next/link";

const AdminMediaLibraryMenu = ({
	allLink = "",
	imagesLink = "",
	documentsLink = "",
	videosLink = "",
	audioLink = "",
}) => {
	return (
		<div
			className="mb-3"
			style={{
				padding: "0.5rem 1rem",
				backgroundColor: "#f8f8f8",
				border: "1px solid rgba(0, 0, 0, 0.175)",
			}}
		>
			<Link
				href={{
					pathname: allLink,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-link btn-sm">All</a>
			</Link>
			<Link
				href={{
					pathname: imagesLink,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-link btn-sm">Images</a>
			</Link>
			<Link
				href={{
					pathname: documentsLink,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-link btn-sm">Documents</a>
			</Link>
			<Link
				href={{
					pathname: videosLink,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-link btn-sm">Videos</a>
			</Link>
			<Link
				href={{
					pathname: audioLink,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-link btn-sm">Audio</a>
			</Link>
		</div>
	);
};

export default AdminMediaLibraryMenu;
