import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ContactIdentificationResult {
  primaryContatctId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

export const identifyContactService = async ({
  email,
  phoneNumber
}: {
  email?: string;
  phoneNumber?: string;
}): Promise<ContactIdentificationResult> => {
  // Validate input - at least one of email or phoneNumber must be provided
  if (!email && !phoneNumber) {
    throw new Error('Either email or phoneNumber must be provided');
  }

  // Find all contacts where email or phoneNumber matches and not deleted
  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phoneNumber ? [{ phoneNumber }] : [])
      ],
      deletedAt: null
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // If no contacts found, create a new primary contact
  if (existingContacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
        linkPrecedence: 'primary'
      }
    });

    return {
      primaryContatctId: newContact.id,
      emails: email ? [email] : [],
      phoneNumbers: phoneNumber ? [phoneNumber] : [],
      secondaryContactIds: []
    };
  }

  // Find the oldest primary contact
  let oldestPrimaryContact = existingContacts.find(
    (contact: { linkPrecedence: string }) => contact.linkPrecedence === 'primary'
  );

  // If no primary contact found in the matched set, trace back to the primary contact
  if (!oldestPrimaryContact) {
    // Get the linkedId from any secondary contact (they should all point to the same primary)
    const secondaryContact = existingContacts.find(
      (contact: { linkPrecedence: string; linkedId: number | null }) => 
        contact.linkPrecedence === 'secondary' && contact.linkedId !== null
    );

    if (!secondaryContact || !secondaryContact.linkedId) {
      throw new Error('No primary contact found and no valid linkedId in secondary contacts');
    }

    // Fetch the actual primary contact using the linkedId
    const primaryContact = await prisma.contact.findFirst({
      where: {
        id: secondaryContact.linkedId,
        deletedAt: null
      }
    });

    if (!primaryContact) {
      throw new Error('Primary contact not found for the given linkedId');
    }

    oldestPrimaryContact = primaryContact;
  }

  // Check if the input email/phone is new (not in the matched set)
  const existingEmails = existingContacts
    .map((contact: { email: string | null }) => contact.email)
    .filter((email: string | null): email is string => Boolean(email));
  
  const existingPhoneNumbers = existingContacts
    .map((contact: { phoneNumber: string | null }) => contact.phoneNumber)
    .filter((phone: string | null): phone is string => Boolean(phone));

  const isNewEmail = email && !existingEmails.includes(email);
  const isNewPhone = phoneNumber && !existingPhoneNumbers.includes(phoneNumber);

  // Use transaction to handle multiple primary contacts and new contact creation
  return await prisma.$transaction(async (tx) => {
    // If we have new email or phone, create a secondary contact
    if (isNewEmail || isNewPhone) {
      await tx.contact.create({
        data: {
          email: isNewEmail ? email : null,
          phoneNumber: isNewPhone ? phoneNumber : null,
          linkPrecedence: 'secondary',
          linkedId: oldestPrimaryContact.id
        }
      });
    }

    // Handle multiple primary contacts - convert newer ones to secondary
    const primaryContacts = existingContacts.filter(
      (contact: { linkPrecedence: string }) => contact.linkPrecedence === 'primary'
    );

    if (primaryContacts.length > 1) {
      // Convert all primary contacts except the oldest to secondary
      const contactsToUpdate = primaryContacts
        .filter((contact: { id: number }) => contact.id !== oldestPrimaryContact.id)
        .map((contact: { id: number }) => contact.id);

      if (contactsToUpdate.length > 0) {
        await tx.contact.updateMany({
          where: {
            id: { in: contactsToUpdate }
          },
          data: {
            linkPrecedence: 'secondary',
            linkedId: oldestPrimaryContact.id
          }
        });
      }
    }

    // Get all contacts linked to the primary contact (including newly created ones)
    const allLinkedContacts = await tx.contact.findMany({
      where: {
        OR: [
          { id: oldestPrimaryContact.id },
          { linkedId: oldestPrimaryContact.id }
        ],
        deletedAt: null
      }
    });

    // Collect all unique emails and phone numbers
    const allEmails: string[] = allLinkedContacts
      .map((contact: { email: string | null }) => contact.email)
      .filter((email: string | null): email is string => Boolean(email));
    
    const allPhoneNumbers: string[] = allLinkedContacts
      .map((contact: { phoneNumber: string | null }) => contact.phoneNumber)
      .filter((phone: string | null): phone is string => Boolean(phone));

    // Get secondary contact IDs (excluding the primary)
    const secondaryContactIds: number[] = allLinkedContacts
      .filter((contact: { id: number }) => contact.id !== oldestPrimaryContact.id)
      .map((contact: { id: number }) => contact.id);

    return {
      primaryContatctId: oldestPrimaryContact.id,
      emails: [...new Set(allEmails)], // Remove duplicates
      phoneNumbers: [...new Set(allPhoneNumbers)], // Remove duplicates
      secondaryContactIds: secondaryContactIds
    };
  });
}; 