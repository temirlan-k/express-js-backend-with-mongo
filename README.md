## Deployed Version 
- base link: https://express-js-backend-with-mongo.onrender.com

- https://express-js-backend-with-mongo.onrender.com/api/v1/events/

- https://express-js-backend-with-mongo.onrender.com/api/v1/events?offset=0&limit=3&sortBy=rating&sortDirection=desc

- https://express-js-backend-with-mongo.onrender.com/api/v1/auth/signup

- https://express-js-backend-with-mongo.onrender.com/api/v1/auth/login

for login use my credentials

{
    "username":"temirlan",
    "password": "hashedPassword"
}


### Installation

1. git clone https://github.com/yourusername/backend-hw.git
2. cd backend-hw
3. npm install
4. npm run dev

### Setting Up Project

1. check .env.example


## API Endpoints

### Authentication

### Register a new user

- **Endpoint:** `POST api/v1/auth/signup`
- **Request Body:**

```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password",
  "city": "CityName"
}
```
### Login User

- **Endpoint:** `POST api/v1/auth/login`
- **Request Body:**

```json
{
  "username": "username",
  "password": "password",
}
```

### Events

**Get all events

Endpoint: GET api/v1/events

**with query params (pagination and sorting)

/api/v1/events?offset=0&limit=10&sortBy=rating&sortDirection=desc

Query Parameters:

    offset (optional): Number of items to skip for pagination (default: 0).

    limit (optional): Number of items to retrieve (default: 10).

    sortBy (optional): Field to sort by (e.g., rating, date). Default is rating.

    sortDirection (optional): Sort direction (asc or desc). Default is desc

**Get events by user city

    Endpoint: GET api/v1/events-by-user-city

    Headers:
        Authorization: Bearer jwt_token

**Get event by ID

    Endpoint: GET api/v1/events/:id

Create a new event

    Endpoint: POST /events
    Request Body:

```json
{
  "name": "Event Name",
  "description": "Event Description",
  "city": "CityName",
  "location": "Event Location",
  "duration": "Event Duration",
  "rating": "Event Rating"
}
```