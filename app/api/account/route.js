// Add this helper function at the top
function createResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

import { db } from '@/lib/db/drizzle'; // Make sure this path is correct
import { accounts, contacts } from '@/lib/db/schema'; // Make sure this path is correct
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function POST(req) {
  if (req.method !== 'POST') {
    return createResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const data = await req.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return createResponse({ error: 'Invalid data: Expected an array of records' }, 400);
    }

    let insertedAccounts = 0;
    let insertedContacts = 0;
    const failedRecords = [];

    const sortedData = data.sort((a, b) => {
      if (a.type === b.type) return 0;
      if (a.type === "Account") return -1;
      return 1;
    });

    for (const item of sortedData) {
      try {
        // Handle Accounts
        if (item.type === 'Account' && item.company_url && item.company_url !== 'N/A') {
          await db.insert(accounts)
            .values({
              name: item.name || null,
              industry: item.industry || null,
              employees: item.employees || null,
              about: item.about || null,
              company_url: item.company_url
            })
            .onConflictDoUpdate({
              target: accounts.company_url,
              set: {
                name: item.name || null,
                industry: item.industry || null,
                employees: item.employees || null,
                about: item.about || null
              }
            });
          insertedAccounts++;
        }

        // Handle Contacts (Leads)
        if (item.type === 'Lead' && item.profile_url && item.profile_url !== 'N/A') {
          let accountId = null;
          const existingAccount = await db.select()
            .from(accounts)
            .where(eq(accounts.name, item.company))
            .limit(1);

          if (existingAccount.length > 0) {
            accountId = existingAccount[0].id;
          }

          await db.insert(contacts)
            .values({
              account_id: accountId,
              type: item.type,
              first_name: item.firstName || null,
              last_name: item.lastName || null,
              title: item.title || null,
              company: item.company || null,
              location: item.location || null,
              latitude: item.latitude || null,
              longitude: item.longitude || null,
              email: item.email || null,
              connections: item.connections || null,
              about: item.about || null,
              profile_url: item.profile_url,
              insights: item.insights || null
            })
            .onConflictDoUpdate({
              target: contacts.profile_url,
              set: {
                account_id: accountId,
                type: item.type,
                first_name: item.name || null,
                last_name: item.lastName || null,
                title: item.title || null,
                company: item.company || null,
                location: item.location || null,
                latitude: item.latitude || null,
                longitude: item.longitude || null,
                email: item.email || null,
                connections: item.connections || null,
                about: item.about || null,
                insights: item.insights || null
              }
            });
          insertedContacts++;
        }
      } catch (error) {
        console.error(`Error processing record:`, item, error);
        failedRecords.push({ record: item, error: error.message });
      }
    }

    return createResponse({
      success: true,
      message: `Successfully processed ${insertedAccounts} accounts and ${insertedContacts} contacts`,
      data: { insertedAccounts, insertedContacts },
      failedRecords
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    }, 500);
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

    if (type === 'mycontact') {
      const { data, count } = await fetchmycontact(page, pageSize);
      return createResponse({
        success: true,
        data,
        pagination: {
          page,
          pageSize,
          total: count
        }
      });
    }

    return createResponse({ 
      success: false,
      error: 'Invalid type parameter' 
    }, 400);

  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    }, 500);
  }
}

async function fetchmycontact(page = 1, pageSize = 10) {
  try {
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      db.select({
        id: contacts.id,
        name: sql`CONCAT(first_name, ' ', last_name)`,
        title: contacts.title,
        company: contacts.company,
        location: contacts.location,
        companyEmail: contacts.email,
        connections: contacts.connections,
        about: contacts.about,
        profile_url: contacts.profile_url,
        insights: contacts.insights
      })
      .from(contacts)
      .offset(offset)
      .limit(pageSize),

      db.select({ count: sql`count(*)` }).from(contacts)
    ]);

    return {
      data,
      count: Number(countResult[0].count)
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Failed to fetch contacts');
  }
}
