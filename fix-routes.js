import fs from 'fs';

// 1. Read the file content
let routesFile = fs.readFileSync('server/routes.ts', 'utf8');

// 2. Fix account data import by adding userId
let fixedAccountData = routesFile.replace(
  `const accountData = {
              name: item.name || null,
              industry: item.industry || null,
              source: item.source || null,
              extractedAt: item.extracted_at || item.extractedAt ? 
                new Date(item.extracted_at || item.extractedAt) : null,
              size: item.employees || null,
              timestamp: item.timestamp ? 
                (typeof item.timestamp === 'number' ? new Date(item.timestamp) : new Date(item.timestamp)) : null,
              about: item.about || null,
              linkedinUrl: item.companyUrl
            };`,
  `const accountData = {
              userId: user.id, // Add user ID for data isolation
              name: item.name || null,
              industry: item.industry || null,
              source: item.source || null,
              extractedAt: item.extracted_at || item.extractedAt ? 
                new Date(item.extracted_at || item.extractedAt) : null,
              size: item.employees || null,
              timestamp: item.timestamp ? 
                (typeof item.timestamp === 'number' ? new Date(item.timestamp) : new Date(item.timestamp)) : null,
              about: item.about || null,
              linkedinUrl: item.companyUrl
            };`
);

// 3. Fix contact data import by adding userId
let fixedContactData = fixedAccountData.replace(
  `const contactData = {
              source: item.source || null,
              fullName: item.name || null,
              jobTitle: item.title || null,
              companyName: item.company || null,
              location: item.location || null,
              connections: item.connections || null,
              about: item.about || null,
              linkedInUrl: item.profileUrl,`,
  `const contactData = {
              userId: user.id, // Add user ID for data isolation
              source: item.source || null,
              fullName: item.name || null,
              jobTitle: item.title || null,
              companyName: item.company || null,
              location: item.location || null,
              connections: item.connections || null,
              about: item.about || null,
              linkedInUrl: item.profileUrl,`
);

// 4. Write fixed content back to file
fs.writeFileSync('server/routes.ts', fixedContactData);

console.log('Fixed the routes file to ensure proper user data isolation');