"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { deleteAuthTokenOnServer } from "@/helpers/setTokenOnServer";

const NFAMenu = ({ auth = {}, settings = {} }) => {
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
							pathname: `/nfabusiness`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/nfabusiness`)}`}
					>
						Dashboard
					</Link>
					<Link
						href={{
							pathname: `/nfabusiness/acquisitionsdisposals`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/nfabusiness/acquisitionsdisposals`)}`}
					>
						Acquisition and Disposals
					</Link>
					<Link
						href={{
							pathname: `/nfabusiness/companies`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/nfabusiness/companies`)}`}
					>
						Companies
					</Link>
					<Link
						href={{
							pathname: `/nfabusiness/courses`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/nfabusiness/courses`)}`}
					>
						Courses
					</Link>
					<Link
						href={{
							pathname: `/nfabusiness/memberships`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/nfabusiness/memberships`)}`}
					>
						Memberships
					</Link>
					<Link
						href={{
							pathname: `/nfabusiness/products`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/nfabusiness/products`)}`}
					>
						Products
					</Link>
					<Link
						href={{
							pathname: `/nfabusiness/realestates`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/nfabusiness/realestates`)}`}
					>
						Real Estate
					</Link>
					<Link
						href={{
							pathname: `/nfabusiness/reviews`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/nfabusiness/reviews`)}`}
					>
						Service Reviews
					</Link>
					<Link
						href={{
							pathname: `/nfabusiness/serviceemails`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/nfabusiness/serviceemails`)}`}
					>
						Service Requests
					</Link>
					<Link
						href={{
							pathname: `/nfabusiness/weapons`,
							query: {},
						}}
						className={`nav-link d-flex align-items-center gap-2 ${isActive(`/nfabusiness/weapons`)}`}
					>
						Weapons
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

export default NFAMenu;
