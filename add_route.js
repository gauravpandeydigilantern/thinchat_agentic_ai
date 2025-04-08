const fs = require('fs');

const appTsxPath = 'client/src/App.tsx';
const content = fs.readFileSync(appTsxPath, 'utf8');

// Insert the new route after the /dashboard/ai-writer route
const updatedContent = content.replace(
  /<Route path="\/dashboard\/ai-writer".*?\n.*?\n.*?\n.*?\n.*?\)\s*\/>/s,
  (match) => `${match}\n      
      <Route path="/dashboard/companies-fixed" component={() => (
        <DashboardLayout>
          <ProtectedRoute component={CompaniesFixedPage} />
        </DashboardLayout>
      )} />`
);

fs.writeFileSync(appTsxPath, updatedContent);
console.log('Route added successfully');
