# Mohamed Eslam Design

موقع static احترافي لشركة Mohamed Eslam Design يعمل مباشرة على GitHub Pages بدون build step. النسخة الحالية عربية وفاتحة افتراضيًا مع دعم تبديل اللغة والثيم.

## الملفات المهمة

- `index.html`: الصفحة الرئيسية للموقع.
- `admin.html`: أداة static لتعديل بيانات التواصل وأيام الحجز والمواعيد وتصدير config جديد.
- `assets/js/site-config.js`: كل البيانات القابلة للتعديل مثل أرقام التواصل، روابط السوشيال، أرقام المتابعين، الصور، الإحصائيات، الخدمات، البورتفوليو، والأيام المتاحة.
- `assets/js/main.js`: منطق اللغة، لايت/دارك، البورتفوليو، التقويم، ورسالة واتساب.
- `assets/css/styles.css`: تصميم الموقع responsive للـ desktop والموبايل.
- `assets/images/`: صور الهيرو والبورتفوليو بمسارات relative مناسبة لـ GitHub Pages.
- `assets/images/med-logo-original.jpg`: الصورة الأصلية للوجو.
- `assets/images/med-logo-mark.png`: نسخة المونوغرام الصغيرة للهيدر واللودر.
- `assets/images/med-logo-lockup.png`: نسخة اللوجو الكاملة للاستخدامات الواسعة.
- `assets/images/med-logo-icon.png`: أيقونة التاب وApple touch icon.

## تعديل بيانات الشركة

افتح `assets/js/site-config.js` وعدل:

- اسم الشركة أو المدينة داخل `company`.
- رقم الهاتف وواتساب والبريد داخل `contact`.
- روابط Facebook وInstagram وTikTok وأرقام المتابعين داخل `contact.social`.
- الخدمات داخل `services`.
- الإحصائيات داخل `stats`.
- نصوص العربي والإنجليزي داخل `content`.
- صور ومشاريع البورتفوليو داخل `portfolio`.
- صور الهيرو المتحركة داخل `heroImages`.

رقم واتساب يجب أن يكون بصيغة دولية بدون `+` داخل `contact.whatsapp`، مثل:

```js
whatsapp: "201050723257"
```

روابط السوشيال الحالية:

```js
social: {
  facebook: {
    url: "https://www.facebook.com/mohammed.eslam",
    handle: "@mohammed.eslam",
    metric: { en: "179K+ likes", ar: "179 ألف+ إعجاب" }
  },
  instagram: {
    url: "https://www.instagram.com/m7madislam",
    handle: "@m7madislam",
    metric: { en: "67.8K followers", ar: "67.8 ألف متابع" }
  },
  tiktok: {
    url: "https://www.tiktok.com/@mohammedeslam6",
    handle: "@mohammedeslam6",
    metric: { en: "95K followers", ar: "95 ألف متابع" }
  }
}
```

## إلغاء رسوم المعاينة داخل الموقع

داخل `assets/js/site-config.js` عدل:

```js
payment: {
  inspectionFee: "No inspection fee",
  vodafoneCash: "",
  instapay: "",
  bankTransfer: ""
}
```

الموقع لا يجمع دفع ولا يطلب إثبات تحويل. العميل يختار اليوم والميعاد المفضلين، ثم يرسل التفاصيل على واتساب، والفريق يؤكد التوفر يدويًا.

## تعديل الأيام المتاحة

داخل `availability`:

- `availableWeekdays`: أيام الأسبوع المتاحة، حيث الأحد `0` والسبت `6`. القيمة الحالية تفتح كل أيام الأسبوع.
- `unavailableDates`: أيام محددة غير متاحة بصيغة `YYYY-MM-DD`.
- `defaultSlots`: المواعيد الافتراضية لكل يوم متاح.
- `dateSlots`: مواعيد خاصة ليوم محدد.
- `blockedSlots`: مواعيد محجوزة داخل يوم متاح.

مثال:

```js
availability: {
  availableWeekdays: [0, 1, 2, 3, 4, 5, 6],
  unavailableDates: [],
  defaultSlots: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"],
  dateSlots: {},
  blockedSlots: {}
}
```

## استخدام admin.html

افتح `admin.html` في المتصفح. يمكنك تعديل رقم واتساب، رقم الهاتف، حالة رسوم المعاينة، الأيام غير المتاحة، والـ time slots، ثم الضغط على `Export site-config.js`.

مهم: هذه الصفحة static فقط. هي لا تحفظ التغييرات عالميًا ولا تعتبر لوحة إدارة آمنة بدون Backend. بعد التصدير، استبدل محتوى `assets/js/site-config.js` بالمحتوى الناتج ثم ارفع التعديل إلى GitHub.

لتفعيل لوحة إدارة حقيقية وحفظ الحجوزات تلقائيًا، نحتاج لاحقًا إلى Supabase أو Firebase أو Google Sheets API.

## رفع الموقع على GitHub Pages

1. ارفع الملفات إلى repository باسم مناسب، مثل `mohamedeslamdesign.github.io`.
2. من GitHub افتح `Settings`.
3. افتح `Pages`.
4. اختر branch الرئيسي مثل `main` أو `master`.
5. اختر root ثم اضغط Save.
6. افتح رابط GitHub Pages بعد دقائق.

## الصور

الصور محفوظة محليًا داخل `assets/images/` لتعمل بمسارات relative. الصور المستخدمة حاليًا من ملفات Mohamed Eslam Design الموجودة داخل المشروع، ويمكن تغيير صورة الهيرو أو أي مشروع من `assets/js/site-config.js`.

تم توسيع `portfolio` ليعرض معظم صور التنفيذ الموجودة داخل المشروع، مع فلاتر حسب التشطيبات، المعيشة، غرف النوم، المطابخ، الحمامات، التفاصيل، وصور محمد إسلام.
