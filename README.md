# Applicant Tracking System (ATS) – Backend 🚀

Detta är ett kraftfullt och säkert backend-system byggt för att effektivisera rekryteringsprocesser. Applikationen hanterar olika användarroller, validering av data och molnbaserad bildhantering.

## ✨ Funktioner

- **Autentisering & Auktorisering:** Säker hantering av användare med JWT (JSON Web Tokens) och krypterade lösenord via Bcrypt.
- **Rollbaserad åtkomst (RBAC):** Separata logikflöden för **Rekryterare (HR)** och **Kandidater**.
- **Robust Validering:** All inmatning från klienten valideras med `express-validator` innan den når databasen för att säkerställa hög datakvalitet.
- **Molnbaserad Bildhantering:** Integration med **Cloudinary** för säker uppladdning och lagring av profilbilder eller dokument.
- **Säker Middleware:** Egendefinierad middleware som verifierar tokens och bifogar användardata till förfrågningar.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Databas:** MongoDB med Mongoose (ODM)
- **Säkerhet:** JSON Web Tokens (JWT), Bcrypt
- **Filhantering:** Cloudinary API
- **Validering:** Express-validator

## 🚀 Kom igång

### Förutsättningar

- Node.js installerat på din maskin
- Ett MongoDB-kluster (t.ex. MongoDB Atlas)
- Ett konto hos Cloudinary för mediahantering

### Installation

1. **Klona repot:**

   ```bash
   git clone [https://github.com/ditt-användarnamn/ats-backend.git](https://github.com/ditt-användarnamn/ats-backend.git)
   cd ats-backend
   ```

2. **Installera beroenden:**

   ```bash
   npm install
   ```

3. **Konfigurera miljövariabler:**
   **Skapa en .env-fil i rotkatalogen och lägg till följande variabler:\***

   ```bash
   PORT=5000
   MONGO_URI=din_mongodb_uri
   JWT_SECRET=din_superhemliga_nyckel
   CLOUDINARY_CLOUD_NAME=ditt_cloud_name
   CLOUDINARY_API_KEY=din_api_nyckel
   CLOUDINARY_API_SECRET=din_api_secret
   ```

4. **Starta servern:**

   ```bash
   # För utveckling (med nodemon)
   npm run dev

   # För produktion
   npm start
   ```

## 👨‍💻 Utvecklare

**Manau – Fullstack Web Developer Student vid Nackademin.**
