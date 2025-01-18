"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminMenu = () => {
	const pathname = usePathname();

	const isActive = (path = "") => {
		return pathname === path ? " active" : "";
	};

	return (
		<div className="col-lg-1 mb-3">
			<ul className="list-group">
				<li className={`list-group-item ${isActive(`/noadmin`)}`}>
					<Link href={"/noadmin"} passHref legacyBehavior>
						<a>Dashboard</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/animes`)}`}>
					<Link href={"/noadmin/animes"} passHref legacyBehavior>
						<a>Animes</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/blogs`)}`}>
					<Link href={"/noadmin/blogs"} passHref legacyBehavior>
						<a>Blog</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/categories`)}`}>
					<Link href={"/noadmin/categories"} passHref legacyBehavior>
						<a>Categories</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/cdalbums`)}`}>
					<Link href={"/noadmin/cdalbums"} passHref legacyBehavior>
						<a>CD Albums</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/changelogs`)}`}>
					<Link href={"/noadmin/changelogs"} passHref legacyBehavior>
						<a>Changelogs</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/comments`)}`}>
					<Link href={"/noadmin/comments"} passHref legacyBehavior>
						<a>Comments</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/companies`)}`}>
					<Link href={"/noadmin/companies"} passHref legacyBehavior>
						<a>Companies</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/courses`)}`}>
					<Link href={"/noadmin/courses"} passHref legacyBehavior>
						<a>Courses</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/emails`)}`}>
					<Link href={"/noadmin/emails"} passHref legacyBehavior>
						<a>Emails</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/files`)}`}>
					<Link href={"/noadmin/files"} passHref legacyBehavior>
						<a>Files</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/forums`)}`}>
					<Link href={"/noadmin/forums"} passHref legacyBehavior>
						<a>Forums</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/logs`)}`}>
					<Link href={"/noadmin/logs"} passHref legacyBehavior>
						<a>Logs</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/memberships`)}`}>
					<Link href={"/noadmin/memberships"} passHref legacyBehavior>
						<a>Memberships</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/menus`)}`}>
					<Link href={"/noadmin/menus"} passHref legacyBehavior>
						<a>Menus</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/movies`)}`}>
					<Link href={"/noadmin/movies"} passHref legacyBehavior>
						<a>Movies</a>
					</Link>
				</li>
				<li
					className={`list-group-item ${isActive(`/noadmin/newsletteremails`)}`}
				>
					<Link href={"/noadmin/newsletteremails"} passHref legacyBehavior>
						<a>Newsletter Emails</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/polls`)}`}>
					<Link href={"/noadmin/polls"} passHref legacyBehavior>
						<a>Polls</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/qrcodes`)}`}>
					<Link href={"/noadmin/qrcodes"} passHref legacyBehavior>
						<a>QR Code Generator</a>
					</Link>
				</li>
				<li
					className={`list-group-item ${isActive(
						`/noadmin/newslettersubscribers`
					)}`}
				>
					<Link href={"/noadmin/newslettersubscribers"} passHref legacyBehavior>
						<a>Newsletter Subscribers</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/posts`)}`}>
					<Link href={"/noadmin/posts"} passHref legacyBehavior>
						<a>Posts</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/quizzes`)}`}>
					<Link href={"/noadmin/quizzes"} passHref legacyBehavior>
						<a>Quizzes</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/quotes`)}`}>
					<Link href={"/noadmin/quotes"} passHref legacyBehavior>
						<a>Quotes</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/realstates`)}`}>
					<Link href={"/noadmin/realstates"} passHref legacyBehavior>
						<a>Real State</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/reports`)}`}>
					<Link href={"/noadmin/reports"} passHref legacyBehavior>
						<a>Reports</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/secrets`)}`}>
					<Link href={"/noadmin/secrets"} passHref legacyBehavior>
						<a>Secrets</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/settings`)}`}>
					<Link href={"/noadmin/settings"} passHref legacyBehavior>
						<a>Settings</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/shorturls`)}`}>
					<Link href={"/noadmin/shorturls"} passHref legacyBehavior>
						<a>Shortened Urls</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/snippets`)}`}>
					<Link href={"/noadmin/snippets"} passHref legacyBehavior>
						<a>Snippets</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/subscribers`)}`}>
					<Link href={"/noadmin/subscribers"} passHref legacyBehavior>
						<a>Subscribers</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/themes`)}`}>
					<Link href={"/noadmin/themes"} passHref legacyBehavior>
						<a>Themes</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/users`)}`}>
					<Link href={"/noadmin/users"} passHref legacyBehavior>
						<a>Users</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/videos`)}`}>
					<Link href={"/noadmin/videos"} passHref legacyBehavior>
						<a>Videos</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/youtube`)}`}>
					<Link href={"/noadmin/youtube"} passHref legacyBehavior>
						<a>Youtube</a>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default AdminMenu;
