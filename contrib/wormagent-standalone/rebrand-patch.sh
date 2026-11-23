#!/bin/bash
# WormAgent Deep Rebrand - محاولة تغيير جذري داخل الملفات النصية والإعدادات
# لا يعدل الباينري المترجم مباشرة (يحتاج إعادة بناء)، لكن يغير كل ما يمكن تغييره

echo "🌀 WormAgent Deep Rebrand - WormAgent.net"
echo "=========================================="

# 1. تحديث ملفات الإعدادات
echo "→ Updating configs..."
find /home/user -name "*.json" -type f 2>/dev/null | xargs grep -l "wormagent" 2>/dev/null | while read f; do
  echo "  patching $f"
  sed -i 's|wormagent\.ai|WormAgent.net|g' "$f" 2>/dev/null
  sed -i 's|wormagent|WormAgent|g' "$f" 2>/dev/null
done

# 2. إنشاء إعدادات WormAgent الشاملة
mkdir -p /home/user/.config/WormAgent
mkdir -p /home/user/.WormAgent
cat > /home/user/.config/WormAgent/config.json <<'JSON'
{
  "$schema": "https://WormAgent.net/schema.json",
  "brand": "WormAgent",
  "site": "https://WormAgent.net",
  "version": "1.19.6-wormagent"
}
JSON
cp /home/user/.config/WormAgent/config.json /home/user/.WormAgent/config.json

# 3. تحديث متغيرات البيئة
echo "→ Updating shell configs..."
# إزالة الأسطر القديمة وإضافة الجديدة
grep -v "wormagent" /home/user/.bashrc > /tmp/bashrc.tmp 2>/dev/null && mv /tmp/bashrc.tmp /home/user/.bashrc
echo 'export PATH=/home/user/.wormagent/bin:/home/user/WormAgent/bin:$PATH # WormAgent.net' >> /home/user/.bashrc
echo 'export WORMAGENT_SITE="https://WormAgent.net"' >> /home/user/.bashrc
echo 'alias WormAgent="/home/user/WormAgent/bin/WormAgent"' >> /home/user/.bashrc
echo 'alias wormagent="/home/user/WormAgent/bin/wormagent"' >> /home/user/.bashrc

grep -v "wormagent" /home/user/.profile > /tmp/profile.tmp 2>/dev/null && mv /tmp/profile.tmp /home/user/.profile
echo 'export PATH=/home/user/.wormagent/bin:/home/user/WormAgent/bin:$PATH # WormAgent.net' >> /home/user/.profile

# 4. إنشاء اختصارات إضافية
echo "→ Creating global shortcuts..."
mkdir -p /home/user/.local/bin
ln -sf /home/user/WormAgent/bin/WormAgent /home/user/.local/bin/WormAgent 2>/dev/null
ln -sf /home/user/WormAgent/bin/wormagent /home/user/.local/bin/wormagent 2>/dev/null

echo ""
echo "✅ Deep Rebrand Complete!"
echo "   WormAgent.net is now the primary brand"
echo "   Original binary preserved as fallback"
