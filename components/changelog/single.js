"use client";
import { Suspense } from "react";
import Accordion from "react-bootstrap/Accordion";
import Loading from "@/app/changelog/loading";
import ParseHtml from "@/layout/parseHtml";

const Single = ({
	changelog = {},
	imageWidth = "415",
	imageHeight = "207",
}) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${changelog._id}`}>
				<Accordion>
					<Accordion.Item eventKey={changelog._id} className="rounded-0">
						<Accordion.Header>
							{changelog.postType.map((c) => (
								<small key={c} className="badge bg-secondary rounded-pill me-3">
									{c}
								</small>
							))}
							{changelog.title}
						</Accordion.Header>
						<Accordion.Body>
							<ParseHtml text={changelog.text} />
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</article>
		</Suspense>
	);
};

export default Single;
