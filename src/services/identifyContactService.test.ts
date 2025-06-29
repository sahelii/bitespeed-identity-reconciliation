import { PrismaClient } from '@prisma/client';
import { identifyContactService } from './identifyContactService';

describe('identifyContactService', () => {
  const prisma = new PrismaClient();

  beforeEach(async () => {
    // Clean up all contacts before each test
    await prisma.contact.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates new primary contact for unique email + phone', async () => {
    const result = await identifyContactService({
      email: 'unique1@example.com',
      phoneNumber: '+1111111111',
    });
    expect(result.emails).toContain('unique1@example.com');
    expect(result.phoneNumbers).toContain('+1111111111');
    expect(result.secondaryContactIds).toHaveLength(0);
    // Validate DB
    const contacts = await prisma.contact.findMany();
    expect(contacts).toHaveLength(1);
    expect(contacts[0]?.linkPrecedence).toBe('primary');
  });

  it('adds new secondary contact when one field matches existing', async () => {
    // Seed a primary contact
    const primary = await prisma.contact.create({
      data: {
        email: 'seed@example.com',
        phoneNumber: '+2222222222',
        linkPrecedence: 'primary',
      },
    });
    // New request with same email, new phone
    const result = await identifyContactService({
      email: 'seed@example.com',
      phoneNumber: '+3333333333',
    });
    expect(result.primaryContatctId).toBe(primary.id);
    expect(result.emails).toContain('seed@example.com');
    expect(result.phoneNumbers).toEqual(expect.arrayContaining(['+2222222222', '+3333333333']));
    expect(result.secondaryContactIds.length).toBe(1);
    // Validate DB
    const contacts = await prisma.contact.findMany();
    expect(contacts).toHaveLength(2);
    const secondary = contacts.find(c => c.linkPrecedence === 'secondary');
    expect(secondary?.linkedId).toBe(primary.id);
  });

  it('merges two primary contacts (newer becomes secondary)', async () => {
    // Seed two primaries with different emails/phones
    const primary1 = await prisma.contact.create({
      data: {
        email: 'merge1@example.com',
        phoneNumber: '+4444444444',
        linkPrecedence: 'primary',
        createdAt: new Date(Date.now() - 10000),
      },
    });
    const primary2 = await prisma.contact.create({
      data: {
        email: 'merge2@example.com',
        phoneNumber: '+5555555555',
        linkPrecedence: 'primary',
        createdAt: new Date(Date.now() - 5000),
      },
    });
    // Now identify with a field that matches both
    const result = await identifyContactService({
      email: 'merge1@example.com',
      phoneNumber: '+5555555555',
    });
    // The older primary should remain primary
    expect(result.primaryContatctId).toBe(primary1.id);
    expect(result.secondaryContactIds).toContain(primary2.id);
    // Validate DB
    const contacts = await prisma.contact.findMany();
    const updatedPrimary2 = contacts.find(c => c.id === primary2.id);
    expect(updatedPrimary2?.linkPrecedence).toBe('secondary');
    expect(updatedPrimary2?.linkedId).toBe(primary1.id);
  });

  it('returns existing identity when queried by phone or email', async () => {
    // Seed a primary and a secondary
    const primary = await prisma.contact.create({
      data: {
        email: 'identity@example.com',
        phoneNumber: '+6666666666',
        linkPrecedence: 'primary',
      },
    });
    const secondary = await prisma.contact.create({
      data: {
        email: 'secondary@example.com',
        phoneNumber: '+7777777777',
        linkPrecedence: 'secondary',
        linkedId: primary.id,
      },
    });
    // Query by secondary's email
    const result = await identifyContactService({
      email: 'secondary@example.com',
    });
    expect(result.primaryContatctId).toBe(primary.id);
    expect(result.emails).toEqual(expect.arrayContaining(['identity@example.com', 'secondary@example.com']));
    expect(result.phoneNumbers).toEqual(expect.arrayContaining(['+6666666666', '+7777777777']));
    expect(result.secondaryContactIds).toContain(secondary.id);
    // Query by primary's phone
    const result2 = await identifyContactService({
      phoneNumber: '+6666666666',
    });
    expect(result2.primaryContatctId).toBe(primary.id);
    expect(result2.secondaryContactIds).toContain(secondary.id);
  });
});
