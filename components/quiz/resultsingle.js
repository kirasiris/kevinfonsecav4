import { Suspense } from "react";
import Link from "next/link";
import { formatDateWithoutTime } from "befree-utilities";
import Loading from "@/app/quiz/loading";

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
							pathname: `/quiz/results/${object?._id}`,
							query: {},
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm">{object?.resourceId.title}</a>
					</Link>
				</div>
				<div className="float-end">
					<span className="badge bg-secondary me-1">
						{object?.score} of {object?.totalQuestions}
					</span>
					<span className="badge bg-secondary me-1">
						{formatDateWithoutTime(object?.createdAt)}
					</span>
				</div>
			</li>
		</Suspense>
	);
};

export default Single;
