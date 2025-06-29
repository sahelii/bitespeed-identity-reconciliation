import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.contact.createMany({
    data: [
      {
        email: 'martymcfly@hillvalley.edu',
        phoneNumber: '0001112222',
        linkPrecedence: 'primary'
      },
      {
        email: 'docbrown@hillvalley.edu',
        phoneNumber: '0001112222',
        linkPrecedence: 'secondary',
        linkedId: 1
      }
    ]
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 