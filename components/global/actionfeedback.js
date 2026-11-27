"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { isFailure } from "@/helpers/filemanagerhelpers";
import { useIsMounted } from "@/components/global/filemanagerui";

export const actionFailed = (res) => res !== undefined && isFailure(res);

export const actionMessage = (res, fallback = "Something went wrong") => {
	for (const candidate of [res?.message, res?.error]) {
		if (typeof candidate === "string" && candidate.trim()) return candidate;
	}
	return fallback;
};

export const prefersReducedMotion = () =>
	typeof window !== "undefined" &&
	window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

const SHAKE_FRAMES = [
	{ transform: "translateX(0)" },
	{ transform: "translateX(-8px)" },
	{ transform: "translateX(7px)" },
	{ transform: "translateX(-5px)" },
	{ transform: "translateX(3px)" },
	{ transform: "translateX(0)" },
];

export const shakeElement = (node) => {
	if (!node?.animate || prefersReducedMotion()) return;
	node.animate(SHAKE_FRAMES, { duration: 420, easing: "ease-in-out" });
};

const FLASH_ID = "action-flash";

const FLASH_COLORS = {
	success: "rgba(25, 135, 84, 0.18)",
	error: "rgba(220, 53, 69, 0.2)",
};

export const flashElement = (node, tone = "success") => {
	if (!node?.animate) return;
	node.getAnimations?.().forEach((a) => a.id === FLASH_ID && a.cancel());
	node.animate(
		[
			{ backgroundColor: FLASH_COLORS[tone] || FLASH_COLORS.success },
			{ backgroundColor: getComputedStyle(node).backgroundColor },
		],
		{ id: FLASH_ID, duration: 900, easing: "ease-out" },
	);
};

const LEAVE_MS = 320;
const ENTER_MS = 360;

const openRowFrame = (node) => {
	const { paddingTop, paddingBottom, borderBottomWidth } =
		getComputedStyle(node);
	return {
		opacity: 1,
		transform: "translateX(0)",
		height: `${node.offsetHeight}px`,
		paddingTop,
		paddingBottom,
		borderBottomWidth,
	};
};

const closedRowFrame = (offsetX) => ({
	opacity: 0,
	transform: `translateX(${offsetX})`,
	height: "0px",
	paddingTop: "0px",
	paddingBottom: "0px",
	borderBottomWidth: "0px",
});

export function useRowMotion(
	ref,
	{ id, leaving = false, entering = false, onLeft, onEntered },
) {
	useEffect(() => {
		const node = ref.current;
		if (!leaving || !node) return;
		if (!node.animate || prefersReducedMotion()) {
			onLeft?.(id);
			return;
		}
		const animation = node.animate(
			[openRowFrame(node), closedRowFrame("1.5rem")],
			{ duration: LEAVE_MS, easing: "ease-in", fill: "forwards" },
		);
		animation.finished.then(
			() => onLeft?.(id),
			() => {},
		);
		return () => animation.cancel();
	}, [ref, id, leaving, onLeft]);

	useLayoutEffect(() => {
		const node = ref.current;
		if (!entering || !node) return;
		if (!node.animate || prefersReducedMotion()) {
			onEntered?.(id);
			return;
		}
		const animation = node.animate(
			[closedRowFrame("-1.5rem"), openRowFrame(node)],
			{ duration: ENTER_MS, easing: "ease-out" },
		);
		animation.finished.then(
			() => onEntered?.(id),
			() => {},
		);
		return () => animation.cancel();
	}, [ref, id, entering, onEntered]);
}

export function useConfirmAction({ action, failText, onSuccess, onDone }) {
	const isMountedRef = useIsMounted();
	const pendingRef = useRef(false);
	const succeededRef = useRef(false);
	const bodyRef = useRef(null);
	const [show, setShow] = useState(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

	const open = () => {
		setError("");
		setShow(true);
	};

	const close = () => {
		if (!pendingRef.current) setShow(false);
	};

	const confirm = async (e) => {
		e?.preventDefault();

		if (pendingRef.current) return;
		pendingRef.current = true;
		setPending(true);
		setError("");
		let res;
		try {
			res = await action();
		} catch (err) {
			res = { status: "error", message: err?.message };
		}
		pendingRef.current = false;
		if (!isMountedRef.current) return;
		setPending(false);
		if (actionFailed(res)) {
			setError(actionMessage(res, failText));
			const node = bodyRef.current;
			shakeElement(node?.closest(".modal-content") || node);
			return;
		}
		succeededRef.current = true;
		try {
			onSuccess?.(res);
		} finally {
			setShow(false);
		}
	};

	const handleExited = () => {
		setError("");
		if (!succeededRef.current) return;
		succeededRef.current = false;
		onDone?.();
	};

	return { show, pending, error, bodyRef, open, close, confirm, handleExited };
}
