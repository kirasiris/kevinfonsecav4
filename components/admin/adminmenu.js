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
					<Link href={"/noadmin"}>Dashboard</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/animes`)}`}>
					<Link href={"/noadmin/animes"}>Animes</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/blogs`)}`}>
					<Link href={"/noadmin/blogs"}>Blog</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/categories`)}`}>
					<Link href={"/noadmin/categories"}>Categories</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/cdalbums`)}`}>
					<Link href={"/noadmin/cdalbums"}>CD Albums</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/changelogs`)}`}>
					<Link href={"/noadmin/changelogs"}>Changelogs</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/comments`)}`}>
					<Link href={"/noadmin/comments"}>Comments</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/companies`)}`}>
					<Link href={"/noadmin/companies"}>Companies</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/contactemails`)}`}>
					<Link href={"/noadmin/contactemails"}>Contact Emails</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/courses`)}`}>
					<Link href={"/noadmin/courses"}>Courses</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/events`)}`}>
					<Link href={"/noadmin/events"}>Events</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/files`)}`}>
					<Link href={"/noadmin/files"}>Files</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/forums`)}`}>
					<Link href={"/noadmin/forums"}>Forums</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/logs`)}`}>
					<Link href={"/noadmin/logs"}>Logs</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/memberships`)}`}>
					<Link href={"/noadmin/memberships"}>Memberships</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/menus`)}`}>
					<Link href={"/noadmin/menus"}>Menus</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/movies`)}`}>
					<Link href={"/noadmin/movies"}>Movies</Link>
				</li>
				<li
					className={`list-group-item ${isActive(`/noadmin/newsletteremails`)}`}
				>
					<Link href={"/noadmin/newsletteremails"}>Newsletter Emails</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/polls`)}`}>
					<Link href={"/noadmin/polls"}>Polls</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/qrcodes`)}`}>
					<Link href={"/noadmin/qrcodes"}>QR Code Generator</Link>
				</li>
				<li
					className={`list-group-item ${isActive(
						`/noadmin/newslettersubscribers`
					)}`}
				>
					<Link href={"/noadmin/newslettersubscribers"}>
						Newsletter Subscribers
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/posts`)}`}>
					<Link href={"/noadmin/posts"}>Posts</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/quizzes`)}`}>
					<Link href={"/noadmin/quizzes"}>Quizzes</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/quotes`)}`}>
					<Link href={"/noadmin/quotes"}>Quotes</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/realstates`)}`}>
					<Link href={"/noadmin/realstates"}>Real State</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/reports`)}`}>
					<Link href={"/noadmin/reports"}>Reports</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/reviews`)}`}>
					<Link href={"/noadmin/reviews"}>Reviews</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/secrets`)}`}>
					<Link href={"/noadmin/secrets"}>Secrets</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/settings`)}`}>
					<Link href={"/noadmin/settings"}>Settings</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/shorturls`)}`}>
					<Link href={"/noadmin/shorturls"}>Shortened Urls</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/snippets`)}`}>
					<Link href={"/noadmin/snippets"}>Snippets</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/themes`)}`}>
					<Link href={"/noadmin/themes"}>Themes</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/users`)}`}>
					<Link href={"/noadmin/users"}>Users</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/videos`)}`}>
					<Link href={"/noadmin/videos"}>Videos</Link>
				</li>
				<li className={`list-group-item ${isActive(`/noadmin/youtube`)}`}>
					<Link href={"/noadmin/youtube"}>Youtube</Link>
				</li>
			</ul>
		</div>
	);
};

export default AdminMenu;
