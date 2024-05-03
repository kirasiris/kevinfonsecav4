"use client";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Sidebar from "@/layout/forum/sidebar";
import Globalcontent from "@/layout/content";
import Link from "next/link";

const List = ({
	featured = {},
	objects = [],
	searchParams = {},
	categories = [],
	quotes = [],
}) => {
	return (
		<div className="container">
			<div className="row">
				<Globalcontent containerClasses="col-lg-8">
					<div className="card mb-4">
						<div className="card-header">Programming</div>
						<div className="card-body">
							<div className="row">
								<h6>A</h6>
								<div className="col">
									<ul className="list-unstyled">
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/asharp`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">A#</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/azero`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">A-0</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/aplus`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">A+</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/abab`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">ABAB</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/abc`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">ABC</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/abcalgol`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">ABC ALGOL</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/acc`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">ACC</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/accent`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">
													Accent (Rational Synergy)
												</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/ace`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">ACE / DASL</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/action`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">Action!</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/actionscript`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">Action Script</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/actor`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">Actor</a>
											</Link>
										</li>
									</ul>
								</div>
								<div className="col">
									<ul className="list-unstyled">
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/asharp`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">A#</a>
											</Link>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div className="card mb-4">
						<div className="card-header">External Resources</div>
						<div className="card-body p-0">
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/externalresources/spotlight`,
											query: {
												page: 1,
												limit: 10,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-sm btn-link">Spotlight</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/externalresources/learnmore`,
											query: {
												page: 1,
												limit: 10,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-sm btn-link">Learn More</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/externalresources/jobs`,
											query: {
												page: 1,
												limit: 10,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-sm btn-link">Jobs</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/externalresources/addins`,
											query: {
												page: 1,
												limit: 10,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-sm btn-link">Addins</a>
									</Link>
								</li>
							</ul>
						</div>
					</div>
					{/* Featured list */}
					{featured?.data?.length > 0 &&
						featured.data.map((featured) => (
							<Single key={featured._id} object={featured} fullWidth={true} />
						))}
					{/* Blog list */}
					<div className="row">
						{objects?.data?.length > 0 ? (
							<>
								{objects.data?.map((blog) => (
									<Single key={blog._id} object={blog} />
								))}
								<NumericPagination
									totalPages={
										objects?.pagination?.totalpages ||
										Math.ceil(objects?.data?.length / searchParams.limit)
									}
									page={searchParams.page}
									limit={searchParams.limit}
									keyword={searchParams.keyword}
									sortby="-createdAt"
									siblings={1}
									// postType="blog"
								/>
							</>
						) : (
							<NothingFoundAlert />
						)}
					</div>
				</Globalcontent>
				<Sidebar quotes={quotes} />
			</div>
		</div>
	);
};

export default List;
