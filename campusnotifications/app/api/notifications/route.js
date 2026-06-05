import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Use environment variables for secrets
    const resAuth = await fetch("http://4.224.186.213/evaluation-service/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.EVAL_EMAIL,
        name: process.env.EVAL_NAME,
        rollNo: process.env.EVAL_ROLLNO,
        accessCode: process.env.EVAL_ACCESSCODE,
        clientID: process.env.EVAL_CLIENTID,
        clientSecret: process.env.EVAL_CLIENTSECRET,
      }),
    });

    const authData = await resAuth.json();
    const token = authData.access_token;

    // Fetch notifications using the token
    const res = await fetch(
      "http://4.224.186.213/evaluation-service/notifications?limit=100",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    return NextResponse.json(data.notifications || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
