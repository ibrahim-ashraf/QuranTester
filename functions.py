import datetime
import json
import random
import requests
import sys
import wx

current_version = "1.0"

def process_surahs_data_file():
    try:
        with open("files/surahs_data.json", "r", encoding="utf-8") as surahs_data_file:
            global surahs_data
            surahs_data = json.load(surahs_data_file)
    except FileNotFoundError:
        wx.MessageBox("لم يتم العثور على ملف بيانات السور؛ لعرضها في واجهة المستخدم، لذلك سيتم إيقاف البرنامج.", "خطأ")
        sys.exit()


def get_short_surahs_names(full_surahs_names, short_surahs_names):
    for full_surah_name in full_surahs_names:
        short_surah_name = " ".join(full_surah_name.split(" ")[2:])
        short_surahs_names.append(short_surah_name)


def update_from_surah_ayahs_numbers(from_surah_ayahs_numbers, surahs_ayahs_numbers, from_surah_index, from_ayah_1_cb, to_ayah_1_cb):
    if from_surah_ayahs_numbers != []:
        from_surah_ayahs_numbers.clear()
    for i in range(1, surahs_ayahs_numbers[from_surah_index] + 1):
        from_surah_ayahs_numbers.append(str(i))
    from_ayah_1_cb.Append(from_surah_ayahs_numbers)
    from_ayah_1_cb.SetSelection(0)
    to_ayah_1_cb.Append(from_surah_ayahs_numbers)
    to_ayah_1_cb.SetSelection(len(from_surah_ayahs_numbers) - 1)


def update_to_surah_ayahs_numbers(to_surah_ayahs_numbers, surahs_ayahs_numbers, to_surah_index, from_ayah_2_cb, to_ayah_2_cb):
    if to_surah_ayahs_numbers != []:
        to_surah_ayahs_numbers.clear()
    for i in range(1, surahs_ayahs_numbers[to_surah_index] + 1):
        to_surah_ayahs_numbers.append(str(i))
    from_ayah_2_cb.Append(to_surah_ayahs_numbers)
    from_ayah_2_cb.SetSelection(0)
    to_ayah_2_cb.Append(to_surah_ayahs_numbers)
    to_ayah_2_cb.SetSelection(len(to_surah_ayahs_numbers) - 1)


def on_from_surah_changed(event, from_ayah_1_cb, to_ayah_1_cb, from_surah_ayahs_numbers, surahs_ayahs_numbers, from_surah_cb):
    from_ayah_1_cb.Clear()
    to_ayah_1_cb.Clear()
    update_from_surah_ayahs_numbers(from_surah_ayahs_numbers, surahs_ayahs_numbers, from_surah_cb, from_ayah_1_cb, to_ayah_1_cb)


def on_to_surah_changed(event, from_ayah_2_cb, to_ayah_2_cb, to_surah_ayahs_numbers, surahs_ayahs_numbers, to_surah_cb):
    from_ayah_2_cb.Clear()
    to_ayah_2_cb.Clear()
    update_to_surah_ayahs_numbers(to_surah_ayahs_numbers, surahs_ayahs_numbers, to_surah_cb, from_ayah_2_cb, to_ayah_2_cb)


def on_from_ayah_1_changed(event, from_ayah_1_cb, to_ayah_1_cb):
    current_from_ayah_1_selection = from_ayah_1_cb.GetSelection()
    current_to_ayah_1_selection = to_ayah_1_cb.GetSelection()
    if current_from_ayah_1_selection > current_to_ayah_1_selection:
        from_ayah_1_cb.SetSelection(current_to_ayah_1_selection)


def on_to_ayah_1_changed(event, from_ayah_1_cb, to_ayah_1_cb):
    current_from_ayah_1_selection = from_ayah_1_cb.GetSelection()
    current_to_ayah_1_selection = to_ayah_1_cb.GetSelection()
    if current_to_ayah_1_selection < current_from_ayah_1_selection:
        to_ayah_1_cb.SetSelection(current_from_ayah_1_selection)


