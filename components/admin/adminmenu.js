"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminMenu = () => {
	const pathname = usePathname();

	const isActive = (path = "") => {
		return pathname === path ? "active" : "";
	};

	return (
		<div className="col-lg-1">
			<div className="list-group">
				<Link href={"/noadmin"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin"
						)}`}
					>
						Dashboard
					</a>
				</Link>
				<Link href={"/noadmin/blogs"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/blogs"
						)}`}
					>
						Blog
					</a>
				</Link>
				<Link href={"/noadmin/themes"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/themes"
						)}`}
					>
						Themes
					</a>
				</Link>
				<Link href={"/noadmin/posts"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/posts"
						)}`}
					>
						Posts
					</a>
				</Link>
				<Link href={"/noadmin/playlists"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/playlists"
						)}`}
					>
						Playlists
					</a>
				</Link>
				<Link href={"/noadmin/videos"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/videos"
						)}`}
					>
						Videos
					</a>
				</Link>
				<Link href={"/noadmin/courses"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/courses"
						)}`}
					>
						Courses
					</a>
				</Link>
				<Link href={"/noadmin/lessons"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/lessons"
						)}`}
					>
						Lessons
					</a>
				</Link>
				<Link href={"/noadmin/users"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/users"
						)}`}
					>
						Users
					</a>
				</Link>
				<Link href={"/noadmin/comments"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/comments"
						)}`}
					>
						Comments
					</a>
				</Link>
				<Link href={"/noadmin/quizzes"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/quizzes"
						)}`}
					>
						Quizzes
					</a>
				</Link>
				<Link href={"/noadmin/emails"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/emails"
						)}`}
					>
						Emails
					</a>
				</Link>
				<Link href={"/noadmin/reports"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/reports"
						)}`}
					>
						Reports
					</a>
				</Link>
				<Link href={"/noadmin/secrets"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/secrets"
						)}`}
					>
						Secrets
					</a>
				</Link>
				<Link href={"/noadmin/files"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/files"
						)}`}
					>
						Files
					</a>
				</Link>
				<Link href={"/noadmin/categories"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/categories"
						)}`}
					>
						Categories
					</a>
				</Link>
				<Link href={"/noadmin/changelogs"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/changelogs"
						)}`}
					>
						Changelogs
					</a>
				</Link>
				<Link href={"/noadmin/newsletters"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/newsletters"
						)}`}
					>
						Newsletters
					</a>
				</Link>
				<Link href={"/noadmin/quotes"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/quotes"
						)}`}
					>
						Quotes
					</a>
				</Link>
				<Link href={"/noadmin/youtube"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/youtube"
						)}`}
					>
						Youtube
					</a>
				</Link>
				<Link href={"/noadmin/shorturls"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/shorturls"
						)}`}
					>
						Shortened Urls
					</a>
				</Link>
				<Link href={"/noadmin/logs"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/logs"
						)}`}
					>
						Logs
					</a>
				</Link>
				<Link href={"/noadmin/settings"} passHref legacyBehavior>
					<a
						className={`list-group-item list-group-item-action ${isActive(
							"/noadmin/settings"
						)}`}
					>
						Settings
					</a>
				</Link>
			</div>
		</div>
	);
};

export default AdminMenu;
