"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { deleteAuthTokenOnServer } from "@/helpers/setTokenOnServer";

const AdminMenu = ({ auth = {}, settings = {} }) => {
	const pathname = usePathname();

	const isActive = (path = "") => {
		return pathname === path ? " active text-bg-primary" : "";
	};

	return (
		<>
			{/* Logo/Brand */}
			<div className="d-flex align-items-center gap-2 p-3 border-bottom">
				<div
					className="text-white d-flex align-items-center justify-content-center"
					style={{
						width: 32,
						height: 32,
						backgroundImage: `url(${settings?.data?.favicon || `https://picsum.photos/32/32?blur`})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<div>
					<div className="fw-semibold">
						{process.env.NEXT_PUBLIC_WEBSITE_NAME}
					</div>
					<small>Dashboard</small>
				</div>
			</div>
			{/* Navigation */}
			<div className="py-3">
				<small className="text-uppercase fw-semibold px-3">Navigation</small>
				<nav className="nav flex-column mt-2">
					<Link
						href={{
							pathname: `/noadmin`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin`)}`}
					>
						Dashboard
					</Link>
					<Link
						href={{
							pathname: `/noadmin/animes`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/animes`)}`}
					>
						Animes
					</Link>
					<Link
						href={{
							pathname: `/noadmin/blogs`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/blogs`)}`}
					>
						Blogs
					</Link>
					<Link
						href={{
							pathname: `/noadmin/categories`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/categories`)}`}
					>
						Categories
					</Link>
					<Link
						href={{
							pathname: `/noadmin/cdalbums`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/cdalbums`)}`}
					>
						CD Albums
					</Link>
					<Link
						href={{
							pathname: `/noadmin/changelogs`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/changelogs`)}`}
					>
						Changelogs
					</Link>
					<Link
						href={{
							pathname: `/noadmin/comments`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/comments`)}`}
					>
						Comments
					</Link>
					<Link
						href={{
							pathname: `/noadmin/contactemails`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/contactemails`)}`}
					>
						Contact Emails
					</Link>
					<Link
						href={{
							pathname: `/noadmin/events`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/events`)}`}
					>
						Events
					</Link>
					<Link
						href={{
							pathname: `/noadmin/files`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/files`)}`}
					>
						Files
					</Link>
					<Link
						href={{
							pathname: `/noadmin/forums`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/forums`)}`}
					>
						Forums
					</Link>
					<Link
						href={{
							pathname: `/noadmin/logs`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/logs`)}`}
					>
						Logs
					</Link>
					<Link
						href={{
							pathname: `/noadmin/menus`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/menus`)}`}
					>
						Menus
					</Link>
					<Link
						href={{
							pathname: `/noadmin/movies`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/movies`)}`}
					>
						Movies
					</Link>
					<Link
						href={{
							pathname: `/noadmin/newsletteremails`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/newsletteremails`)}`}
					>
						Newsletter Emails
					</Link>
					<Link
						href={{
							pathname: `/noadmin/polls`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/polls`)}`}
					>
						Polls
					</Link>
					<Link
						href={{
							pathname: `/noadmin/qrcodes`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/qrcodes`)}`}
					>
						QR Code Generator
					</Link>
					<Link
						href={{
							pathname: `/noadmin/newslettersubscribers`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/newslettersubscribers`)}`}
					>
						Newsletter Subscribers
					</Link>
					<Link
						href={{
							pathname: `/noadmin/posts`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/posts`)}`}
					>
						Posts
					</Link>
					<Link
						href={{
							pathname: `/noadmin/quizzes`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/quizzes`)}`}
					>
						Quizzes
					</Link>
					<Link
						href={{
							pathname: `/noadmin/quotes`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/quotes`)}`}
					>
						Quotes
					</Link>
					<Link
						href={{
							pathname: `/noadmin/reports`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/reports`)}`}
					>
						Reports
					</Link>
					<Link
						href={{
							pathname: `/noadmin/secrets`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/secrets`)}`}
					>
						Secrets
					</Link>
					<Link
						href={{
							pathname: `/noadmin/settings`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/settings`)}`}
					>
						Settings
					</Link>
					<Link
						href={{
							pathname: `/noadmin/shorturls`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/shorturls`)}`}
					>
						Shortened Urls
					</Link>
					<Link
						href={{
							pathname: `/noadmin/snippets`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/snippets`)}`}
					>
						Snippets
					</Link>
					<Link
						href={{
							pathname: `/noadmin/themes`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/themes`)}`}
					>
						Themes
					</Link>
					<Link
						href={{
							pathname: `/noadmin/users`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/noadmin/users`)}`}
					>
						Users
					</Link>
				</nav>
			</div>
			<div className="mt-auto border-top p-3">
				<div className="d-flex align-items-center gap-2 mb-2">
					<Image
						src={
							auth?.data?.files?.avatar?.location?.secure_location ||
							`https://picsum.photos/32/32?blur`
						}
						className="rounded-circle"
						alt={`${auth?.data?.username || "Username"}'s profile's picture`}
						width={32}
						height={32}
						style={{
							objectFit: "cover",
						}}
					/>
					<div>
						<div className="fw-medium small">{auth?.data?.username}</div>
						<small>{auth?.data?.email}</small>
					</div>
				</div>
				<button
					type="button"
					className="nav-link d-flex align-items-center gap-2 text-danger"
					onClick={async () => {
						await deleteAuthTokenOnServer();
					}}
				>
					<i className="bi bi-box-arrow-right" />
					Log Out
				</button>
			</div>
		</>
	);
};

export default AdminMenu;
