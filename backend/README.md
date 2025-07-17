# WellSphere Backend

WellSphere is a comprehensive healthcare platform designed to streamline the management of medical practices. The backend is built using Django and Django REST Framework, following best practices for healthcare applications.

## Features

- User authentication and role-based access control (doctors, patients, staff)
- Appointment scheduling and management
- Medical records management with privacy controls
- Secure messaging system
- Billing and insurance claim processing
- Analytics and reporting
- Real-time notifications via WebSockets

## Setup

### Prerequisites

- Python 3.8+
- MySQL 8.0+
- Redis (for WebSockets and caching in production)

### Environment Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure environment variables:

Copy `.env.example` to `.env` and modify it with your configuration:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and other settings.

4. Database setup:

```bash
python manage.py migrate
python manage.py createsuperuser
```

### Running the Server

For development:

```bash
python manage.py runserver
```

For WebSockets (development):

```bash
daphne -b 0.0.0.0 -p 8001 wellsphere.asgi:application
```

## Project Structure

- `wellsphere/`: Main project directory
  - `settings/`: Split settings for different environments
  - `utils/`: Utility functions and classes
- Applications:
  - `users/`: User models, authentication, and profiles
  - `appointments/`: Appointment scheduling
  - `medical_records/`: Patient medical records
  - `messaging/`: Real-time messaging system
  - `analytics/`: Reporting and analytics
  - `billing/`: Billing and insurance claims

## Security Features

- JWT authentication
- HIPAA audit logging
- Encrypted storage for PHI
- Role-based permissions
- Access control for patient data
- Comprehensive logging

## API Documentation

API documentation is available at `/api/docs/` when running the server.

## Development Guidelines

- Follow PEP 8 coding standards
- Write tests for all new features
- Document all API endpoints
- Keep the codebase well-organized and modular
- Use clear, descriptive variable and function names
- Implement proper error handling
- Log all security-relevant events
