import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { accessKey } = await request.json()

    if (accessKey === process.env.ADMIN_ACCESS_KEY) {
      return NextResponse.json({ success: true, authenticated: true })
    } else {
      return NextResponse.json({ success: false, error: "Invalid access key" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