def on_from_ayah_2_changed(event, from_ayah_2_cb, to_ayah_2_cb):
    current_from_ayah_2_selection = from_ayah_2_cb.GetSelection()
    current_to_ayah_2_selection = to_ayah_2_cb.GetSelection()
    if current_from_ayah_2_selection > current_to_ayah_2_selection:
        from_ayah_2_cb.SetSelection(current_to_ayah_2_selection)


def on_to_ayah_2_changed(event, from_ayah_2_cb, to_ayah_2_cb):
    current_from_ayah_2_selection = from_ayah_2_cb.GetSelection()
    current_to_ayah_2_selection = to_ayah_2_cb.GetSelection()
    if current_to_ayah_2_selection < current_from_ayah_2_selection:
        to_ayah_2_cb.SetSelection(current_from_ayah_2_selection)


def on_questions_number_changed(event, questions_number_edit, create_test_button, add_questions_button, questions_list_box):
    if len(questions_number_edit.GetValue()) > 0:
        if not questions_number_edit.GetValue()[-1].isdigit() or questions_number_edit.GetValue()[0] == "0":
            questions_number_edit.ChangeValue(questions_number_edit.GetValue()[:-1])

    if len(questions_number_edit.GetValue()) > 0:
        create_test_button.Show()
        if questions_list_box.GetCount() > 0:
            add_questions_button.Show()
    else:
        create_test_button.Hide()
        add_questions_button.Hide()


def confirm_clear_existing_questions(questions_list_box_count, panel):
    global agree_creating_test
    agree_creating_test = True
    if questions_list_box_count > 0:
        test_creation_confirmation_dialog = wx.MessageDialog(panel, "سيتم حذف الاختبار الحالي.", "هل تريد المتابعة؟", wx.YES_NO | wx.ICON_WARNING)
        if test_creation_confirmation_dialog.ShowModal() == wx.ID_NO:
            agree_creating_test = False
            return
        test_creation_confirmation_dialog.Destroy()


def process_quran_file():
    global quran_file_error
    quran_file_error = False

    try:
        with open("files/quran.json", "r", encoding="utf-8") as quran_json_file:
            global quran
            quran = json.load(quran_json_file)

    except FileNotFoundError:
        wx.MessageBox("لم يتم العثور على ملف بيانات القرآن الكريم.", "خطأ")
        quran_file_error = True


def get_random_surahs_names(from_surah_index, to_surah_index, full_surahs_names, questions_number):
    global random_surahs_names
    if from_surah_index < to_surah_index:
        random_surahs_names = random.choices(full_surahs_names[from_surah_index:to_surah_index], k=questions_number)
    elif from_surah_index > to_surah_index:
        random_surahs_names = random.choices(full_surahs_names[to_surah_index:from_surah_index], k=questions_number)
    else:
        random_surahs_names = [full_surahs_names[from_surah_index]] * questions_number


def create_questions(questions_list, surahs_ayahs_numbers, from_surah_index, to_surah_index, from_ayah_1_number, to_ayah_1_number, from_ayah_2_number, to_ayah_2_number, questions_list_box):
    for random_surah_name in random_surahs_names:
        question_number = len(questions_list) + 1
        question_surah_name = " ".join(random_surah_name.split()[2:])
        question_surah_number = int(random_surah_name.split(": ")[0])
        question_surah_ayahs_number = surahs_ayahs_numbers[question_surah_number] - 1

        if question_surah_number - 1 == from_surah_index:
            question_ayah_number = random.randint(from_ayah_1_number, to_ayah_1_number)
        elif question_surah_number - 1 == to_surah_index:
            question_ayah_number = random.randint(from_ayah_2_number, to_ayah_2_number)
        else:
            question_ayah_number = random.randint(1, question_surah_ayahs_number)

        for ayah_data in quran:
            if ayah_data["sura_no"] == question_surah_number and ayah_data["aya_no"] == question_ayah_number:
                question_ayah_text = ayah_data["aya_text_emlaey"]
                short_question_ayah_text = " ".join(question_ayah_text.split()[0:5])

                if short_question_ayah_text != question_ayah_text:
                    short_question_ayah_text += " …"

        question_text = f"س{question_number}: سورة {question_surah_name}: آية {question_ayah_number}: قال تعالى: \"{short_question_ayah_text}\"."
        questions_list.append(question_text)


