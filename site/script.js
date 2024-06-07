// تعريف متغيرات بيانات القرآن الكريم وبيانات السور
let quranData;
let surahsData;

// تعريف متغيرات مصفوفات أسماء السور وعدد آياتها
let surahsFullNames;
let surahsNames;
let surahsAyahsNumbers;

// الحصول على عناصر تحديد السور ونطاقات الآيات
const fromSurahSelect = document.getElementById('fromSurah');
const fromAyah1 = document.getElementById('fromAyah1');
const toAyah1 = document.getElementById('toAyah1');
const toSurahSelect = document.getElementById('toSurah');
const fromAyah2 = document.getElementById('fromAyah2');
const toAyah2 = document.getElementById('toAyah2');
const questionsNumber = document.getElementById('questionsNumber');

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

    // استدعاء دالة تعيين النطاقات الافتراضية لآيات السور
    setSurahsDefaultRanges();
  })
  .catch(error => console.error('Error loading surahs data:', error));

// وظيفة لإضافة خيارات السور إلى قوائم الاختيار
function populateSurahOptions() {
  for (const surahName in surahsData) {
    const option = document.createElement('option');
    const surahNumber = surahName.split(': ')[0];
    option.value = surahNumber;
    option.text = surahName;
    fromSurahSelect.add(option);
    toSurahSelect.add(option);
  }

  // تعيين القيم الافتراضية لنطاق السور
  fromSurahSelect.value = '1';
  toSurahSelect.value = '114';
}

// دالة لتعيين النطاقات الافتراضية للسور
function setSurahsDefaultRanges() {
  // الحصول على القيمة الافتراضية للسور المحددة افتراضيا
  const fromSurahValue = fromSurahSelect.value;
  const toSurahValue = toSurahSelect.value;

// الحصول على أرقام الآيات الأولى والأخيرة للسور المحددة افتراضيا
  const fromSurahFristAyahNumber = 1;
  const fromSurahLastAyahNumber = surahsAyahsNumbers[fromSurahValue - 1];
  const toSurahFristAyahNumber = 1;
  const toSurahLastAyahNumber = surahsAyahsNumbers[toSurahValue - 1];

  // تعيين أرقام الآيات التي تم الحصول عليها في حقول نطاقات الآيات للسور المحددة افتراضيا
  fromAyah1.value = fromSurahFristAyahNumber;
  toAyah1.value = fromSurahLastAyahNumber;
  fromAyah2.value = toSurahFristAyahNumber;
  toAyah2.value = toSurahLastAyahNumber;
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

function setSelectedSurahRange(event) {
  // الحصول على عنصر القائمة المنسدلة للسورة المحددة، ومعرفه، وقيمته
  const selectedSurahDropdown = event.target;
  const selectedSurahDropdownID = selectedSurahDropdown.id;
  const selectedSurahDropdownValue = selectedSurahDropdown.value;

  // الحصول على رقم الآية الأولى والأخيرة للسورة المحددة
  const surahFristAyahNumber = 1;
  const surahLastAyahNumber = surahsAyahsNumbers[selectedSurahDropdownValue - 1];

  if (selectedSurahDropdownID === 'fromSurah') { // إذا كانت القائمة المنسدلة هي قائمة سورة البداية
    // تعيين نطاق الآيات في حقول نطاق آيات سورة البداية
    fromAyah1.value = surahFristAyahNumber;
    toAyah1.value = surahLastAyahNumber;
  } else if (selectedSurahDropdownID === 'toSurah') { // إذا كانت القائمة المنسدلة هي قائمة سورة النهاية
    // تعيين نطاق الآيات في حقول نطاق آيات سورة النهاية
    fromAyah2.value = surahFristAyahNumber;
    toAyah2.value = surahLastAyahNumber;
  }
}

function validateNumericInput(event) {
  const input = event.target;
  let value = input.value;

  // حذف أي حرف غير رقمي
  value = value.replace(/[^0-9]/g, '');

  // حذف الصفر في بداية النص إذا كان موجودًا
  value = value.replace(/^0+/, '');

  // تحديث قيمة مربع النص
  input.value = value;
}

function toggleCreateTestButton() {
  const questionsInput = document.getElementById('questionsNumber');
  const createTestButton = document.getElementById('createTest');

  if (questionsInput.value === '') {
    createTestButton.disabled = true;
  } else {
    createTestButton.disabled = false;
  }
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
    const randomAyahNumber = getRandomAyahNumber(randomSurahNumber, randomSurahAyahsNumbers, fromSurah, toSurah, fromAyah1, toAyah1, fromAyah2, toAyah2);

    // إنشاء السؤال واضافته إلى قائمة الأسئلة
    const question = createQuestion(questionNumber, randomSurahNumber, randomAyahNumber, randomSurahName);
    questions.push(question);
    const li = document.createElement('li');
    li.textContent = question;
    questionsList.appendChild(li);
  }

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

function getRandomAyahNumber(randomSurahNumber, randomSurahAyahsNumber, fromSurah, toSurah, fromAyah1, toAyah1, fromAyah2, toAyah2) {
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

fromSurahSelect.addEventListener('change', setSelectedSurahRange);
toSurahSelect.addEventListener('change', setSelectedSurahRange);

fromAyah1.addEventListener('input', validateNumericInput);
toAyah1.addEventListener('input', validateNumericInput);
fromAyah2.addEventListener('input', validateNumericInput);
toAyah2.addEventListener('input', validateNumericInput);
questionsNumber.addEventListener('input', validateNumericInput);
questionsNumber.addEventListener('input', toggleCreateTestButton);

// ربط وظيفة createTest بزر "إنشاء اختبار"
const createTestButton = document.getElementById('createTest');
createTestButton.addEventListener('click', createTest);