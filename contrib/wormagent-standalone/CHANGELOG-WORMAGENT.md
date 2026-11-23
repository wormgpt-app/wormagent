# WormAgent Standalone Wrapper — WormAgent.net

هذا المجلد يحتوي على الـ Wrapper الخفيف الذي يحول أي تثبيت لـ opencode إلى WormAgent.net فوراً بدون إعادة بناء.

## المميزات
- `bin/WormAgent` — wrapper ذكي يستبدل كل مخرجات opencode → WormAgent
- `bin/wormagent` — lowercase alias
- `config/` — إعدادات WormAgent.net
- `web/index.html` — موقع WormAgent.net landing page
- `install.sh` — سكريبت تثبيت `curl -fsSL https://WormAgent.net/install | bash`
- يعمل مع opencode 1.19.6 و wormagent 2.4.0

## الاستخدام
```bash
./contrib/wormagent-standalone/install.sh
WormAgent --version  # WormAgent v1.19.6 — WormAgent.net
WormAgent --help     # كل الأوامر WormAgent
```

تم إنشاؤه تلقائياً في 2026-11-23 عبر WormAgent Environment.
