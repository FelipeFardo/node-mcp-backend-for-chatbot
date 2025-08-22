import type { FastifyInstance } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { BadRequestError } from "./routes/_errors/bad-request-error.ts";
import { UnauthorizedError } from "./routes/_errors/unauthorized-error.ts";

interface FieldErrors {
	[key: string]: string[];
}

type FastifyErrorHandler = FastifyInstance["errorHandler"];
export const errorHandler: FastifyErrorHandler = (error, _request, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: "Validation error",
			errors: error.flatten().fieldErrors,
		});
	}

	if (hasZodFastifySchemaValidationErrors(error)) {
		const formattedErrors = error.validation.reduce<FieldErrors>((acc, err) => {
			const path = err.params.issue.path.join(".");
			if (!acc[path]) acc[path] = [];
			acc[path].push(err.message);
			return acc;
		}, {});

		return reply.status(400).send({
			message: "Validation error",
			errors: formattedErrors,
		});
	}

	if (error instanceof BadRequestError) {
		return reply.status(400).send({
			message: error.message,
		});
	}

	if (error instanceof UnauthorizedError) {
		return reply.status(401).send({
			message: error.message,
		});
	}

	console.error(error);

	// send error to some observability platform

	return reply.status(500).send({
		message: "Internal server error",
	});
};
