// تعريف متغير وضع إضافة الأسئلة (افتراضي على "إنشاء")
let mode = 'create';

// تعريف متغيرات بيانات القرآن الكريم وبيانات السور
let quranData;
let surahsData;

// تعريف متغيرات مصفوفات أسماء السور وعدد آياتها ومتغير مصفوفة الأسئلة
let surahsFullNames = [];
let surahsNames = [];
let surahsAyahsNumbers = [];
let questionsList = [];

// الحصول على حقول تحديد السور ونطاقات الآيات وعدد الأسئلة
const fromSurahSelect = document.getElementById('from-surah-select');
const fromAyahStartInput = document.getElementById('from-ayah-start-input');
const toAyahStartInput = document.getElementById('to-ayah-start-input');
const switchSurahsButton = document.getElementById('switch-surahs-button');
const toSurahSelect = document.getElementById('to-surah-select');
const fromAyahEndInput = document.getElementById('from-ayah-end-input');
const toAyahEndInput = document.getElementById('to-ayah-end-input');
const questionsCountInput = document.getElementById('questions-count-input');
const createTestButton = document.getElementById('create-test-button');
const addQuestionsButton = document.getElementById('add-questions');
const questionsTableBody = document.getElementById('questions-table-body');

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
  const ayahsCount = surahsAyahsNumbers[surahIndex];

  fromAyah.value = 1;
  toAyah.value = ayahsCount;
  toAyah.max = ayahsCount;
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

