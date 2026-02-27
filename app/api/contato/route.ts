import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// ---------------------------------------------------------------------------
// TODO: Activate email sending
//   1. Create a free account at https://resend.com
//   2. Get your API key from https://resend.com/api-keys
//   3. Add to .env.local (and Vercel env vars):
//        RESEND_API_KEY=re_xxxxxxxxxxxx
//        EMAIL_FROM=contato@moveofilmes.com   (must be a verified domain in Resend)
//        EMAIL_TO=contato@moveofilmes.com
//   4. Verify your domain at https://resend.com/domains
//      (or use the Resend sandbox "onboarding@resend.dev" as from address for testing)
// ---------------------------------------------------------------------------

// Rate limiting: armazena tentativas por IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Configurações de rate limiting
const MAX_REQUESTS = 5; // Máximo de 5 tentativas
const WINDOW_MS = 15 * 60 * 1000; // Janela de 15 minutos

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Criar novo registro ou resetar
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false; // Rate limit excedido
  }

  // Incrementar contador
  record.count++;
  rateLimitMap.set(ip, record);
  return true;
}

// Limpar registros antigos periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 1000); // Limpar a cada minuto

function sanitizeInput(input: string): string {
  // Remover caracteres perigosos e limitar tamanho
  return input
    .trim()
    .slice(0, 10000) // Limite máximo de caracteres
    .replace(/[<>]/g, '') // Remover tags HTML básicas
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, ''); // Remover event handlers
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    // Verificar rate limit
    const ip = getClientIP(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Por favor, tente novamente em alguns minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { nome, email, mensagem } = body;

    // Validação
    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido.' },
        { status: 400 }
      );
    }

    // Sanitizar inputs
    const sanitizedNome = sanitizeInput(nome);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMensagem = sanitizeInput(mensagem);

    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM ?? 'contato@moveofilmes.com';
    const emailTo = process.env.EMAIL_TO ?? 'contato@moveofilmes.com';

    if (resendApiKey) {
      // Email sending is active — RESEND_API_KEY is set
      const resend = new Resend(resendApiKey);
      const { error: sendError } = await resend.emails.send({
        from: emailFrom,
        to: emailTo,
        replyTo: sanitizedEmail,
        subject: `Nova mensagem de contato de ${sanitizedNome}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px;">
            <h2 style="color: #000;">Nova mensagem de contato — Moveo Filmes</h2>
            <p><strong>Nome:</strong> ${sanitizedNome}</p>
            <p><strong>Email:</strong> ${sanitizedEmail}</p>
            <hr style="border: 1px solid #eee;" />
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-line;">${sanitizedMensagem}</p>
          </div>
        `,
      });

      if (sendError) {
        console.error('Resend error:', sendError);
        return NextResponse.json(
          { error: 'Erro ao enviar mensagem. Por favor, tente novamente.' },
          { status: 500 }
        );
      }
    } else {
      // RESEND_API_KEY not set — log only (safe fallback, form still works)
      console.log('[contato] RESEND_API_KEY not set — email not sent. Message received:', {
        nome: sanitizedNome,
        email: sanitizedEmail,
        mensagem: sanitizedMensagem,
      });
    }

    return NextResponse.json(
      { message: 'Mensagem enviada com sucesso!' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro ao enviar mensagem:', errorMessage);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem. Por favor, tente novamente.' },
      { status: 500 }
    );
  }
}