def show_delete_current_question_button(event, questions_list_box, delete_current_question_button):
    delete_current_question_button.Show()


def confirm_question_deletion(questions_list_box, panel):
    global agree_deletion
    agree_deletion = True

    short_question_text = ": ".join(questions_list_box.GetStringSelection().split(": ")[:3])
    question_confirmation_dialog = wx.MessageDialog(panel, f"هل تريد حذف {short_question_text}؟", "تأكيد", wx.YES_NO | wx.ICON_WARNING)
    result = question_confirmation_dialog.ShowModal()
    question_confirmation_dialog.Destroy()

    if result == wx.ID_NO:
        agree_deletion = False
        return


def remove_question_from_list(questions_list, questions_list_box, add_questions_button, delete_current_question_button, save_test_button):
    questions_list.pop(questions_list_box.GetSelection())

    if questions_list == []:
        questions_list_box.Clear()
        add_questions_button.Hide()
        delete_current_question_button.Hide()
        save_test_button.Hide()


def update_questions_numbers(questions_list, questions_list_box):
    new_questions_list = []
    new_question_number = 0

    for question in questions_list:
        new_question_number += 1
        old_question_number_str = question.split(":")[0][1:]
        new_question = question.replace(old_question_number_str, str(new_question_number))
        new_questions_list.append(new_question)

    questions_list = new_questions_list
    questions_list_box.Clear()
    questions_list_box.Append(questions_list)


def get_test_info_and_questions_text(student_name_edit, short_surahs_names, from_surah_cb, to_surah_cb, from_ayah_1_cb, to_ayah_1_cb, from_ayah_2_cb, to_ayah_2_cb, questions_number_edit, questions_list):
    global student_name
    if student_name_edit.GetValue() == "":
        student_name = "اسم_الطالب"
    else: 
        student_name = student_name_edit.GetValue()

    global test_date
    test_date = str(datetime.date.today())

    test_info = f"معلومات الاختبار:\nاسم الطالب: {student_name}\nمن سورة: {short_surahs_names[from_surah_cb.GetSelection()]} ({from_ayah_1_cb.GetValue()}-{to_ayah_1_cb.GetValue()})\nإلى سورة: {short_surahs_names[to_surah_cb.GetSelection()]} ({from_ayah_2_cb.GetValue()}-{to_ayah_2_cb.GetValue()})\nعدد الأسئلة: {questions_number_edit.GetValue()}\nتاريخ الاختبار: {test_date}\n\n"
    test_questions_text = "\n".join(questions_list)
    test_end_text = "\n\nنهاية الاختبار، وبالله التوفيق."

    global test_text
    test_text = test_info + test_questions_text + test_end_text


def save_test_to_file(panel):
    global save_test_error
    save_test_error = False

    default_file_name = f"{student_name} {test_date}"

    save_test_dialog = wx.FileDialog(panel, "حفظ الاختبار", defaultFile=default_file_name, wildcard="ملفات نصية (*.txt)|*.txt", style=wx.FD_SAVE | wx.FD_OVERWRITE_PROMPT)

    if save_test_dialog.ShowModal() == wx.ID_CANCEL:
        save_test_error = True
        wx.MessageBox("تم إلغاء عملية حفظ الاختبار.", "خطأ")
        return

    file_path = save_test_dialog.GetPath()

    with open(file_path, "w", encoding="utf-8") as file:
        file.write(test_text)

    wx.MessageBox(f"تم حفظ الاختبار في ملف نصي في المسار: {file_path} بنجاح", "تم حفظ الاختبار بنجاح")


