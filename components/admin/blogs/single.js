import Image from "next/image";
import Link from "next/link";
const Single = ({ object = {} }) => {
	return (
		<li className="list-group-item">
			<div className="blog-item__panel">
				<div className="blog-item__detail">
					<div className="blog-item__info"></div>
					<h1 className="blog-item__title">
						<Link
							href={{
								pathname: "/noadmin/blogs/update/:ID",
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="blog-item__title-link">TITLE</a>
						</Link>
					</h1>
					<div className="blog-item__meta"></div>
				</div>
				<div className="blog-type-list__blog-thumbnail-wrapper has-image">
					<Link
						href={{
							pathname: "/noadmin/blogs/update/:ID",
							query: {},
						}}
						passHref
						legacyBehavior
					>
						<a className="blog-type-list__blog-thumbnail-link">
							<Image
								src="https://i0.wp.com/befreebucket-for-outputs.s3.amazonaws.com/2023/04/Changelog.jpg?ssl=1&h=160"
								className="blog-type-list__blog-thumbnail"
								alt="Blog titles image"
								width="83"
								height="63"
							/>
						</a>
					</Link>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu"></span>
				</div>
			</div>
		</li>
	);
};

export default Single;
