"use client";
import Link from "next/link";

const ErrorPage = ({ statusCode, statusCodeMessage = "" }) => {
	return (
		<div className="container error-container">
			<div className="row">
				<div className="col-md-6">
					<div className="error-template mb-5 mt-5 pb-5 pt-5">
						<h1>:) Oops!</h1>
						<h2>Temporarily down for maintenance</h2>
						<h3>We&apos;ll be back soon!</h3>
						<p>
							Sorry for the inconvenience but we&apos;re performing some
							maintenance at the moment. we&apos;ll be back online shortly!
						</p>
						<p>
							—{" "}
							<a
								className="btn btn-link"
								href={`mailto:${process.env.NEXT_PUBLIC_WEBSITE_EMAIL}`}
							>
								Kevin Uriel Fonseca
							</a>
						</p>
						<div className="display-6 fw-bold text-uppercase">
							<h4>
								{statusCode
									? `An error ${statusCode} occurred on server`
									: "An error occurred on client"}
							</h4>
							<p>{statusCodeMessage}</p>
						</div>
						<div className="error-actions">
							<Link
								href={{
									pathname: `/`,
									query: {},
								}}
								style={{ marginTop: "10px" }}
								className="btn btn-secondary btn-sm"
							>
								<span className="glyphicon glyphicon-home"></span>Take Me Home
							</Link>
						</div>
					</div>
				</div>
				<div className="col-md-6">
					<svg
						className="svg-box"
						width="380px"
						height="500px"
						viewBox="0 0 837 1045"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						xmlnssketch="http://www.bohemiancoding.com/sketch/ns"
					>
						<g
							id="Page-1"
							stroke="none"
							strokeWidth="1"
							fill="none"
							fillRule="evenodd"
							sketchtype="MSPage"
						>
							<path
								d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z"
								id="Polygon-1"
								stroke="#3bafda"
								strokeWidth="6"
								sketchtype="MSShapeGroup"
							></path>
							<path
								d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z"
								id="Polygon-2"
								stroke="#7266ba"
								strokeWidth="6"
								sketchtype="MSShapeGroup"
							></path>
							<path
								d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z"
								id="Polygon-3"
								stroke="#f76397"
								strokeWidth="6"
								sketchtype="MSShapeGroup"
							></path>
							<path
								d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z"
								id="Polygon-4"
								stroke="#00b19d"
								strokeWidth="6"
								sketchtype="MSShapeGroup"
							></path>
							<path
								d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z"
								id="Polygon-5"
								stroke="#ffaa00"
								strokeWidth="6"
								sketchtype="MSShapeGroup"
							></path>
						</g>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default ErrorPage;
