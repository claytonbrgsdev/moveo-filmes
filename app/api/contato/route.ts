import { NextRequest, NextResponse } from 'next/server';

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

    // Aqui você pode integrar com um serviço de email real
    // Por exemplo: Resend, SendGrid, Nodemailer, etc.
    // Por enquanto, vamos apenas logar e retornar sucesso
    
    // Exemplo com Resend (descomente e configure quando tiver a API key):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'contato@moveofilmes.com',
      to: 'contato@moveofilmes.com',
      replyTo: sanitizedEmail,
      subject: `Nova mensagem de contato de ${sanitizedNome}`,
      html: `
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${sanitizedNome}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${sanitizedMensagem.replace(/\n/g, '<br>')}</p>
      `,
    });
    */

    // Log para desenvolvimento (remover em produção)
    console.log('Nova mensagem de contato:', {
      nome: sanitizedNome,
      email: sanitizedEmail,
      mensagem: sanitizedMensagem,
    });

    return NextResponse.json(
      { message: 'Mensagem enviada com sucesso!' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error : new Error('Erro desconhecido');
    console.error('Erro ao enviar mensagem:', errorMessage);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem. Por favor, tente novamente.' },
      { status: 500 }
    );
  }
}

