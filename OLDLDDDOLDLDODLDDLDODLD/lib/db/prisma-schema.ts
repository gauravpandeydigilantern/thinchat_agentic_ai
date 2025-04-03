// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
    provider = "prisma-client-js"
  }
  
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  
  model User {
    id                     String    @id @default(cuid())
    name                   String?
    email                  String    @unique
    emailVerified          Boolean   @default(false)
    verificationToken      String?
    verificationTokenExpires DateTime?
    password               String
    companyName            String?
    productTier            String    @default("basic") // "basic", "professional", "enterprise"
    features               String[]  @default([])
    image                  String?
    createdAt              DateTime  @default(now())
    updatedAt              DateTime  @updatedAt
    
    // Relations
    accounts               Account[]
    sessions               Session[]
    apiKeys                ApiKey[]
    leads                  Lead[]
    lists                  List[]
    promptHistory          PromptHistory[]
  }
  
  model Account {
    id                String  @id @default(cuid())
    userId            String
    type              String
    provider          String
    providerAccountId String
    refresh_token     String? @db.Text
    access_token      String? @db.Text
    expires_at        Int?
    token_type        String?
    scope             String?
    id_token          String? @db.Text
    session_state     String?
  
    user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
    @@unique([provider, providerAccountId])
  }
  
  model Session {
    id           String   @id @default(cuid())
    sessionToken String   @unique
    userId       String
    expires      DateTime
    user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  }
  
  model ApiKey {
    id        String   @id @default(cuid())
    userId    String
    provider  String   // "openai", "anthropic", "google", etc.
    key       String   // Encrypted in a real app
    isActive  Boolean  @default(true)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    
    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  }
  
  model Lead {
    id              String   @id @default(cuid())
    userId          String
    fullName        String?
    firstName       String?
    lastName        String?
    email           String?
    phone           String?
    company         String?
    title           String?
    linkedinUrl     String?
    website         String?
    industry        String?
    location        String?
    seniority       String?
    department      String?
    employeeSize    String?
    score           Int?     @default(0)
    status          String   @default("new") // "new", "contacted", "qualified", "converted", "archived"
    source          String?
    notes           String?
    enriched        Boolean  @default(false)
    createdAt       DateTime @default(now())
    updatedAt       DateTime @updatedAt
    
    user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    lists           ListLead[]
  }
  
  model List {
    id              String   @id @default(cuid())
    userId          String
    name            String
    description     String?
    type            String   // "contact", "company", "email"
    isDefault       Boolean  @default(false)
    createdAt       DateTime @default(now())
    updatedAt       DateTime @updatedAt
    
    user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    leads           ListLead[]
  }
  
  model ListLead {
    id              String   @id @default(cuid())
    listId          String
    leadId          String
    createdAt       DateTime @default(now())
    
    list            List     @relation(fields: [listId], references: [id], onDelete: Cascade)
    lead            Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)
    
    @@unique([listId, leadId])
  }
  
  model PromptHistory {
    id              String   @id @default(cuid())
    userId          String
    prompt          String   @db.Text
    response        String   @db.Text
    model           String
    createdAt       DateTime @default(now())
    
    user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  }
  
  model UploadJob {
    id              String   @id @default(cuid())
    userId          String
    fileName        String
    fileSize        Int
    fileType        String
    status          String   @default("pending") // "pending", "processing", "completed", "failed"
    progress        Int      @default(0)
    totalRecords    Int      @default(0)
    processedRecords Int     @default(0)
    errorMessage    String?
    createdAt       DateTime @default(now())
    updatedAt       DateTime @updatedAt
  }