import { Suspense } from "react";
import Link from "next/link";
import Loading from "@/app/blog/loading";
import ParseHtml from "@/layout/parseHtml";

const Single = ({ object = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object?._id}`}>
				<div className={`card mb-4`}>
					<div
						className={`card-header d-flex justify-content-between bg-${
							object?.sex === "male" ? "primary" : "danger"
						}-subtle`}
					>
						<div className="float-start">
							{object?.sex === "male" && (
								<i className={`fa-solid fa-person me-1`} />
							)}
							{object?.sex === "female" && (
								<i className={`fa-solid fa-person-dress me-1`} />
							)}
							{object?.age}&nbsp;years
						</div>
						<div className="float-middle">
							<Link
								href={{
									pathname: `/secret/${object?._id}`,
									query: {},
								}}
								passHref
								legacyBehavior
							>
								<a>#{object?._id}</a>
							</Link>
						</div>
						<div className="float-end">
							{object?.nsfw === true ? "Yes" : "No"}
						</div>
					</div>
					<div className="card-body">
						{typeof object?.text === "object" ? (
							"TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED"
						) : (
							<ParseHtml text={object?.text} classList="card-text" />
						)}
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
