# Harvest

Generate unique recipes from food products that are in season, anytime, anywhere.

---

## Setup

### Frontend

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

---

### Backend

Still in frontend:

```bash
cd ../backend
```

Create a .env file in the root and enter your database URL and OpenRouter API key(s):
```
DATABASE_URL=postgresql://postgres...
OPENROUTER_API_KEYS=sk-or-...
```

Create virtual environment:

```bash
python3.14 -m venv venv
```

Activate virtual environment:

```bash
source venv/bin/activate
```

Install backend requirements:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
uvicorn main:app --reload
```