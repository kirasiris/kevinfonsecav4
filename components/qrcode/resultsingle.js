import { Suspense } from "react";
import Link from "next/link";
import { formatDateWithoutTime } from "befree-utilities";
import Loading from "@/app/qrcode/loading";

const Single = ({ object = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
			<li
				className="list-group-item"
				style={{
					marginRight: "4px",
					marginLeft: "12px",
				}}
			>
				<div className="float-start">
					<Link
						href={{
							pathname: `/qrcode/generator`,
							query: {
								_id: object?._id,
							},
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm">{object?.title}</a>
					</Link>
				</div>
				<div className="float-end">
					<span className="badge bg-secondary me-1">
						{formatDateWithoutTime(object?.createdAt)}
					</span>
				</div>
			</li>
		</Suspense>
	);
};

export default Single;
