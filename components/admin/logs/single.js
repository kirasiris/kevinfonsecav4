import DropdownButton from "react-bootstrap/DropdownButton";
import Link from "next/link";
import DeleteModal from "@/layout/deletemodal";

const Single = ({
	object = {},
	handleDelete,
	objects,
	setObjects,
	setTotalResults,
}) => {
	return (
		<li className="list-group-item">
			<div className="blog-item__panel">
				<div className="blog-item__detail">
					<div className="blog-item__info"></div>
					<h1 className="blog-item__title">
						<Link
							href={{
								pathname: `/noadmin/logs/update/${object._id}`,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="blog-item__title-link">{object.message}</a>
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="blog-item__meta-time-status">
							<div
								className="blog-relative-time-status"
								title={`${object.createdAt}`}
							>
								<a
									className="blog-relative-time-status__link"
									href={`/logs/${object._id}`}
								>
									<span className="blog-relative-time-status__time">
										{/* <svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											className="gridicon gridicons-time"
											height="12"
											width="12"
										>
											<use xlink:href="/calypso/images/../images/gridicons-47c7fb356fcb2d963681.svg#gridicons-time"></use>
										</svg> */}
										<time
											className="blog-relative-time-status__time-text"
											datetime="2023-07-29T21:55:36-04:00"
										>
											{object.createdAt}
										</time>
									</span>
								</a>
							</div>
						</span>
						<ul className="blog-action-counts">
							<li>{object.error.statusCode}</li>
							<li>{object.error.status}</li>
							<li>{object.error.isOperacional}</li>
						</ul>
					</div>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
							<DeleteModal
								id={object._id ? object._id : object._id}
								action={handleDelete}
								classStr={`dropdown-item`}
								objects={objects}
								setObjects={setObjects}
								setTotalResults={setTotalResults}
							/>
						</DropdownButton>
					</span>
				</div>
			</div>
		</li>
	);
};

export default Single;
