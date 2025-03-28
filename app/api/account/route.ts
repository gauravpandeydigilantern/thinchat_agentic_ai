import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { accounts, contacts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Define the expected shape of the incoming data
interface Record {
  type: "Account" | "Lead";
  name?: string;
  industry?: string;
  employees?: string;
  about?: string;
  company_url?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  company?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  email?: string;
  connections?: string;
  profile_url?: string;
  insights?: string;
}

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // Replace with your frontend domain in production
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type", "Authorization");
  return response;
}

export async function POST(req: Request) {
  console.log("Request Origin:", req.headers.get("origin"));

  try {
    const data: Record[] = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      const response = NextResponse.json(
        { error: "Invalid data: Expected an array of records" },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    const sortedData = data.sort((a, b) => {
      if (a.type === b.type) return 0;
      if (a.type === "Account") return -1;
      return 1;
    });

    let insertedAccounts = 0;
    let insertedContacts = 0;
    const failedRecords: { record: Record; error: string }[] = [];

    const accountPromises = sortedData
      .filter(
        (item) => item.type === "Account" && item.company_url && item.company_url !== "N/A"
      )
      .map(async (item) => {
        try {
          await db
            .insert(accounts)
            .values({
              name: item.name || "N/A",
              industry: item.industry || "N/A",
              employees: item.employees || "N/A",
              about: item.about || "N/A",
              company_url: item.company_url!,
            })
            .onConflictDoUpdate({
              target: accounts.company_url,
              set: {
                name: item.name || "N/A",
                industry: item.industry || "N/A",
                employees: item.employees || "N/A",
                about: item.about || "N/A",
              },
            });
          insertedAccounts++;
        } catch (error) {
          console.error(`Error processing account:`, item, error);
          failedRecords.push({ record: item, error: (error as Error).message });
        }
      });

    await Promise.all(accountPromises);

    const contactPromises = sortedData
      .filter(
        (item) => item.type === "Lead" && item.profile_url && item.profile_url !== "N/A"
      )
      .map(async (item) => {
        try {
          let accountId: number | null = null;

          if (item.company && item.company !== "N/A") {
            const existingAccount = await db
              .select()
              .from(accounts)
              .where(eq(accounts.name, item.company))
              .limit(1);

            if (existingAccount.length > 0) {
              accountId = existingAccount[0].id;
            }
          }

          await db
            .insert(contacts)
            .values({
              account_id: accountId,
              type: item.type,
              first_name: item.firstName || "N/A",
              last_name: item.lastName || "N/A",
              title: item.title || "N/A",
              company: item.company || "N/A",
              location: item.location || "N/A",
              latitude: item.latitude || "N/A",
              longitude: item.longitude || "N/A",
              email: item.email || "N/A",
              connections: item.connections || "N/A",
              about: item.about || "N/A",
              profile_url: item.profile_url!,
              insights: item.insights || "N/A",
            })
            .onConflictDoUpdate({
              target: contacts.profile_url,
              set: {
                account_id: accountId,
                type: item.type,
                first_name: item.firstName || "N/A",
                last_name: item.lastName || "N/A",
                title: item.title || "N/A",
                company: item.company || "N/A",
                location: item.location || "N/A",
                latitude: item.latitude || "N/A",
                longitude: item.longitude || "N/A",
                email: item.email || "N/A",
                connections: item.connections || "N/A",
                about: item.about || "N/A",
                insights: item.insights || "N/A",
              },
            });
          insertedContacts++;
        } catch (error) {
          console.error(`Error processing contact:`, item, error);
          failedRecords.push({ record: item, error: (error as Error).message });
        }
      });

    await Promise.all(contactPromises);

    const response = NextResponse.json(
      {
        message: `Successfully processed ${insertedAccounts} accounts and ${insertedContacts} contacts`,
        failedRecords,
      },
      { status: 200 }
    );
    return addCorsHeaders(response);
  } catch (error) {
    console.error("Error in POST handler:", error);
    const response = NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  return addCorsHeaders(response);
} 