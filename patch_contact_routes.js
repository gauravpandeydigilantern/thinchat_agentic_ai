const fs = require('fs');

// Read the current file
const routesFile = fs.readFileSync('server/routes.ts', 'utf8');

// Define the new create contact route
const newCreateContactRoute = `  app.post("/api/contacts", authenticateRequest, async (req, res) => {
    try {
      const user = (req as any).user;
      
      // Let's handle the company and contact data properly for synchronization
      const contactData = {
        ...req.body,
        userId: user.id,
      };
      
      // If companyId is provided, look up the company to set the company name properly
      if (contactData.companyId) {
        const company = await storage.getCompany(contactData.companyId);
        
        if (company && company.userId === user.id) {
          // Ensure companyName matches the company record
          contactData.companyName = company.name;
          
          // If industry is not set but available from company, use it
          if (!contactData.industry && company.industry) {
            contactData.industry = company.industry;
          }
        } else {
          // Company not found or doesn't belong to user
          delete contactData.companyId;
        }
      }
      
      // Create a new company if companyName is provided but no companyId
      if (contactData.companyName && !contactData.companyId && !req.body.skipCompanyCreation) {
        try {
          // Check if a company with this name already exists for this user
          const existingCompanies = await storage.getCompaniesByUser(user.id);
          const existingCompany = existingCompanies.find(
            c => c.name.toLowerCase() === contactData.companyName.toLowerCase()
          );
          
          if (existingCompany) {
            // Use existing company
            contactData.companyId = existingCompany.id;
          } else {
            // Create new company
            const newCompany = await storage.createCompany({
              name: contactData.companyName,
              userId: user.id,
              industry: contactData.industry,
              location: contactData.location,
              website: null,
              description: null,
              size: contactData.teamSize,
              foundedYear: null,
              logo: null,
              linkedInUrl: null,
              twitterUrl: null,
              facebookUrl: null,
            });
            
            contactData.companyId = newCompany.id;
          }
        } catch (companyError) {
          console.error("Error handling company creation:", companyError);
          // Continue without company association
        }
      }

      const validatedData = insertContactSchema.parse(contactData);
      const contact = await storage.createContact(validatedData);

      return res.status(201).json({ contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      console.error("Error creating contact:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });`;

// Define the new patch contact route
const newPatchContactRoute = `  app.patch('/api/contacts/:id', authenticateRequest, async (req, res) => {
    try {
      const user = (req as any).user;
      const contactId = parseInt(req.params.id);
      let contactData = req.body;
      
      console.log("PATCH Contact ID:", contactId);
      console.log("PATCH Contact data:", contactData);
      
      // Check if the contact belongs to the user
      const existingContact = await storage.getContact(contactId);
      if (!existingContact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      if (existingContact.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to update this contact" });
      }
      
      // If companyId is provided, look up the company to set the company name properly
      if (contactData.companyId) {
        const company = await storage.getCompany(contactData.companyId);
        
        if (company && company.userId === user.id) {
          // Ensure companyName matches the company record
          contactData.companyName = company.name;
          
          // If industry is not set but available from company, use it
          if (!contactData.industry && company.industry) {
            contactData.industry = company.industry;
          }
        } else {
          // Company not found or doesn't belong to user
          delete contactData.companyId;
        }
      }
      
      // Create a new company if companyName is changed but no companyId
      if (contactData.companyName && 
          contactData.companyName !== existingContact.companyName && 
          !contactData.companyId && 
          !req.body.skipCompanyCreation) {
        try {
          // Check if a company with this name already exists for this user
          const existingCompanies = await storage.getCompaniesByUser(user.id);
          const existingCompany = existingCompanies.find(
            c => c.name.toLowerCase() === contactData.companyName.toLowerCase()
          );
          
          if (existingCompany) {
            // Use existing company
            contactData.companyId = existingCompany.id;
          } else {
            // Create new company
            const newCompany = await storage.createCompany({
              name: contactData.companyName,
              userId: user.id,
              industry: contactData.industry || existingContact.industry,
              location: contactData.location || existingContact.location,
              website: null,
              description: null,
              size: contactData.teamSize || existingContact.teamSize,
              foundedYear: null,
              logo: null,
              linkedInUrl: null,
              twitterUrl: null,
              facebookUrl: null,
            });
            
            contactData.companyId = newCompany.id;
          }
        } catch (companyError) {
          console.error("Error handling company creation:", companyError);
          // Continue without company association
        }
      }
      
      // Update the contact with all provided data
      const updatedContact = await storage.updateContact(contactId, contactData);
      return res.status(200).json(updatedContact);
    } catch (error) {
      console.error("Error updating contact with PATCH:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });`;

// Find and replace the POST contact route
const postContactRoutePattern = /app\.post\("\/api\/contacts"[\s\S]*?try[\s\S]*?return res\.status\(500\)[\s\S]*?\}\s*\}\);/;
const updatedWithPost = routesFile.replace(postContactRoutePattern, newCreateContactRoute);

// Find and replace the PATCH contact route
const patchContactRoutePattern = /app\.patch\('\/api\/contacts\/:id'[\s\S]*?try[\s\S]*?return res\.status\(500\)[\s\S]*?\}\s*\}\);/;
const updatedWithBoth = updatedWithPost.replace(patchContactRoutePattern, newPatchContactRoute);

// Write the updated file back
fs.writeFileSync('server/routes.ts', updatedWithBoth);

console.log('Updated contact routes with improved company integration');
