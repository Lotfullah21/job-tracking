const { PrismaClient } = require("@prisma/client");
const data = require("./mock-data.json");
const prisma = new PrismaClient();

const main = async () => {
	const clerkId = "user_2mC2a1W76kA0Iw96x4y38SjjAcw";
	// Add clerkId to each job
	const jobs = data.map((job) => {
		return { ...job, clerkId };
	});

	for (const job of jobs) {
		// Use the dynamic job data from the mapped array
		await prisma.job.create({
			data: {
				position: job.position, // Use dynamic job position
				company: job.company,
				location: job.location,
				status: job.status,
				mode: job.mode,
				createdAt: new Date(job.createdAt), // Ensure date is correctly handled
				clerkId: job.clerkId, // Use the dynamic clerkId
			},
		});
	}
};

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.log(e);
		await prisma.$disconnect();
		process.exit(1);
	});
