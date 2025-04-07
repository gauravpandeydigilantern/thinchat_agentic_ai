// Add PATCH route for contacts
import fs from 'fs';

// Read the routes file
const routesFile = fs.readFileSync('server/routes.ts', 'utf8');

// Find the contact GET route and add the PATCH route after it
const updatedFile = routesFile.replace(
  `  app.get("/api/contacts/:id", authenticateRequest, async (req, res) => {
    const user = (req as any).user;
    const contactId = parseInt(req.params.id);
    console.log("Contact ID:", contactId);
    if (isNaN(contactId)) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }

    const contact = await storage.getContact(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (contact.userId !== user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Contact belongs to another user" });
    }

    return res.status(200).json({ contact });
  });`,
  `  app.get("/api/contacts/:id", authenticateRequest, async (req, res) => {
    const user = (req as any).user;
    const contactId = parseInt(req.params.id);
    console.log("Contact ID:", contactId);
    if (isNaN(contactId)) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }

    const contact = await storage.getContact(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (contact.userId !== user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Contact belongs to another user" });
    }

    return res.status(200).json({ contact });
  });
  
  app.patch("/api/contacts/:id", authenticateRequest, async (req, res) => {
    try {
      const user = (req as any).user;
      const contactId = parseInt(req.params.id);
      if (isNaN(contactId)) {
        return res.status(400).json({ message: "Invalid contact ID" });
      }

      // Check if the contact belongs to the user
      const existingContact = await storage.getContact(contactId);
      if (!existingContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      if (existingContact.userId !== user.id) {
        return res
          .status(403)
          .json({ message: "Unauthorized: Contact belongs to another user" });
      }
      
      // Update the contact with the new data
      const contactData = { ...req.body, userId: user.id };
      const updatedContact = await storage.updateContact(contactId, contactData);

      return res.status(200).json({ contact: updatedContact });
    } catch (error) {
      console.error('Error updating contact:', error);
      return res.status(500).json({ message: "Failed to update contact" });
    }
  });`
);

// Write the updated file back
fs.writeFileSync('server/routes.ts', updatedFile);

console.log('Added PATCH route for contacts');