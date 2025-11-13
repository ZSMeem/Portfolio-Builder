 The program structure:

 portfolio-builder/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.js
│   │   │   ├── login/
│   │   │   │   └── route.js
│   │   │   └── me/
│   │   │       └── route.js
│   │   ├── portfolios/
│   │   │   ├── route.js
│   │   │   └── [id]/
│   │   │       └── route.js
│   │   └── projects/
│   │       ├── route.js
│   │       └── [id]/
│   │           └── route.js
├── lib/
│   ├── db.js
│   ├── auth.js
│   └── utils.js
├── middleware.js
├── components/
├── .env.local
└── package.json