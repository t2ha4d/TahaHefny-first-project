// Solution for: "Data workout in the console" (YOUR TURN · NO AI)
// 
// الخطوات:
// 1. افتح شاشة Console في المتصفح بالضغط على F12 ثم Console
// 2. انسخ محتوى الملف products-console.js والصقه في الكونسول واضغط Enter
// 3. شغّل كل سطر من الأسطر التالية:

// 1. Paste day2-kit/console/products-console.js (Paste the products array into console)

// 2. Names only, with map
// النتيجة: مصفوفة بأسماء الـ 12 منتجاً فقط
products.map((p) => p.name);

// 3. Under $50, with filter
// النتيجة: المنتجات التي سعرها أقل من 50 دولار (5 منتجات)
products.filter((p) => p.price < 50);

// 4. Cheapest first, with sort on a copy
// النتيجة: ترتيب المنتجات من الأرخص للأغلى (باستخدام [...] لنسخ المصفوفة وتجنب تغيير الأصل)
[...products].sort((a, b) => a.price - b.price);

// 5. Total of all prices, with reduce
// النتيجة: المجموع الكلي للأسعار = 877
products.reduce((sum, p) => sum + p.price, 0);

