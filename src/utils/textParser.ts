import { getRelativeDate } from '../data/mockData';

export interface ParsedRecord {
  type: 'cita' | 'pedido';
  clientName: string;
  clientPhone: string;
  itemOrService: string;
  date: string;
  time: string;
  amount: number;
  deposit: number;
  address: string;
  notes: string;
  rawText: string;
}

export function parseUnstructuredText(text: string): ParsedRecord {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // 1. Detect Phone
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
  const phoneMatch = clean.match(phoneRegex);
  const clientPhone = phoneMatch ? phoneMatch[0].trim() : '';

  // 2. Detect Client Name
  let clientName = '';
  const namePatterns = [
    /(?:a nombre de|nombre:\s*|cliente:\s*|soy\s+|para\s+)([A-ZÁÉÍÓÚÑa-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+)?)/i,
    /(?:atn|cliente)\s*:\s*([A-Za-zÁÉÍÓÚáéíóúñÑ ]+)/i,
  ];
  for (const pat of namePatterns) {
    const match = clean.match(pat);
    if (match && match[1]) {
      clientName = match[1].trim();
      break;
    }
  }
  if (!clientName) {
    // Fallback: check greeting like "Hola soy Maria" or "Hola Carlos"
    const greetMatch = clean.match(/hola,?\s+(?:soy\s+)?([A-ZÁÉÍÓÚÑa-záéíóúñ]+)/i);
    if (greetMatch && greetMatch[1] && !['buenas', 'buenos', 'amiga', 'amigo'].includes(greetMatch[1].toLowerCase())) {
      clientName = greetMatch[1];
    }
  }

  // 3. Detect Date
  let date = getRelativeDate(0);
  if (lower.includes('mañana')) {
    date = getRelativeDate(1);
  } else if (lower.includes('pasado mañana')) {
    date = getRelativeDate(2);
  } else {
    // Check day names: lunes, martes, miercoles, jueves, viernes, sabado, domingo
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes', 'sábado', 'sabado'];
    const currentDay = new Date().getDay(); // 0 is Sunday
    for (let i = 0; i < days.length; i++) {
      const dName = days[i];
      if (lower.includes(dName)) {
        const targetDay = i > 4 && (dName === 'miercoles' || dName === 'sabado') ? (dName === 'miercoles' ? 3 : 6) : (i % 7);
        let diff = targetDay - currentDay;
        if (diff <= 0) diff += 7; // next occurrence
        date = getRelativeDate(diff);
        break;
      }
    }
    // Check specific day format like "el 15", "el 20 de octubre"
    const dateNumMatch = lower.match(/(?:el|día)\s+(\d{1,2})(?:\s+de\s+[a-z]+)?/i);
    if (dateNumMatch && dateNumMatch[1]) {
      const dayNum = parseInt(dateNumMatch[1], 10);
      if (dayNum >= 1 && dayNum <= 31) {
        const now = new Date();
        const d = new Date(now.getFullYear(), now.getMonth(), dayNum);
        date = d.toISOString().split('T')[0];
      }
    }
  }

  // 4. Detect Time
  let time = '11:00';
  const timeMatch = lower.match(/(?:a las\s+|las\s+|@\s*)?(\d{1,2})(?::(\d{2}))?\s*(am|pm|de la tarde|de la mañana|hrs|horas)?/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2] ? timeMatch[2] : '00';
    const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : '';

    if (ampm.includes('pm') || ampm.includes('tarde')) {
      if (hours < 12) hours += 12;
    } else if (ampm.includes('am') || ampm.includes('mañana')) {
      if (hours === 12) hours = 0;
    } else if (hours >= 1 && hours <= 7) {
      // Small business default assumption for 1-7 without am/pm: usually afternoon
      hours += 12;
    }
    time = `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  // 5. Detect Money / Amounts / Deposit
  let amount = 0;
  let deposit = 0;

  const totalMatch = lower.match(/(?:total|costo|precio|monto)\s*(?:de)?\s*\$?(\d+(?:\.\d{2})?)/i);
  if (totalMatch) {
    amount = parseFloat(totalMatch[1]);
  }

  const depositMatch = lower.match(/(?:anticipo|adelanto|deposito|transferí|pague|pagué|abono)\s*(?:de)?\s*\$?(\d+(?:\.\d{2})?)/i);
  if (depositMatch) {
    deposit = parseFloat(depositMatch[1]);
  }

  // If no labeled total, search for generic dollar amounts
  if (amount === 0) {
    const genericMoney = clean.match(/\$(\d+(?:\.\d{2})?)/g);
    if (genericMoney && genericMoney.length > 0) {
      const nums = genericMoney.map((m) => parseFloat(m.replace('$', '')));
      if (nums.length === 1) {
        amount = nums[0];
      } else {
        amount = Math.max(...nums);
        deposit = Math.min(...nums);
      }
    }
  }

  // 6. Detect Address / Delivery
  let address = '';
  const addrMatch = clean.match(/(?:domicilio en|entrega en|dirección:|calle|av\.|colonia|col\.)\s*([^,.\n]+(?:,[^.\n]+)?)/i);
  if (addrMatch) {
    address = addrMatch[0].trim();
  }

  // 7. Detect Item or Service
  let itemOrService = '';
  const serviceKeywords = [
    'corte y barba',
    'corte de cabello',
    'corte clasico',
    'corte clásico',
    'perfilado de barba',
    'tinte',
    'peinado',
    'pastel tres leches',
    'pastel de chocolate',
    'pastel',
    'cupcakes',
    'bocadillos',
    'vestido',
    'bolso',
    'joyería',
    'zapatillas',
    'diseño de logotipo',
    'diseño de logo',
    'sesión fotográfica',
    'menú digital',
  ];

  for (const kw of serviceKeywords) {
    if (lower.includes(kw)) {
      itemOrService = kw.charAt(0).toUpperCase() + kw.slice(1);
      break;
    }
  }

  if (!itemOrService) {
    // Extract after "para" or "cita de" or "pedido de" or "quiero"
    const generalMatch = clean.match(/(?:cita (?:de|para)|pedido (?:de|para)|quiero (?:apartar|encargar|pedir))\s+([^,.\n]+)/i);
    if (generalMatch && generalMatch[1]) {
      itemOrService = generalMatch[1].trim();
    } else {
      itemOrService = 'Servicio / Pedido Especial';
    }
  }

  // 8. Decide appointment vs order
  const appointmentKeywords = ['cita', 'corte', 'barba', 'estilista', 'sesion', 'sesión', 'reunion', 'reunión', 'turno', 'salon', 'salón'];
  const orderKeywords = ['pastel', 'encargo', 'pedido', 'envío', 'domicilio', 'cupcakes', 'bocadillos', 'vestido', 'bolso', 'anticipo', 'transferí', 'recoger'];

  let apptScore = 0;
  let orderScore = 0;

  for (const ak of appointmentKeywords) {
    if (lower.includes(ak)) apptScore++;
  }
  for (const ok of orderKeywords) {
    if (lower.includes(ok)) orderScore++;
  }

  const type: 'cita' | 'pedido' = orderScore > apptScore ? 'pedido' : 'cita';

  return {
    type,
    clientName: clientName || 'Cliente de WhatsApp',
    clientPhone: clientPhone || '',
    itemOrService,
    date,
    time,
    amount,
    deposit,
    address,
    notes: clean,
    rawText: clean,
  };
}

export const SAMPLE_UNSTRUCTURED_MESSAGES = [
  {
    title: '💬 WhatsApp de Barbería (Cita)',
    text: 'Hola amigo, me apartas una cita de corte y barba para mañana a las 4:30 pm porfa? Soy Carlos Mendoza mi cel es 5541982341. Me confirmas!',
  },
  {
    title: '🎂 WhatsApp de Pastelería (Encargo con anticipo)',
    text: 'Buenas tardes! Quiero encargar un pastel tres leches familiar para este viernes a las 3:00 pm a nombre de Mariana Silva cel 5589123456. Total de $450, ya te transferí $200 de anticipo. Entrega a domicilio en Calle Jazmines 24.',
  },
  {
    title: '🛍️ Mensaje de Tienda / Showroom (Pedido & Envío)',
    text: 'Hola me apartas el Vestido Lino Boho Talla M que vi en tus historias. Costo de $420, te hago la transferencia completa. A nombre de Sofía Valenzuela cel 5533112244, envío por paquetería a Av Hidalgo 100.',
  },
  {
    title: '📝 Nota rápida de Libreta de Papel',
    text: 'Cliente: Roberto Gómez tel 5576543210. Cita sábado 11am para perfilado de barba con toalla caliente. Pagar en efectivo.',
  },
];
