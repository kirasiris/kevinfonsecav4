"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetchurl } from "@/helpers/setTokenOnServer";

const API = "/api/v1/fediverse";

const ERRORS = {
	denied: "The fediverse login was cancelled or failed. Please try again.",
	expired: "That connection attempt expired. Please try again.",
	"already-linked":
		"That fediverse account is already connected to another user.",
	"hosted-enabled":
		"Turn off your profile on this site before connecting an existing account.",
	unavailable: "Connecting is unavailable right now. Please try again later.",
};

const request = async (url, method = "GET", body) => {
	const res = await fetchurl(url, method, "no-store", body);
	if (!res?.success) {
		throw new Error(res?.error || res?.message || "Request failed");
	}
	return res.data;
};

function HostedProfile({ data, pending, onToggle }) {
	const [copied, setCopied] = useState(false);

	const onCopy = async () => {
		await navigator.clipboard.writeText(data.handle);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<>
			<div className="form-check form-switch mb-3">
				<input
					id="fediverse-enabled"
					className="form-check-input"
					type="checkbox"
					role="switch"
					checked={Boolean(data?.enabled)}
					onChange={onToggle}
					disabled={pending}
				/>
				<label className="form-check-label" htmlFor="fediverse-enabled">
					Publish my public posts from a profile on this site
				</label>
			</div>

			{data?.enabled ? (
				<>
					<p className="mb-2">
						People can follow you from any fediverse app at:
					</p>
					<div className="input-group mb-2">
						<input
							className="form-control"
							value={data.handle}
							readOnly
							aria-label="Your fediverse handle"
						/>
						<button
							type="button"
							className="btn btn-outline-secondary"
							onClick={onCopy}
						>
							<i className="fa-regular fa-copy me-1" aria-hidden="true" />
							{copied ? "Copied" : "Copy"}
						</button>
					</div>
					<p className="text-muted small mb-0">
						{data.followers} {data.followers === 1 ? "follower" : "followers"}
					</p>
				</>
			) : (
				<p className="text-muted small mb-0">
					Your handle will be <strong>{data?.handle}</strong>. You start with no
					followers.
				</p>
			)}
		</>
	);
}

function ConnectForm({ pending, onConnect, label }) {
	const [account, setAccount] = useState("");

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onConnect(account);
			}}
		>
			<label htmlFor="fediverse-account" className="form-label">
				{label}
			</label>
			<div className="input-group">
				<input
					id="fediverse-account"
					className="form-control"
					placeholder="@you@mastodon.social"
					value={account}
					onChange={(e) => setAccount(e.target.value)}
					autoComplete="username"
					autoCapitalize="none"
					spellCheck={false}
					required
				/>
				<button type="submit" className="btn btn-primary" disabled={pending}>
					{pending ? "Redirecting…" : "Connect"}
				</button>
			</div>
			<p className="form-text mb-0">
				Your handle or your server address. Works with Mastodon, GoToSocial,
				Pleroma and Akkoma.
			</p>
		</form>
	);
}

const ConnectFediverseForm = ({ auth = {} }) => {
	const params = useSearchParams();
	const { data, mutate, isLoading } = useSWR(`${API}/status`, (url) =>
		request(url),
	);
	const [error, setError] = useState(ERRORS[params.get("error")] || "");
	const [pending, setPending] = useState(false);
	const justConnected = params.get("connected") === "mastodon";

	const run = async (task) => {
		setPending(true);
		setError("");
		try {
			await task();
		} catch (err) {
			setError(err.message);
		} finally {
			setPending(false);
		}
	};

	const onToggle = () => {
		const enabled = !data?.enabled;
		if (!enabled && !window.confirm("Remove your posts from the fediverse?"))
			return;
		run(() =>
			mutate(request(`${API}/enabled`, "PUT", { enabled }), {
				revalidate: false,
			}),
		);
	};

	const onConnect = async (account) => {
		setPending(true);
		setError("");
		try {
			const { url } = await request(`${API}/connect`, "POST", { account });
			window.location.assign(url);
		} catch (err) {
			setError(err.message);
			setPending(false);
		}
	};

	const onDisconnect = () => {
		if (
			!window.confirm(
				"Disconnect this account? Posts already shared stay on it.",
			)
		)
			return;
		run(() =>
			mutate(request(`${API}/connect`, "DELETE"), {
				revalidate: false,
			}),
		);
	};

	if (isLoading) return <p className="text-muted">Loading…</p>;

	const connected = data?.connected;

	return (
		<>
			<h2 className="h5 card-title">Fediverse (Mastodon, Threads…)</h2>
			{error && (
				<div className="alert alert-danger" role="alert">
					{error}
				</div>
			)}
			{justConnected && connected && !error && (
				<div className="alert alert-success" role="status">
					Connected. New public posts will also appear on {connected.handle}.
				</div>
			)}

			{connected ? (
				<>
					<p className="mb-3">
						Posting to{" "}
						{connected.url ? (
							<a href={connected.url} target="_blank" rel="noreferrer">
								<strong>{connected.handle}</strong>
							</a>
						) : (
							<strong>{connected.handle}</strong>
						)}
						. Edits, hiding and deleting here update it too.
					</p>
					{connected.needsReconnect && (
						<div className="mb-3">
							<p className="text-warning">
								Access to this account was removed. Connect again to keep
								posting.
							</p>
							<ConnectForm
								pending={pending}
								onConnect={onConnect}
								label="Your fediverse account"
							/>
						</div>
					)}
					<button
						type="button"
						className="btn btn-outline-danger"
						onClick={onDisconnect}
						disabled={pending}
					>
						Disconnect
					</button>
				</>
			) : (
				<>
					<HostedProfile data={data} pending={pending} onToggle={onToggle} />
					{!data?.enabled && (
						<>
							<hr />
							<ConnectForm
								pending={pending}
								onConnect={onConnect}
								label="Or post to an account you already have"
							/>
						</>
					)}
				</>
			)}
		</>
	);
};

export default ConnectFediverseForm;
