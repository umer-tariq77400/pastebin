# Pastebin - AI-Powered Code Sharing

A modern, full-stack code snippet sharing application featuring syntax highlighting, secure sharing, and AI-powered code reviews. Built with Django REST Framework and React.

[GitHub Repo](https://github.com/umer-tariq77400/pastebin) | [Live Demo](https://white-coast-09ac14e00.3.azurestaticapps.net)

## 🚀 Key Features

*   **Create & Manage Snippets**: effortless code pasting with automatic syntax highlighting for dozens of languages.
*   **AI Code Review**: Integrated Gemini AI provides instant feedback and suggestions for your code snippets.
*   **Secure Sharing**: Share snippets via unique links. Password protection ensures your sensitive code remains private.
*   **User Authentication**: Secure user accounts to manage your snippet history.

## 🛠️ Tech Stack

### Backend
*   **Framework**: Django 5 & Django REST Framework (DRF)
*   **Database**: PostgreSQL (Supabase) 
*   **AI Integration**: Google Gemini API.
*   **Utilities**: `pygments` for syntax highlighting, `django-cors-headers` for cross-origin requests.

### Frontend
*   **Framework**: React 19 + Vite 7
*   **Http Client**: Axios
*   **Testing**: Vitest + React Testing Library

## 🧪 Testing

The project maintains a robust testing suite:
*   **Backend**: Django `APITestCase` covers all API endpoints including auth, snippet operations, and mock AI reviews.
    *   Run: `python manage.py test snippets`
*   **Frontend**: Unit tests with Vitest and React Testing Library ensure component reliability.
    *   Run: `npm run test` (in `frontend` directory)

## 📦 Deployment

The application utilizes a fully automated CI/CD pipeline via GitHub Actions:
*   **Frontend**: Deployed to **Azure Static Web Apps**.
*   **Backend**: Deployed to **Azure App Service**.

## 🔧 Local Setup

1.  **Clone the repository**
2.  **Backend Setup**:
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # or .venv\Scripts\activate on Windows
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```
3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
