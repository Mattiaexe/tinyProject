import { NextRequest, NextResponse } from "next/server";
//importa utulity e tipi di next per gestire la richiesta 

export async function POST(req: NextRequest) { 
  //funzione post 
  const { message } = await req.json();
// il messaggio viene letto ma non utilizzto
  return NextResponse.json({ reply: "Hello from the server " });
}

