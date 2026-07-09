# Portfolio Frontend + Admin Panel

This frontend contains:

- The public portfolio website
- A separate admin panel for managing content
- Dynamic data integration with the Node/Express backend

## Public vs Admin

- Public site loads on the main domain
- Admin panel loads automatically on `admin.yourdomain.com`
- You can also open the admin panel locally at `/admin`

## Environment

Set the backend API base URL in a Vite env file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Admin Features

The admin panel supports:

- Login/logout
- Dashboard stats
- Profile edit
- Password change
- Admin user management
- Site settings update
- About section update
- Services CRUD
- Projects CRUD
- Testimonials CRUD
- Blogs CRUD
- Timeline CRUD
- Contacts moderation
- Newsletter moderation

## Images

Media fields support:

- Image URL paste
- File upload from the local machine

The uploaded file is converted to a data URL and stored through the backend as a string.

## Default Admin

Use the backend seeded admin credentials:

- Email: `mianhaseebikd@gmail.com`
- Password: `h@$eeb16`

## Notes

- Make sure the backend is running before opening the frontend
- The admin panel uses the backend auth token stored in `localStorage`
- Image uploads work best with small optimized images