// دالة للتحقق من صحة اختيار السور
function validateSurahSelection(event) {
  // الحصول على القائمة الحالية لتحديد السورة
  const surahSelect = event.target;

  // الحصول على القائمة الأخرى لتحديد السورة حسب القائمة الحالية
  const otherSurahSelect = (surahSelect.id === fromSurahSelect.id) ? toSurahSelect : fromSurahSelect;

  // الحصول على قيمة الخيار المحدد من القائمة الحالية والقائمة الأخرى لتحديد السورة
  const surahSelectValue = parseInt(surahSelect.value);
  const otherSurahSelectValue = parseInt(otherSurahSelect.value);

  // التحقق من القيم وتعيين القيمة الصالحة
  if (surahSelect.id === fromSurahSelect.id && surahSelectValue > otherSurahSelectValue) {
    fromSurahSelect.value = otherSurahSelectValue;
    alert("لا يمكن أن تكون سورة البداية أكبر من سورة النهاية. تمت إعادة تعيين سورة البداية إلى سورة النهاية.");
  } else if (surahSelect.id === toSurahSelect.id && surahSelectValue < otherSurahSelectValue) {
    toSurahSelect.value = otherSurahSelectValue;
    alert("لا يمكن أن تكون سورة النهاية أقل من سورة البداية. تمت إعادة تعيين سورة النهاية إلى سورة البداية.");
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

  let fromSurahValue = parseInt(fromSurahSelect.value);
  let fromAyahStartValue = parseInt(fromAyahStartInput.value);
  let toAyahStartValue = parseInt(toAyahStartInput.value);
  let toSurahValue = parseInt(toSurahSelect.value);
  let fromAyahEndValue = parseInt(fromAyahEndInput.value);
  let toAyahEndValue = parseInt(toAyahEndInput.value);
  let questionsCountValue = parseInt(questionsCountInput.value);

  [fromAyahStartValue, toAyahStartValue, fromAyahEndValue, toAyahEndValue] = setEmptyAyahsRangesFields(fromSurahValue, fromAyahStartValue, toAyahStartValue, toSurahValue, fromAyahEndValue, toAyahEndValue);
  console.log(fromAyahStartValue, toAyahStartValue, fromAyahEndValue, toAyahEndValue);

  if (event.target.id === addQuestionsButton.id) {
    mode = 'add';
  }

  if (mode === 'create' && questionsList.length > 0) {
    testDeleteConfirm = confirm('سيتم حذف الاختبار الحالي إذا أنشأت واحدا جديدا. هل تريد المتابعة؟');

    if (testDeleteConfirm) {
      questionsList = [];
      questionsTableBody.innerHTML = '';
    } else {
      return;
    }
  }

  for (let i = 0; i < questionsCountValue; i++) {
    const randomSurahNumber = getRandomNumber(fromSurahValue, toSurahValue);
    const randomAyahNumber = getRandomAyahNumber(randomSurahNumber, fromSurahValue, fromAyahStartValue, toAyahStartValue, toSurahValue, fromAyahEndValue, toAyahEndValue);
    const ayahText = getAyahText(randomSurahNumber, randomAyahNumber);

    const question = {
      questionNumber: questionsList.length + 1,
      surahNumber: randomSurahNumber,
      surahName: surahsNames[randomSurahNumber - 1],
      ayahNumber: randomAyahNumber,
      ayahText: ayahText
    };

    questionsList.push(question);
  }

  displayQuestions();

  // عرض رسالة نجاح
  if (mode === 'create') {
    alert('تم إنشاء الاختبار بنجاح!');
  } else {
    alert('تم إضافة الأسئلة بنجاح!');
    mode = 'create';
  }
}

function setEmptyAyahsRangesFields(fromSurah, fromAyahStart, toAyahStart, toSurah, fromAyahEnd, toAyahEnd) {
  // الحصول على عدد آيات السور المحددة
  const fromSurahAyahsCount = surahsAyahsNumbers[fromSurah - 1];
  const toSurahAyahsCount = surahsAyahsNumbers[toSurah - 1];

  // التحقق من قيم نطاقات الآيات وتعيين قيمتها إذا لم تكن رقما
  const fromAyahStartValue = isNaN(fromAyahStart) ? 1 : fromAyahStart;
  const toAyahStartValue = isNaN(toAyahStart) ? fromSurahAyahsCount : toAyahStart;
  const fromAyahEndValue = isNaN(fromAyahEnd) ? 1 : fromAyahEnd;
  const toAyahEndValue = isNaN(toAyahEnd) ? toSurahAyahsCount : toAyahEnd;

  return [fromAyahStartValue, toAyahStartValue, fromAyahEndValue, toAyahEndValue];
}

// دالة للحصول على رقم سورة عشوائي
function getRandomNumber(min, max) {
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
  return getRandomNumber(start, end);
}

// دالة للحصول على نص آية محددة
function getAyahText(surahNumber, ayahNumber) {
  const ayah = quranData.find(aya => aya.sura_no === surahNumber && aya.aya_no === ayahNumber);
  return ayah ? ayah.aya_text_emlaey : '';
}

function displayQuestions() {
  questionsTableBody.innerHTML = '';

  if (questionsList.length === 0) {
    addQuestionsButton.style.display = 'none';
    return;
  }

  questionsList.forEach((question, index) => {
    question.questionNumber = index + 1;

    const HTMLTableRow = `
    <tr>
      <td>${question.questionNumber}</td>
      <td>${question.surahName}</td>
      <td>${question.ayahNumber}</td>
      <td>${question.ayahText}</td>
      <td><button onclick="deleteQuestion(${index})">حذف</button></td>
    </tr>
    `;
    questionsTableBody.innerHTML += HTMLTableRow;
  });

  addQuestionsButton.style.display = 'block';
}

function deleteQuestion(questionIndex) {
  questionDeleteConfirm = confirm(`هل تريد حذف السؤال رقم ${questionIndex + 1}؟`);

  if (!questionDeleteConfirm) {
    return;
  }

  questionsList.splice(questionIndex, 1);
  displayQuestions();
}

function switchSurahs(event) {
  // منع السلوك الافتراضي لزر تبديل السور
  event.preventDefault();

  // الحصول على قيم سور البداية والنهاية
  const fromSurahValue = parseInt(fromSurahSelect.value);
  const toSurahValue = parseInt(toSurahSelect.value);

  // تعيين قيم سور البداية والنهاية بالعكس
  fromSurahSelect.value = toSurahValue;
  toSurahSelect.value = fromSurahValue;

  // استدعاء دالة تعيين النطاق الافتراضي للآيات طبقا للسور المحددة
  setSurahsDefaultRanges();
}

// إضافة مستمعات للأحداث
fromSurahSelect.addEventListener('change', (event) => {
  validateSurahSelection();
  setSelectedSurahRange(event);
});

fromAyahStartInput.addEventListener('input', validateNumericInput);
toAyahStartInput.addEventListener('input', validateNumericInput);
switchSurahsButton.addEventListener('click', switchSurahs);
toSurahSelect.addEventListener('change', (event) => {
  validateSurahSelection();
  setSelectedSurahRange(event);
});

fromAyahEndInput.addEventListener('input', validateNumericInput);
toAyahEndInput.addEventListener('input', validateNumericInput);
questionsCountInput.addEventListener('input', validateNumericInput);
questionsCountInput.addEventListener('input', toggleCreateTestButton);
createTestButton.addEventListener('click', createTest);
addQuestionsButton.addEventListener('click', createTest);