
// import dotenv from 'dotenv';
import { db } from '@/lib/db/drizzle'; // Make sure this path is correct
import { accounts, contacts } from '@/lib/db/schema'; // Make sure this path is correct
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// dotenv.config();


export async function POST(req) {

    // Handle OPTIONS request (preflight)
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const data = await req.json();
  
  if (!Array.isArray(data) || data.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Invalid data: Expected an array of records' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  try {
    let insertedAccounts = 0;
    let insertedContacts = 0;
    const failedRecords = [];

    const sortedData = data.sort((a, b) => {
        if (a.type === b.type) return 0;
        if (a.type === "Account") return -1;
        return 1;
      });
      
    for (const item of data) {
      try {
        // Handle Accounts
        if (item.type === 'Account' && item.company_url && item.company_url !== 'N/A') {
            console.log(item.company_url,'item.company_url')
          await db.insert(accounts)
            .values({
              name: item.name || 'N/A',
              industry: item.industry || 'N/A',
              employees: item.employees || 'N/A',
              about: item.about || 'N/A',
              company_url: item.company_url
            })
            .onConflictDoUpdate({
              target: accounts.company_url,
              set: {
                name: item.name || 'N/A',
                industry: item.industry || 'N/A',
                employees: item.employees || 'N/A',
                about: item.about || 'N/A'
              }
            });
          insertedAccounts++;
        }

        // Handle Contacts (Leads)
        if (item.type === 'Lead' && item.profile_url && item.profile_url !== 'N/A') {
          let accountId = null;
        //   if (item.company_url && item.company_url !== 'N/A') {
            // console.log(item.company,'item.company')
            const existingAccount = await db.select()
              .from(accounts)
              .where(eq(accounts.name, item.company))
              .limit(1);
            // console.log(existingAccount,'existingAccount')
            if (existingAccount.length > 0) {
              accountId = existingAccount[0].id;
            
            }
          
        //   console.log('accountId:', accountId);
          await db.insert(contacts)
            .values({
              account_id: accountId,
              type: item.type,
              first_name: item.firstName || 'N/A',
              last_name: item.lastName || 'N/A',
              title: item.title || 'N/A',
              company: item.company || 'N/A',
              location: item.location || 'N/A',
              latitude: item.latitude || 'N/A',
              longitude: item.longitude || 'N/A',
              email: item.email || 'N/A',
              connections: item.connections || 'N/A',
              about: item.about || 'N/A',
              profile_url: item.profile_url,
              insights: item.insights || 'N/A'
            })
            .onConflictDoUpdate({
              target: contacts.profile_url,
              set: {
                account_id: accountId,
                type: item.type,
                first_name: item.firstName || 'N/A',
                last_name: item.lastName || 'N/A',
                title: item.title || 'N/A',
                company: item.company || 'N/A',
                location: item.location || 'N/A',
                latitude: item.latitude || 'N/A',
                longitude: item.longitude || 'N/A',
                email: item.email || 'N/A',
                connections: item.connections || 'N/A',
                about: item.about || 'N/A',
                insights: item.insights || 'N/A'
              }
            });
          insertedContacts++;
        }
      } catch (error) {
        console.error(`Error processing record:`, item, error);
        failedRecords.push({ record: item, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Successfully processed ${insertedAccounts} accounts and ${insertedContacts} contacts`,
        failedRecords
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error inserting data:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}



export async function GET(req) {
  try {
    const existingAccount = await db.select()
      .from(accounts)
      .limit(1);

    return NextResponse.json({ leads: existingAccount });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}