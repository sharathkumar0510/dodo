# Dodo Services - Home Services Booking Platform

A comprehensive platform for booking home services like cleaning, plumbing, electrical, and more. The platform consists of three main applications:

1. **Customer App**: For end users to browse and book services
2. **Vendor App**: For service providers to manage bookings and services
3. **Admin Panel**: For platform administrators to oversee operations

## Features

### PWA (Progressive Web App) Features
- Offline functionality
- Background synchronization
- Push notifications
- Installable on devices
- Responsive design for all screen sizes

### SEO Features
- Optimized metadata
- Structured data (JSON-LD)
- Sitemaps
- Robots.txt configuration
- OpenGraph and Twitter card support

### Core Features
- User authentication with OTP
- Role-based access control
- Service booking and management
- Real-time notifications
- Responsive design

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **PWA Support**: Service Workers, IndexedDB

### Backend
- **Framework**: Django
- **Architecture**: Microservices
- **Authentication**: JWT with OTP (MSG91 integration)
- **Database**: PostgreSQL (planned)

## Project Structure

```
dodo/
├── backend/                # Django backend
│   ├── auth_service/       # Authentication microservice
│   ├── user_service/       # User management microservice
│   ├── core/               # Core functionality
│   ├── roles/              # Role-based access control
│   ├── pwa_seo/            # PWA and SEO support
│   └── dodo_backend/       # Main Django project
├── frontend/
│   ├── customer-app/       # Next.js customer-facing app
│   ├── vendor-app/         # Next.js vendor portal
│   └── admin-panel/        # Next.js admin dashboard
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- Django (v4.2+)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (Customer App)
1. Navigate to the customer app directory:
   ```bash
   cd frontend/customer-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Frontend Setup (Vendor App)
1. Navigate to the vendor app directory:
   ```bash
   cd frontend/vendor-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Frontend Setup (Admin Panel)
1. Navigate to the admin panel directory:
   ```bash
   cd frontend/admin-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3002](http://localhost:3002) in your browser

## PWA and SEO Features

### PWA Implementation
- Service worker for offline functionality
- Background sync for offline actions
- Push notifications for real-time updates
- Manifest files for installability
- Offline pages and indicators

### SEO Implementation
- Dynamic metadata generation
- Structured data for rich results
- Sitemaps for better indexing
- Robots.txt for crawler control
- OpenGraph and Twitter cards for social sharing

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- [Next.js](https://nextjs.org/)
- [Django](https://www.djangoproject.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
