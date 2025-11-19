import type { APIRoute } from 'astro';
import { db, Subscribers, eq } from 'astro:db';


export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.formData();
        const email = data.get('email');

        if (!email || typeof email !== 'string') {
            return new Response(JSON.stringify({
                success: false,
                message: 'Email is required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid email format'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Insert into database
        await db.insert(Subscribers).values({
            email: email.toLowerCase().trim(),
            createdAt: new Date(),
        });

        return new Response(JSON.stringify({
            success: true,
            message: 'Successfully subscribed!'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        // Check for unique constraint violation
        if (error.message?.includes('UNIQUE')) {
            return new Response(JSON.stringify({
                success: false,
                message: 'This email is already subscribed'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.error('Newsletter subscription error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'An error occurred. Please try again.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
