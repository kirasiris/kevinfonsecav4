"use client";
import { Suspense } from "react";
import Accordion from "react-bootstrap/Accordion";
import Loading from "@/app/changelog/loading";
import ParseHtml from "@/layout/parseHtml";
import Link from "next/link";

const Single = ({ object = {}, imageWidth = "415", imageHeight = "207" }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object?._id}`}>
				<Accordion>
					<Accordion.Item eventKey={object?._id} className="rounded-0">
						<Accordion.Header>
							{object?.postType.map((c) => (
								<small key={c} className="badge bg-secondary rounded-pill me-3">
									{c}
								</small>
							))}
							{object?.title || "Untitled"}
						</Accordion.Header>
						<Accordion.Body>
							{typeof object?.text === "object" ? (
								"TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED"
							) : (
								<ParseHtml text={object?.text} classList="card-text" />
							)}
							<hr />
							<Link
								href={`/changelog/${object?._id}/${object?.slug}`}
								className="btn btn-link border-secondary"
							>
								&gt;&gt;&nbsp;{object?.title || "Untitled"}
							</Link>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</article>
		</Suspense>
	);
};

export default Single;
