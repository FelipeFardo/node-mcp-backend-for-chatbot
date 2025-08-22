import { UnauthorizedClientError } from "@modelcontextprotocol/sdk/server/auth/errors.js";
import type { OAuthTokenVerifier } from "@modelcontextprotocol/sdk/server/auth/provider.js";
import jwt from "jsonwebtoken";
import { env } from "../env.ts";

interface UserPayload {
	sub: string;
}

const jwtVerify = (token: string) => {
	return jwt.verify(token, env.JWT_SECRET) as UserPayload;
};

const jwtSign = (sub: string) => {
	const token = jwt.sign({ sub }, env.JWT_SECRET, { expiresIn: "7d" });
	return token;
};

const myVerifier: OAuthTokenVerifier = {
	verifyAccessToken: async (token: string) => {
		try {
			const payload = jwtVerify(token);

			return {
				token,
				clientId: payload.sub,
				scopes: ["read", "write"],
			};
		} catch (_error) {
			throw new UnauthorizedClientError("Unauthorized");
		}
	},
};
export { myVerifier, jwtSign };
