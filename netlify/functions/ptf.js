const rateStore = new Map(); // IP -> { count, resetAt }

function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateStore.get(ip);
    if (!entry || now > entry.resetAt) {
        rateStore.set(ip, { count: 1, resetAt: now + 60000 });
        return true;
    }
    if (entry.count >= 10) return false;
    entry.count++;
    return true;
}

function jsonResponse(statusCode, body, extraHeaders = {}) {
    const allowedOrigin = process.env.URL || 'http://localhost:8888';
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            ...extraHeaders
        },
        body: JSON.stringify(body)
    };
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return jsonResponse(204, '');
    }

    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }

    const ip = (event.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
    if (!checkRateLimit(ip)) {
        return jsonResponse(429, { error: 'Çok fazla istek. Lütfen bir dakika bekleyin.' });
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        return jsonResponse(400, { error: 'Geçersiz istek formatı.' });
    }

    const { username, password, startDate, endDate } = body;

    if (!username || !password || !startDate || !endDate) {
        return jsonResponse(400, { error: 'Eksik parametre: username, password, startDate, endDate gereklidir.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = (end - start) / (1000 * 60 * 60 * 24);
    if (diffDays > 90) {
        return jsonResponse(400, { error: 'Maksimum 90 gün sorgulanabilir.' });
    }

    let tgtValue;
    try {
        const tgtRes = await fetch('https://giris.epias.com.tr/cas/v1/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            signal: AbortSignal.timeout(10000)
        });

        if (tgtRes.status === 401 || tgtRes.status === 403) {
            return jsonResponse(401, { error: 'EPİAŞ giriş bilgileri hatalı.' });
        }
        if (!tgtRes.ok) {
            throw new Error(`TGT isteği başarısız: ${tgtRes.status}`);
        }

        // TGT Location header'ında veya body'de gelebilir
        const location = tgtRes.headers.get('location') || '';
        const bodyText = await tgtRes.text();
        const tgtMatch = (location + ' ' + bodyText).match(/TGT-[A-Za-z0-9_\-]+/);
        if (!tgtMatch) {
            throw new Error('TGT alınamadı.');
        }
        tgtValue = tgtMatch[0];
    } catch (err) {
        if (err.name === 'TimeoutError' || err.name === 'AbortError') {
            return jsonResponse(504, { error: 'EPİAŞ servisi yanıt vermiyor, tekrar deneyin.' });
        }
        console.error('TGT error:', err.message);
        return jsonResponse(502, { error: 'EPİAŞ giriş servisi hatası.' });
    }

    try {
        const ptfRes = await fetch('https://seffaflik.epias.com.tr/electricity-service/v1/markets/dam/data/mcp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'TGT': tgtValue
            },
            body: JSON.stringify({ startDate, endDate }),
            signal: AbortSignal.timeout(15000)
        });

        if (!ptfRes.ok) {
            throw new Error(`PTF isteği başarısız: ${ptfRes.status}`);
        }

        const ptfData = await ptfRes.json();
        const prices = (ptfData.items || []).map(item => ({
            date: item.date,
            price: item.price
        }));

        return jsonResponse(200, { prices });
    } catch (err) {
        if (err.name === 'TimeoutError' || err.name === 'AbortError') {
            return jsonResponse(504, { error: 'EPİAŞ servisi yanıt vermiyor, tekrar deneyin.' });
        }
        console.error('PTF error:', err.message);
        return jsonResponse(502, { error: 'PTF verisi alınamadı.' });
    }
};
