import { faker } from "@faker-js/faker";

import { db } from "./connection.ts";
import { debts } from "./schema/debts.ts";
import { users } from "./schema/users.ts";

async function seed() {
	await db.delete(users);
	await db.delete(debts);

	const allUsers = await db
		.insert(users)
		.values([
			{
				name: "John Doe",
				email: "john@acme.com",
				passwordHash:
					"$2a$12$uMTAFMnwNkZFrMPTgp2TjuE2ErfdLkkYyiRhol8OVR41p1YONsDn2",
				status: "active",
				phone: "5555123456789",
			},
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				passwordHash:
					"$2a$12$uMTAFMnwNkZFrMPTgp2TjuE2ErfdLkkYyiRhol8OVR41p1YONsDn2",
				status: "inactive",
			},
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				passwordHash:
					"$2a$12$uMTAFMnwNkZFrMPTgp2TjuE2ErfdLkkYyiRhol8OVR41p1YONsDn2",
				status: "inactive",
			},
		])
		.returning();

	const [_user, _anotherUser, _anotherUser2] = allUsers;
	console.log("✔️ Created Users!");

	const debtsToInsert = allUsers.flatMap((user) =>
		Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => ({
			userId: user.id,
			description: faker.commerce.productName(),
			amount: faker.finance.amount({ min: 50, max: 5000, dec: 2 }),
			dueDate: faker.date.soon({ days: 30 }),
			status: faker.helpers.arrayElement(["pending", "paid", "overdue"]),
			paidAt: faker.helpers.maybe(() => faker.date.recent({ days: 5 }), {
				probability: 0.4, // 40% chance de já estar paga
			}),
		})),
	);
	await db.insert(debts).values(debtsToInsert);
	console.log("✔️ Created Debts!");

	console.log("✔️ Database seeded successfully");

	process.exit();
}

try {
	seed();
} catch (error) {
	console.log(error);
}