def load_user_guide_text():
    global user_guide_file_not_found
    user_guide_file_not_found = False

    try:
        with open("files/user_guide.txt", "r", encoding="utf-8") as user_guide_file:
            global user_guide_text
            user_guide_text = user_guide_file.read()
    except FileNotFoundError:
        wx.MessageBox("لم يتم العثور على ملف دليل المستخدم.", "خطأ")
        user_guide_file_not_found = True


def has_internet_connection():
    try:
        response = requests.get("https://www.google.com", timeout=5)
        return True
    except requests.ConnectionError:
        return False


def download_update(panel):
    update_file_name = latest_release['assets'][0]['name']
    update_file_size = latest_release['assets'][0]['size'] / 1024 / 1024
    update_file_size = round(update_file_size, 2)
    update_file_download_count = latest_release['assets'][0]['download_count']
    update_date = latest_release['assets'][0]['updated_at'].split("T")[0]
    whats_new = latest_release['body']

    update_available_dialog = wx.MessageDialog(panel, f"يتوفر تحديث جديد. هل تريد تنزيله؟\nاسم الملف: {update_file_name}\nالحجم: {update_file_size} ميجابايت\nرقم الإصدار: {latest_version}\nعدد مرات التحميل: {update_file_download_count}\nتاريخ التحديث: {update_date}\nالجديد في التحديث: \"{whats_new}\"", "يتوفر تحديث جديد", wx.YES_NO|wx.ICON_INFORMATION)
    result = update_available_dialog.ShowModal()
    update_available_dialog.Destroy()

    if result == wx.ID_YES:
        wx.MessageBox("اضغط \"موافق\" لفتح المتصفح وتنزيل التحديث.", "رسالة")
        update_url = latest_release['assets'][0]['browser_download_url']
        wx.LaunchDefaultBrowser(update_url)
    else:
        return


def check_for_updates(event, panel):
    if not has_internet_connection():
        wx.MessageBox("تأكد من اتصالك بالإنترنت وحاول مرة أخرى.", "خطأ في الاتصال بالإنترنت")
        return

    response = requests.get("https://api.github.com/repos/ibrahim-ashraf/QuranTester/releases/latest")

    if response.status_code == 200:
        global latest_release
        latest_release = response.json()
        global latest_version
        latest_version = latest_release["tag_name"][1:]

        if latest_version == current_version:
            wx.MessageBox("لا يوجد تحديث متاح.", "لا يوجد تحديث", wx.ICON_INFORMATION)
        else:
            download_update(panel)
    else:
        wx.MessageBox("خطأ في البحث عن التحديثات. حاول مرة أخرى لاحقًا.", "خطأ")


def check_for_updates_on_startup(panel):
    if not has_internet_connection():
        return

    response = requests.get("https://api.github.com/repos/ibrahim-ashraf/QuranTester/releases/latest")

    if response.status_code == 200:
        global latest_release
        latest_release = response.json()
        global latest_version
        latest_version = latest_release["tag_name"][1:]

        if latest_version == current_version:
            return
        else:
            download_update(panel)

    else:
        wx.MessageBox("خطأ في البحث عن التحديثات. حاول مرة أخرى لاحقًا.", "خطأ")


def show_about_app_dialog(event):
    wx.MessageBox(f"الاسم: مختبر القرآن الكريم\nالإصدار: {current_version}\nالمطور: Ibrahim Ashraf\nتاريخ الإصدار الأولي: الاثنين، 22 يناير 2024 م - 10 رجب 1445ه\nحقوق الطبع والنشر: ©2024 Ibrahim Ashraf. كافة الحقوق محفوظة.", "حول البرنامج")