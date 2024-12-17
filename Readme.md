# AI Quizzer Backend

The **AI Quizzer Backend** is a microservice designed to manage student quizzes and scores, offering functionalities like authentication, quiz generation, submission, history retrieval, and filtering. It also integrates JWT security and optional AI-based features for enhanced user experience.

---

## Features

### Core Functionalities

#### Authentication
- Mock authentication service for username/password validation.
- Returns a signed JWT for securing API requests.

#### Quiz Management
- **Quiz Generation**: Create quizzes dynamically based on grade, subject, and difficulty.
- **Quiz Submission**: Accepts answers and evaluates scores.
- **Quiz History**: Retrieve quiz records filtered by:
  - Grade, subject, and marks.
  - Date range (e.g., from `01/09/2024` to `09/09/2024`).
- **Retry Quiz**: Allows reattempting quizzes while retaining old submissions.

---

## Technologies Used
- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB (NoSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Groq 
- **Deployment**: [Render.com](https://ai-quizzer-177r.onrender.com)
- **Docker Image**: [Docker](https://hub.docker.com/r/aayush2302/ai-quizzer/)



## Installation

### Prerequisites
- Node.js (v14 or above)
- MongoDB installed and running
- Docker (for containerization)

### Steps to Run Locally
 

### Installation

#### Prerequisites
- Node.js (v14 or above)
- MongoDB installed and running

#### Steps to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=<Your MongoDB Connection String>
   JWT_SECRET=<Your Secret Key>
   GROQ_API=<Your Secret key>
   ```

4. Start the server:
   ```bash
   npx nodemon server.js
   ```

5. Access the API at [http://localhost:5000/](http://localhost:5000/).

---

### API Endpoints

## 1. Authentication

**Endpoint**: `/api/auth/login`  
**Method**: `POST`  

**Request Body**:
```json
{
  "username": "user123",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "<JWT Token>"
}
```

---

## 2. Quiz Management

### Generate Quiz
**Endpoint**: `/api/quiz/create`  
**Method**: `POST`  

**Headers**:
```json
{ "Authorization": "Bearer <JWT Token>" }
```

**Request Body**:
```json
{
    "Grade":"11",
    "Subject":"Chemistry",
    "TotalQuestions":"10",
    "MaxScore":"10",
    "Difficulty":"EASY"
}
```

**Response**:
```json
{
        "result": {
            "score": 0,
            "TotalQuestions": 0,
            "percentage": 0
        },
        "_id": "6740aeac431dfb58fb79530a",
        "title": "11 Maths Quiz",
        "grade": "11",
        "subject": "Maths",
        "instructions": "Answer all the questions carefully.",
        "questions": [
            {
                "_id": "1",
                "questionText": "Solve for x: 2x + 5 = 11",
                "options": [
                    {
                        "id": "1",
                        "option": "x = 2",
                        "_id": "..."
                    },
                    {
                        "id": "2",
                        "option": "x = 3",
                        "_id": "..."
                    },
                    {
                        "id": "3",
                        "option": "x = 4",
                        "_id": "..."
                    },
                    {
                        "id": "4",
                        "option": "x = 5",
                        "_id": "..."
                    }
                ],
                "__v": 0
            }
        }
    }
}
```

---

### Submit Quiz
**Endpoint**: `/api/quiz/submit`  
**Method**: `POST`  

**Headers**:
```json
{ "Authorization": "Bearer <JWT Token>" }
```

**Request Body**:
```json
{
    "quizId": "123",
    "userAnswers": [
        { "questionId": "...", "selectAnswer": "1" },
    ]
}

```

**Response**:
```json
{
    "success": true,
    "data": "Quiz submitted successfully",
    "result": {
        "score": 0,
        "TotalQuestions": 10,
        "percentage": 0
    }
}
```

---

### Retrieve Quiz History
**Endpoint**: `/api/quiz/uniqueQuizzes`  
**Method**: `GET`  

**Headers**:
```json
{ "Authorization": "Bearer <JWT Token>" }
```

**Response**:
```json
{
  "success": true,
  "history": [
    {
      "quizId": "<Quiz ID>",
      "title": "Math Quiz",
      "grade": "10",
      "subject": "Mathematics",
      "score": 8,
      "percentage": 80,
      "completedDate": "2024-09-01T12:00:00Z"
    }
  ]
}
```

---

### Deployment

#### Using Docker
1. Build the Docker image:
   ```bash
   docker build -t ai-quizzer-backend .
   ```
2. To Run Docker image:
    ```bash
   docker run -p 5000:5000 --env-file .env ai-quizzer-backend
   ```
---

### Project Structure
```plaintext
ai-quizzer-backend/
├── controllers/
│   ├── authController.js
│   ├── checkAnswerCotroller.js
│   ├── createQuizController.js
│   ├── filterController.js
│   ├── historyController.js
├── lib/
│   ├── utils/
│       ├── generateToken.js
├── middlewares/
│   ├── protectRoute.js
├── models/
│   ├── quiz.model.js
│   ├── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── createQuiz.routes.js
│   ├── filter.routes.js
│   ├── history.routes.js
├── .env
├── app.js
├── server.js
├── Dockerfile
├── README.md
```

---

### Additional Notes
- **API Documentation**: https://documenter.getpostman.com/view/27279139/2sAYBUCBgK.
- **Docker**: https://hub.docker.com/r/aayush2302/ai-quizzer
```