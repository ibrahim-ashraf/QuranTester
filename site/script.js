// قراءة بيانات القرآن الكريم من ملف JSON
let quranData;
fetch('quran.json')
  .then(response => response.json())
  .then(data => {
    quranData = data;
    console.log('Quran data loaded:', data);
  })
  .catch(error => console.error('Error loading Quran data:', error));

// قراءة بيانات السور من ملف JSON
fetch('surahs_data.json')
  .then(response => response.json())
  .then(data => {
    const surahsData = data;
    console.log('Surahs data loaded:', data);

    // وظيفة لإضافة خيارات السور إلى قوائم الاختيار
    function populateSurahOptions() {
      console.log('populating surah options...');
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
  const fromSurah = document.getElementById('fromSurah').value;
  const fromAyah1 = document.getElementById('fromAyah1').value;
  const toAyah1 = document.getElementById('toAyah1').value;
  const toSurah = document.getElementById('toSurah').value;
  const fromAyah2 = document.getElementById('fromAyah2').value;
  const toAyah2 = document.getElementById('toAyah2').value;
  const questionsNumber = document.getElementById('questionsNumber').value;

  // التحقق من الإدخالات
  if (!fromSurah || !fromAyah1 || !toAyah1 || !toSurah || !fromAyah2 || !toAyah2 || !questionsNumber) {
    alert('يرجى ملء جميع الحقول');
    return;
  }

  // إنشاء قائمة الأسئلة
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

  function getRandomAyahNumber(surahNumber, fromAyah1, toAyah1, fromAyah2, toAyah2) {
  const surahAyahRange = surahsData[`${surahNumber}`];
  if (surahNumber === parseInt(fromSurah)) {
    return getRandomNumber(fromAyah1, toAyah1);
  } else if (surahNumber === parseInt(toSurah)) {
    return getRandomNumber(fromAyah2, toAyah2);
  } else {
    return getRandomNumber(1, surahAyahRange);
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createQuestion(questionNumber, surahNumber, ayahNumber) {
  const surahName = Object.keys(surahsData).find(key => key.startsWith(surahNumber));
  const ayahText = getAyahText(surahNumber, ayahNumber); // تنفيذ هذه الوظيفة لاحقًا
  return `س${questionNumber}: سورة ${surahName}: آية ${ayahNumber}: قال تعالى: "${ayahText.split(' ').slice(0, 5).join(' ')} ..."`;
}

function getAyahText(surahNumber, ayahNumber) {
  const ayah = quranData.find(item => item.sura_no === surahNumber && item.aya_no === ayahNumber);
  return ayah ? ayah.aya_text_emlaey : '';
}