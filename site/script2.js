// تعريف متغيرات بيانات القرآن الكريم وبيانات السور
let quranData;
let surahsData;

// تعريف متغيرات مصفوفات أسماء السور وعدد آياتها
let surahsFullNames = [];
let surahsNames = [];
let surahsAyahsNumbers = [];

// الحصول على حقول تحديد السور ونطاقات الآيات وعدد الأسئلة
const fromSurahSelect = document.getElementById('from-surah-select');
const fromAyahStartInput = document.getElementById('from-ayah-start-input');
const toAyahStartInput = document.getElementById('to-ayah-start-input');
const toSurahSelect = document.getElementById('to-surah-select');
const fromAyahEndInput = document.getElementById('from-ayah-end-input');
const toAyahEndInput = document.getElementById('to-ayah-end-input');
const questionsCountInput = document.getElementById('questions-count-input');
const createTestButton = document.getElementById('create-test-button');
const questionsList = document.getElementById('questions-list');

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
  surahsNames = surahsFullNames.map(surahFullName => surahFullName.split(' ').slice(2).join(' '));
  surahsAyahsNumbers = Object.values(surahsData);
}

// دالة لإضافة خيارات السور إلى قوائم الاختيار
function populateSurahOptions() {
  surahsFullNames.forEach((surahFullName, index) => {
    const option = new Option(surahFullName, index + 1);
    fromSurahSelect.add(option);
    toSurahSelect.add(option.cloneNode(true));
  });

  // تعيين القيم الافتراضية لنطاق السور
  fromSurahSelect.value = '1';
  toSurahSelect.value = '114';
}

// دالة لتعيين النطاقات الافتراضية للسور
function setSurahsDefaultRanges() {
  setAyahRange(fromSurahSelect, fromAyahStartInput, toAyahStartInput);
  setAyahRange(toSurahSelect, fromAyahEndInput, toAyahEndInput);
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
  if (surahSelect.id === 'from-surah-select') {
    setAyahRange(surahSelect, fromAyahStartInput, toAyahStartInput);
  } else if (surahSelect.id === 'to-surah-select') {
    setAyahRange(surahSelect, fromAyahEndInput, toAyahEndInput);
  }
}

// دالة للتحقق من إدخال القيم الرقمية
function validateNumericInput(event) {
  event.target.value = event.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '');
}

// دالة لتفعيل أو تعطيل زر إنشاء الاختبار بناءً على إدخال عدد الأسئلة
function toggleCreateTestButton() {
  createTestButton.disabled = questionsCountInput.value === '';
}

// دالة لإنشاء الاختبار
function createTest(event) {
  event.preventDefault();

  const fromSurahValue = parseInt(fromSurahSelect.value);
  const fromAyahStartValue = parseInt(fromAyahStartInput.value);
  const toAyahStartValue = parseInt(toAyahStartInput.value);
  const toSurahValue = parseInt(toSurahSelect.value);
  const fromAyahEndValue = parseInt(fromAyahEndInput.value);
  const toAyahEndValue = parseInt(toAyahEndInput.value);
  const questionsCountValue = parseInt(questionsCountInput.value);

  // التحقق من ملء حقل عدد الأسئلة
  if (!questionsCountValue) {
    alert('يرجى كتابة عدد الأسئلة.');
    return;
  }

  // مسح أي أسئلة قديمة
  questionsList.innerHTML = '';

  for (let i = 0; i < questionsCountValue; i++) {
    const question = createRandomQuestion(i + 1, fromSurahValue, fromAyahStartValue, toAyahStartValue, toSurahValue, fromAyahEndValue, toAyahEndValue);
    const listItem = document.createElement('li');
    listItem.textContent = question;
    questionsList.appendChild(listItem);
  }

  // عرض رسالة نجاح
  alert('تم إنشاء الاختبار بنجاح!');
}

// دالة لإنشاء سؤال عشوائي
function createRandomQuestion(questionNumber, fromSurahValue, fromAyahStartValue, toAyahStartValue, toSurahValue, fromAyahEndValue, toAyahEndValue) {
  const randomSurahNumber = getRandomSurahNumber(fromSurahValue, toSurahValue);
  const surahName = surahsNames[randomSurahNumber - 1];
  const randomAyahNumber = getRandomAyahNumber(randomSurahNumber, fromSurahValue, fromAyahStartValue, toAyahStartValue, toSurahValue, fromAyahEndValue, toAyahEndValue);
  const ayahText = getAyahText(randomSurahNumber, randomAyahNumber);
  return `س${questionNumber}: سورة ${surahName}: آية ${randomAyahNumber}: قال تعالى: "${ayahText}"`;
}

// دالة للحصول على رقم سورة عشوائي
function getRandomSurahNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// دالة للحصول على رقم آية عشوائي ضمن نطاق محدد
function getRandomAyahNumber(randomSurahNumber, fromSurahValue, fromAyahStartValue, toAyahStartValue, toSurahValue, fromAyahEndValue, toAyahEndValue) {
  let start, end;
  if (randomSurahNumber === fromSurahValue) {
    start = fromAyahStartValue;
    end = toAyahStartValue;
  } else if (randomSurahNumber === toSurahValue) {
    start = fromAyahEndValue;
    end = toAyahEndValue;
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

fromAyahStartInput.addEventListener('input', validateNumericInput);
toAyahStartInput.addEventListener('input', validateNumericInput);
fromAyahEndInput.addEventListener('input', validateNumericInput);
toAyahEndInput.addEventListener('input', validateNumericInput);
questionsCountInput.addEventListener('input', validateNumericInput);
questionsCountInput.addEventListener('input', toggleCreateTestButton);

createTestButton.addEventListener('click', createTest);