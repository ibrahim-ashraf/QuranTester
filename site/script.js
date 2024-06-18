// تعريف متغيرات بيانات القرآن الكريم وبيانات السور
let quranData;
let surahsData;

// تعريف متغيرات مصفوفات أسماء السور وعدد آياتها
let surahsFullNames = [];
let surahsNames = [];
let surahsAyahsNumbers = [];

// الحصول على حقول تحديد السور ونطاقات الآيات وعدد الأسئلة
const fromSurahSelect = document.getElementById('fromSurah');
const fromAyah1 = document.getElementById('fromAyah1');
const toAyah1 = document.getElementById('toAyah1');
const toSurahSelect = document.getElementById('toSurah');
const fromAyah2 = document.getElementById('fromAyah2');
const toAyah2 = document.getElementById('toAyah2');
const questionsNumber = document.getElementById('questionsNumber');
const createTestButton = document.getElementById('createTest');
const questionsList = document.getElementById('questionsList');

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

    initializeSurahData();
    populateSurahOptions();
    setSurahsDefaultRanges();
  })
  .catch(error => console.error('Error loading surahs data:', error));

// دالة لتهيئة بيانات السور
function initializeSurahData() {
  surahsFullNames = Object.keys(surahsData);
  surahsNames = surahsFullNames.map(surah => surah.split(' ').slice(2).join(' '));
  surahsAyahsNumbers = Object.values(surahsData);
}

// دالة لإضافة خيارات السور إلى قوائم الاختيار
function populateSurahOptions() {
  surahsFullNames.forEach((surahName, index) => {
    const option = new Option(surahName, index + 1);
    fromSurahSelect.add(option);
    toSurahSelect.add(option.cloneNode(true));
  });

  // تعيين القيم الافتراضية لنطاق السور
  fromSurahSelect.value = '1';
  toSurahSelect.value = '114';
}

// دالة لتعيين النطاقات الافتراضية للسور
function setSurahsDefaultRanges() {
  setAyahRange(fromSurahSelect, fromAyah1, toAyah1);
  setAyahRange(toSurahSelect, fromAyah2, toAyah2);
}

// دالة لتعيين نطاق الآيات الافتراضي بناءً على السورة المحددة
function setAyahRange(surahSelect, fromAyah, toAyah) {
  const surahIndex = surahSelect.value - 1;
  fromAyah.value = 1;
  toAyah.value = surahsAyahsNumbers[surahIndex];
}

// دالة لتحديث نطاق الآيات بناءً على تغيير السورة
function setSelectedSurahRange(event) {
  const surahSelect = event.target;
  if (surahSelect.id === 'fromSurah') {
    setAyahRange(surahSelect, fromAyah1, toAyah1);
  } else if (surahSelect.id === 'toSurah') {
    setAyahRange(surahSelect, fromAyah2, toAyah2);
  }
}

// دالة للتحقق من إدخال القيم الرقمية
function validateNumericInput(event) {
  event.target.value = event.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '');
}

// دالة لتفعيل أو تعطيل زر إنشاء الاختبار بناءً على إدخال عدد الأسئلة
function toggleCreateTestButton() {
  createTestButton.disabled = questionsNumber.value === '';
}

// دالة لإنشاء الاختبار
function createTest(event) {
  event.preventDefault();

  const fromSurahValue = parseInt(fromSurahSelect.value);
  const fromAyah1Value = parseInt(fromAyah1.value);
  const toAyah1Value = parseInt(toAyah1.value);
  const toSurahValue = parseInt(toSurahSelect.value);
  const fromAyah2Value = parseInt(fromAyah2.value);
  const toAyah2Value = parseInt(toAyah2.value);
  const questionsCountValue = parseInt(questionsNumber.value);

  // التحقق من ملء حقل عدد الأسئلة
  if (!questionsCountValue) {
    alert('يرجى كتابة عدد الأسئلة.');
    return;
  }

  // مسح أي أسئلة قديمة
  questionsList.innerHTML = '';

  for (let i = 0; i < questionsCountValue; i++) {
    const question = createRandomQuestion(i + 1, fromSurahValue, fromAyah1Value, toAyah1Value, toSurahValue, fromAyah2Value, toAyah2Value);
    const listItem = document.createElement('li');
    listItem.textContent = question;
    questionsList.appendChild(listItem);
  }

  // عرض رسالة نجاح
  alert('تم إنشاء الاختبار بنجاح!');
}

// دالة لإنشاء سؤال عشوائي
function createRandomQuestion(questionNumber, fromSurahValue, fromAyah1Value, toAyah1Value, toSurahValue, fromAyah2Value, toAyah2Value) {
  const randomSurahNumber = getRandomSurahNumber(fromSurahValue, toSurahValue);
  const randomAyahNumber = getRandomAyahNumber(randomSurahNumber, fromSurahValue, fromAyah1Value, toAyah1Value, toSurahValue, fromAyah2Value, toAyah2Value);
  const surahName = surahsNames[randomSurahNumber - 1];
  const ayahText = getAyahText(randomSurahNumber, randomAyahNumber);
  return `س${questionNumber}: سورة ${surahName}: آية ${randomAyahNumber}: قال تعالى: "${ayahText.split(' ').slice(0, 5).join(' ')}"`;
}

// دالة للحصول على رقم سورة عشوائي
function getRandomSurahNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// دالة للحصول على رقم آية عشوائي ضمن نطاق محدد
function getRandomAyahNumber(randomSurahNumber, fromSurahValue, fromAyah1Value, toAyah1Value, toSurahValue, fromAyah2Value, toAyah2Value) {
  let start, end;
  if (randomSurahNumber === fromSurahValue) {
    start = fromAyah1Value;
    end = toAyah1Value;
  } else if (randomSurahNumber === toSurahValue) {
    start = fromAyah2Value;
    end = toAyah2Value;
  } else {
    start = 1;
    end = surahsAyahsNumbers[randomSurahNumber - 1];
  }
  return getRandomSurahNumber(start, end);
}

// دالة للحصول على نص آية محددة
function getAyahText(surahNumber, ayahNumber) {
  const ayah = quranData.find(aya => aya.sura_no === surahNumber && aya.aya_no === ayahNumber);
  return ayah ? ayah.aya_text_emlaey : '';
}

// إضافة مستمعات للأحداث
fromSurahSelect.addEventListener('change', setSelectedSurahRange);
toSurahSelect.addEventListener('change', setSelectedSurahRange);

fromAyah1.addEventListener('input', validateNumericInput);
toAyah1.addEventListener('input', validateNumericInput);
fromAyah2.addEventListener('input', validateNumericInput);
toAyah2.addEventListener('input', validateNumericInput);
questionsNumber.addEventListener('input', validateNumericInput);
questionsNumber.addEventListener('input', toggleCreateTestButton);

createTestButton.addEventListener('click', createTest);

// test - form.addEventListener('submit', createTest);