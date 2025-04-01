
// import dotenv from 'dotenv';
import { db } from '@/lib/db/drizzle'; // Make sure this path is correct
import { accounts, contacts } from '@/lib/db/schema'; // Make sure this path is correct
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { count } from 'console';
import { sql } from 'drizzle-orm';
// dotenv.config();


export async function POST(req) {


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
    return addCorsHeaders(response);
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




async function fetchmycontact(page = 1, pageSize = 10) {
  try {
    const offset = (page - 1) * pageSize;

    // Fetch paginated data
    // const data = await db('accounts')
    //   .select('*')  // Ensure you're selecting fields explicitly
    //   .offset(offset)
    //   .limit(pageSize);

    const data = await db.select( {
      id: contacts.id, 
      name: sql`CONCAT(first_name, ' ', last_name)`, 
      title: contacts.title, 
      company: contacts.company, 
      location: contacts.location, 
      companyEmail: contacts.email, 
      connections: contacts.connections, 
      about: contacts.about, 
      profile_url: contacts.profile_url, 
      insights: contacts.insights}).from(contacts).offset(offset).limit(pageSize);

    // Get total count
    // const totalCountResult = await db('accounts')
    //   .count('* as count')
    //   .first();

    // const totalCount = totalCountResult ? parseInt(totalCountResult.count, 10) : 0;
      const totalCount = 0;
    return {
      data: data,
      count: totalCount
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Failed to fetch contacts');
  }
}



export async function GET(req) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const workspaceId = url.searchParams.get('wid');

  try {
    let response;

    if (type === 'mycontact') {
      response = await fetchmycontact();
    } 
    // else if (type === 'workspace' && workspaceId) {
    //   response = await fetchWorkspaceById(workspaceId);
    // } else if (type === 'datasets' && workspaceId) {
    //   response = await fetchDatasetsByWorkspaceId(workspaceId);
    // } else if (type === 'default') {
    //   response = await fetchDefaultDataset();
    // } else if (type === 'fileuploadprogress') {
    //   response = await fetchFileUploadProgress(workspaceId);
    // }
    else {
      return NextResponse.json({ message: 'Invalid type parameter' }, { status: 400 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { message: `${error.response.data.detail || error.message}` },
        { status: error.response.status },
      );
    } else {
      return NextResponse.json({ message: `Error fetching ${type}: ${error}` }, { status: 500 });
    }
  }

  // try {
  //   const existingAccount = await db.select()
  //     .from(accounts);

  //   return NextResponse.json({ leads: existingAccount });
  // } catch (error) {
  //   console.error("Database error:", error);
  //   return NextResponse.json(
  //     { error: "Failed to fetch leads data", details: error instanceof Error ? error.message : String(error) },
  //     { status: 500 }
  //   );
  //   return addCorsHeaders(response);
  // }
}
