// تعريف متغيرات بيانات القرآن الكريم وبيانات السور
let quranData;
let surahsData;

// تعريف متغيرات مصفوفات أسماء السور وعدد آياتها
let surahsFullNames;
let surahsNames;
let surahsAyahsNumbers;

// قراءة بيانات القرآن الكريم من ملف JSON
fetch('quran.json')
  .then(response => response.json())
  .then(data => {
    quranData = data;
  })
  .catch(error => console.error('Error loading Quran data:', error));

// قراءة بيانات السور من ملف JSON
fetch('surahs_data.json')
  .then(response => response.json())
  .then(data => {
    surahsData = data;

    // استدعاء دالة إضافة خيارات السور إلى القوائم المنسدلة
    populateSurahOptions();

    // إنشاء ثلاث مصفوفات: (أسماء السور بأرقامها، أسماء الصور فقط، عدد آيات السور)
    surahsFullNames = Object.keys(surahsData);
    surahsNames = getSurahsNames(surahsData);
    surahsAyahsNumbers = Object.values(surahsData);
  })
  .catch(error => console.error('Error loading surahs data:', error));

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

  // تعيين القيم الافتراضية لنطاق السور
  fromSurahSelect.value = '1';
  toSurahSelect.value = '114';
}

// دالة للحصول على أسماء السور
function getSurahsNames(surahsData) {
  const surahsNames = [];

  for (let key in surahsData) {
    let surahName = key.split(' ').slice(2);
    surahsNames.push(surahName);
  }
  return surahsNames;
}

// وظيفة لإنشاء الاختبار
function createTest() {
  const fromSurah = parseInt(document.getElementById('fromSurah').value);
  const fromAyah1 = parseInt(document.getElementById('fromAyah1').value);
  const toAyah1 = parseInt(document.getElementById('toAyah1').value);
  const toSurah = parseInt(document.getElementById('toSurah').value);
  const fromAyah2 = parseInt(document.getElementById('fromAyah2').value);
  const toAyah2 = parseInt(document.getElementById('toAyah2').value);
  const questionsNumber = parseInt(document.getElementById('questionsNumber').value);

  // التحقق من ملء حقل عدد الأسئلة
  if (!questionsNumber) {
    alert('يرجى كتابة عدد الأسئلة.');
    return;
  }

  // الحصول على عنصر قائمة الأسئلة
  const questionsList = document.getElementById('questionsList');

  // مسح أي أسئلة قديمة
  questionsList.innerHTML = '';

  // إنشاء الأسئلة العشوائية
  const questions = [];

  for (let i = 0; i < questionsNumber; i++) {
    // تعيين رقم السؤال
    let questionNumber = i + 1;

    // اختيار سورة عشوائية ضمن النطاق المحدد وتخزين رقمها
    const randomSurahNumber = getRandomSurahNumber(fromSurah, toSurah);

    // الحصول على معلومات السورة المختارة عشوائيا: (اسمها الكامل برقمها، اسمها فقط، عدد آياتها)
    const randomSurahFullName = surahsFullNames[randomSurahNumber - 1]
    const randomSurahName = surahsNames[randomSurahNumber - 1]
    const randomSurahAyahsNumbers = surahsAyahsNumbers[randomSurahNumber - 1]

    // اختيار رقم آية عشوائي ضمن النطاق المحدد للسورة العشوائية
    const randomAyahNumber = getRandomAyahNumber(randomSurahNumber, randomSurahAyahsNumbers, fromAyah1, toAyah1, fromAyah2, toAyah2);

    // إنشاء السؤال واضافته إلى قائمة الأسئلة
    const question = createQuestion(questionNumber, randomSurahNumber, randomAyahNumber, randomSurahName);
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

function getRandomAyahNumber(randomSurahNumber, randomSurahAyahsNumber, fromAyah1, toAyah1, fromAyah2, toAyah2) {
  alert(fromAyah1, toAyah1, fromAyah2, toAyah2);
  alert(typeof fromAyah1, typeof toAyah1, typeof fromAyah2, typeof toAyah2)
  // تحديد نطاق الآيات إذا كانت السورة المختارة هي المحددة في حقل "من سورة"
  if (randomSurahNumber === fromSurah) {
    if (!fromAyah1) {
      fromAyah1 = 1; // تعيين آية البداية على 1 إذا لم يتم تحديدها
    }
    if (!toAyah1) {
      toAyah1 = randomSurahAyahsNumber;  // تعيين آية النهاية على آخر آية في السورة إذا لم يتم تحديدها
    }
    return getRandomNumber(fromAyah1, toAyah1); // توليد رقم آية عشوائي بين النطاق الذي حدده المستخدم
  } else if (randomSurahNumber === toSurah) {
    if (!fromAyah2) {
      fromAyah2 = 1;
    }
    if (!toAyah2) {
      toAyah2 = randomSurahAyahsNumber;
    }
    return getRandomNumber(fromAyah2, toAyah2);
  } else {
    return getRandomNumber(1, randomSurahAyahsNumber);
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createQuestion(questionNumber, randomSurahNumber, randomAyahNumber, randomSurahName) {
  const ayahText = getAyahText(randomSurahNumber, randomAyahNumber); // تنفيذ هذه الوظيفة لاحقًا
  return `س${questionNumber}: سورة ${randomSurahName}: آية ${randomAyahNumber}: قال تعالى: "${ayahText.split(' ').slice(0, 5).join(' ')}"`;
}

function getAyahText(randomSurahNumber, randomAyahNumber) {
  const ayah = quranData.find(aya => aya.sura_no === randomSurahNumber && aya.aya_no === randomAyahNumber);
  return ayah ? ayah.aya_text_emlaey : '';
}

// ربط وظيفة createTest بزر "إنشاء اختبار"
const createTestButton = document.getElementById('createTest');
createTestButton.addEventListener('click', createTest);