"use client";

import { createContext, useContext } from "react";

export const UploadBridgeContext = createContext(null);

export function useUploadBridge() {
	const context = useContext(UploadBridgeContext);
	if (!context) {
		throw new Error(
			"useUploadBridge must be used within an UploadBridgeProvider",
		);
	}
	return context;
}
