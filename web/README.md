This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Option 1: Using Docker (Recommended)

1. Build the Docker image:

   ```bash
   docker build -t neonlink-web .
   ```

2. Run the container:

   ```bash
   docker run --env-file .env -p 3000:3000 neonlink-web
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Option 2: Local Development

If you prefer to run the development server directly:

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Docker Support

This project includes Docker support for containerized development and production deployments.

### Building the Docker Image

```bash
docker build -t neonlink-web .
```

### Running the Container

```bash
docker run --env-file .env -p 3000:3000 neonlink-web
```

This will:

- Use the environment variables from your local `.env` file
- Map port 3000 from the container to your host machine
- Start the Next.js application in production mode

### Environment Variables

Make sure your `.env` file includes all required environment variables, including:

- `NEXT_PUBLIC_BASE_URL`
- `STREAM_API_KEY`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

4. Key Features to Implement
   Voting System
   Upvote/downvote buttons with visual feedback
   Vote count formatting (K, M)
   Optimistic UI updates
   Threading
   Proper indentation based on depth
   Collapse/expand functionality
   Smooth transitions
   Responsive Design
   Mobile-friendly layout
   Adjustable font sizes
   Touch-friendly targets
   Accessibility
   Keyboard navigation
   ARIA labels
   Focus management
5. Performance Optimizations
   Virtualize long comment threads
   Memoize comment components
   Lazy load images/media
