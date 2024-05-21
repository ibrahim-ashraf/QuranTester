// قراءة بيانات القرآن الكريم من ملف JSON
let quranData;
fetch('quran.json')
  .then(response => response.json())
  .then(data => {
    quranData = data;
  })
  .catch(error => console.error('Error loading Quran data:', error));

// تعريف متغير surahsData في النطاق العالمي
let surahsData;

// قراءة بيانات السور من ملف JSON
fetch('surahs_data.json')
  .then(response => response.json())
  .then(data => {
    surahsData = data;

    // وظيفة لإضافة خيارات السور إلى قوائم الاختيار
    function populateSurahOptions() {
      const fromSurahSelect = document.getElementById('fromSurah');
      const toSurahSelect = document.getElementById('toSurah');

      for (const surahName in surahsData) {
        const option = document.createElement('option');
        option.value = surahName.split(': ')[0]; // الرقم الخاص بالسورة
        option.text = surahName; // اسم السورة
        fromSurahSelect.add(option);
        toSurahSelect.add(option.cloneNode(true));
      }
    }

    // استدعاء الوظيفة لإضافة خيارات السور عند تحميل الصفحة
    window.onload = populateSurahOptions();
  })
  .catch(error => console.error('Error loading surahs data:', error));

// وظيفة لإنشاء الاختبار
function createTest() {
  const fromSurah = parseInt(document.getElementById('fromSurah').value);
  const fromAyah1 = parseInt(document.getElementById('fromAyah1').value);
  const toAyah1 = parseInt(document.getElementById('toAyah1').value);
  const toSurah = parseInt(document.getElementById('toSurah').value);
  const fromAyah2 = parseInt(document.getElementById('fromAyah2').value);
  const toAyah2 = parseInt(document.getElementById('toAyah2').value);
  const questionsNumber = parseInt(document.getElementById('questionsNumber').value);

  // التحقق من الإدخالات
  // if (!fromSurah || !fromAyah1 || !toAyah1 || !toSurah || !fromAyah2 || !toAyah2 || !questionsNumber) {
  //   alert('يرجى ملء جميع الحقول');
    // return;
  // }

  // الحصول على عنصر قائمة الأسئلة
  const questionsList = document.getElementById('questionsList');

  // مسح أي أسئلة قديمة
  questionsList.innerHTML = '';

  // إنشاء الأسئلة العشوائية
  const questions = [];

  for (let i = 0; i < questionsNumber; i++) {
    // تعيين رقم السؤال
    let questionNumber = i + 1;

    // اختيار سورة عشوائية ضمن النطاق المحدد
    const randomSurahNumber = getRandomSurahNumber(fromSurah, toSurah);

    // اختيار رقم آية عشوائي ضمن النطاق المحدد للسورة العشوائية
    const randomAyahNumber = getRandomAyahNumber(randomSurahNumber, fromAyah1, toAyah1, fromAyah2, toAyah2);

    // إنشاء السؤال واضافته إلى قائمة الأسئلة
    const question = createQuestion(questionNumber, randomSurahNumber, randomAyahNumber);
    questions.push(question);
  }

  // عرض الأسئلة في قائمة الأسئلة
  questionsList.innerHTML = questions.join('<br>');

  // عرض رسالة نجاح
  alert('تم إنشاء الاختبار بنجاح!');
}

// وظائف مساعدة
function getRandomSurahNumber(fromSurah, toSurah) {
  const surahNumbers = [];
  for (let i = fromSurah; i <= toSurah; i++) {
    surahNumbers.push(i);
  }
  const randomIndex = Math.floor(Math.random() * surahNumbers.length);
  return surahNumbers[randomIndex];
}

function getRandomAyahNumber(randomSurahNumber, fromAyah1, toAyah1, fromAyah2, toAyah2) {
  // الحصول على اسم السورة من القائمة بناءً على الرقم (مع الأخذ بعين الاعتبار أن السور تبدأ من 1 وليس 0)
  const randomSurahName = Object.keys(surahsData)[randomSurahNumber - 1];
  const surahAyahRange = surahsData[randomSurahName];

  // تحديد نطاق الآيات إذا كانت السورة المختارة هي المحددة في حقل "من سورة"
  if (randomSurahNumber === fromSurah) {
    if (!fromAyah1) {
      fromAyah1 = 1; // تعيين آية البداية على 1 إذا لم يتم تحديدها
    }
    if (!toAyah1) {
      toAyah1 = surahAyahRange;  // تعيين آية النهاية على آخر آية في السورة إذا لم يتم تحديدها
    }
    return getRandomNumber(fromAyah1, toAyah1); // توليد رقم آية عشوائي بين النطاق الذي حدده المستخدم
  } else if (randomSurahNumber === toSurah) {
    if (!fromAyah2) {
      fromAyah2 = 1;
    }
    if (!toAyah2) {
      toAyah2 = surahAyahRange;
    }
    return getRandomNumber(fromAyah2, toAyah2);
  } else {
    return getRandomNumber(1, surahAyahRange);
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createQuestion(questionNumber, surahNumber, randomAyahNumber) {
  const surahName = Object.keys(surahsData).find(key => key.startsWith(randomSurahNumber)).split(' ').slice(2);
  const ayahText = getAyahText(randomSurahNumber, randomAyahNumber); // تنفيذ هذه الوظيفة لاحقًا
  return `س${questionNumber}: سورة ${surahName}: آية ${randomAyahNumber}: قال تعالى: "${ayahText.split(' ').slice(0, 5).join(' ')} ..."`;
}

function getAyahText(randomSurahNumber, randomAyahNumber) {
  const ayah = quranData.find(item => item.sura_no === randomSurahNumber && item.aya_no === randomAyahNumber);
  return ayah ? ayah.aya_text_emlaey : '';
}

// ربط وظيفة createTest بزر "إنشاء اختبار"
const createTestButton = document.getElementById('createTest');
createTestButton.addEventListener('click', createTest);