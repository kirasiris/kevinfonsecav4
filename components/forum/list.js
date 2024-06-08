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
													pathname: `/forum/programming/assembly`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">Assembly</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/c`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">C</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/cplus`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">C+</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/csharp`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">C#</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/cobol`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">Cobol</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/delphi`,
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
													DELPHI/OBJECT PASCAL
												</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/fortran`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">FORTRAN</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/go`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">GO</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/java`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">JAVA</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/javascript`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">JAVASCRIPT</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/kotlin`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">KOTLIN</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/matlab`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">MATLAB</a>
											</Link>
										</li>
									</ul>
								</div>
								<div className="col">
									<ul className="list-unstyled">
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/php`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">PHP</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/python`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">PYTHON</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/ruby`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">RUBY</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/rust`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">RUST</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/sql`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">SQL</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/swift`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">SWIFT</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/scratch`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">SCRATCH</a>
											</Link>
										</li>
										<li className="list-group-item">
											<Link
												href={{
													pathname: `/forum/programming/visual-basics`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
												passHref
												legacyBehavior
											>
												<a className="btn btn-sm btn-link">VISUAL BASICS</a>
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
