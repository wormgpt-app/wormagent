# WormAgent.net 🌀

**The Next Generation AI Coding Agent** — Rebranded from [opencode](https://opencode.ai)

> **Site:** https://WormAgent.net  
> **Original:** opencode v1.19.6  
> **Edition:** WormAgent v1.19.6

## ⚡ التثبيت

```bash
# عبر WormAgent.net
curl -fsSL https://WormAgent.net/install | bash

# أو محلياً
./install.sh

# تحقق
WormAgent --version
wormagent --help
```

## 📁 الهيكل

```
WormAgent/
├── bin/
│   ├── WormAgent      # Wrapper رئيسي
│   └── wormagent      # نسخة lowercase
├── config/
│   ├── WormAgent.json # إعدادات WormAgent
│   └── opencode.json  # إعدادات التوافق
├── web/
│   └── index.html     # موقع WormAgent.net
├── install.sh         # سكريبت التثبيت
└── README.md
```

## 🔄 ما تم تغييره

| الأصلي | الجديد |
|--------|--------|
| `opencode` | `WormAgent` / `wormagent` |
| `opencode.ai` | `WormAgent.net` |
| `~/.opencode/bin/opencode` | `~/.opencode/bin/WormAgent` + wrapper |
| `opencode.json` schema | `https://WormAgent.net/schema.json` |

## 🚀 الاستخدام

```bash
WormAgent                    # فتح الواجهة التفاعلية
WormAgent run "ابنِ API"    # تشغيل بأمر مباشر
WormAgent --help             # المساعدة
```

كل أوامر `opencode` تعمل بنفس الطريقة عبر `WormAgent`.

## ⚠️ ملاحظة عن الباينري

الباينري الأصلي يحتوي على 1142 إشارة لكلمة `opencode` و 136 لـ `opencode.ai` داخل الكود المترجم (Go/Bun). التغيير الكامل داخل الباينري يتطلب إعادة بناء من المصدر (fork). الحل الحالي يستخدم **Wrapper + Symlink + Rebranding** وهو احترافي وآمن بدون كسر التوقيع.

لإعادة بناء كاملة من المصدر:
```bash
git clone https://github.com/opencode-ai/opencode.git WormAgent-core
# ثم استبدل جميع الإشارات وأعد البناء
```

---
© 2026 WormAgent.net — Rebranded with ♥ from opencode.ai
