import sys
import wx

import functions


app = wx.App()
wx.Locale(wx.LANGUAGE_ARABIC)

frame = wx.Frame(None, title = "مختبر القرآن الكريم")
panel = wx.Panel(frame)

full_surahs_names = []
short_surahs_names = []
surahs_ayahs_numbers = []
from_surah_ayahs_numbers = []
to_surah_ayahs_numbers = []
questions_list = []

functions.process_surahs_data_file()
full_surahs_names.extend(functions.surahs_data.keys())

functions.get_short_surahs_names(full_surahs_names, short_surahs_names)

surahs_ayahs_numbers.extend(functions.surahs_data.values())


from_surah_label = wx.StaticText(panel, label = "من سورة: ")
from_surah_cb = wx.ComboBox(panel, choices = full_surahs_names, style = wx.TE_READONLY)
from_surah_cb.SetSelection(0)
from_ayah_1_label = wx.StaticText(panel, label = "من آية:")
from_ayah_1_cb = wx.ComboBox(panel, style = wx.TE_READONLY)
to_ayah_1_label = wx.StaticText(panel, label = "إلى آية:")
to_ayah_1_cb = wx.ComboBox(panel, style = wx.TE_READONLY)
to_surah_label = wx.StaticText(panel, label = "إلى سورة: ")
to_surah_cb = wx.ComboBox(panel, choices = full_surahs_names, style = wx.TE_READONLY)
to_surah_cb.SetSelection(113)
from_ayah_2_label = wx.StaticText(panel, label = "من آية:")
from_ayah_2_cb = wx.ComboBox(panel, style = wx.TE_READONLY)
to_ayah_2_label = wx.StaticText(panel, label = "إلى آية:")
to_ayah_2_cb = wx.ComboBox(panel, style = wx.TE_READONLY)
questions_number_label = wx.StaticText(panel, label = "عدد الأسئلة:")
questions_number_edit = wx.TextCtrl(panel)
student_name_label = wx.StaticText(panel, label = "اسم الطالب:")
student_name_edit = wx.TextCtrl(panel)
create_test_button = wx.Button(panel, label = "إنشاء اختبار جديد")
create_test_button.Hide()
add_questions_button = wx.Button(panel, label = "إضافة أسئلة")
add_questions_button.Hide()
questions_list_box_label = wx.StaticText(panel, label = "قائمة الأسئلة:")
questions_list_box = wx.ListBox(panel, choices = questions_list)
delete_current_question_button = wx.Button(panel, label = "حذف السؤال المحدد")
delete_current_question_button.Hide()
save_test_button = wx.Button(panel, label = "حفظ الاختبار")
save_test_button.Hide()
show_user_guide_button = wx.Button(panel, label = "دليل المستخدم")
check_for_updates_button = wx.Button(panel, label = "البحث عن تحديثات")
about_app_button = wx.Button(panel, label = "حول البرنامج")


functions.update_from_surah_ayahs_numbers(from_surah_ayahs_numbers, surahs_ayahs_numbers, from_surah_cb.GetSelection(), from_ayah_1_cb, to_ayah_1_cb)
functions.update_to_surah_ayahs_numbers(to_surah_ayahs_numbers, surahs_ayahs_numbers, to_surah_cb.GetSelection(), from_ayah_2_cb, to_ayah_2_cb)


def create_test(event):
    functions.confirm_clear_existing_questions(questions_list_box.GetCount(), panel)
    if functions.agree_creating_test == False:
        return
    else:
        questions_list.clear()
        questions_list_box.Clear()

    functions.process_quran_file()
    if functions.quran_file_error == True:
        return

    functions.get_random_surahs_names(from_surah_cb.GetSelection(), to_surah_cb.GetSelection(), full_surahs_names, int(questions_number_edit.GetValue()))
    functions.create_questions(questions_list, surahs_ayahs_numbers, from_surah_cb.GetSelection(), to_surah_cb.GetSelection(), int(from_ayah_1_cb.GetValue()), int(to_ayah_1_cb.GetValue()), int(from_ayah_2_cb.GetValue()), int(to_ayah_2_cb.GetValue()), questions_list_box)

    questions_list_box.Append(questions_list)
    wx.MessageBox("تم إنشاء الاختبار بنجاح.", "نجح")
    add_questions_button.Show()
    save_test_button.Show()


def add_questions(event):
    functions.process_quran_file()
    if functions.quran_file_error == True:
        return

    functions.get_random_surahs_names(from_surah_cb.GetSelection(), to_surah_cb.GetSelection(), full_surahs_names, int(questions_number_edit.GetValue()))
    functions.create_questions(questions_list, surahs_ayahs_numbers, from_surah_cb.GetSelection(), to_surah_cb.GetSelection(), int(from_ayah_1_cb.GetValue()), int(to_ayah_1_cb.GetValue()), int(from_ayah_2_cb.GetValue()), int(to_ayah_2_cb.GetValue()), questions_list_box)

    questions_list_box.Clear()
    questions_list_box.Append(questions_list)
    wx.MessageBox("تم إضافة الأسئلة بنجاح.", "نجح")


def delete_current_question(event):
    functions.confirm_question_deletion(questions_list_box, panel)
    if functions.agree_deletion == False:
        return

    functions.remove_question_from_list(questions_list, questions_list_box, add_questions_button, delete_current_question_button, save_test_button)
    functions.update_questions_numbers(questions_list, questions_list_box)

    delete_current_question_button.Hide()


def save_test(event):
    functions.get_test_info_and_questions_text(student_name_edit, short_surahs_names, from_surah_cb, to_surah_cb, from_ayah_1_cb, to_ayah_1_cb, from_ayah_2_cb, to_ayah_2_cb, questions_number_edit, questions_list)

    functions.save_test_to_file(panel)
    if functions.save_test_error == True:
        return


def show_user_guide(event):
    functions.load_user_guide_text()
    if functions.user_guide_file_not_found == True:
        return

    global user_guide_dialog
    user_guide_dialog = wx.Dialog(frame, title="دليل المستخدم")

    user_guide_text_ctrl = wx.TextCtrl(user_guide_dialog, value=functions.user_guide_text, size=(wx.EXPAND, wx.EXPAND), style=wx.TE_MULTILINE | wx.TE_READONLY)
    close_button = wx.Button(user_guide_dialog, label="إغلاق")

    close_button.Bind(wx.EVT_BUTTON, close_user_guide)

    user_guide_dialog.Show()


def close_user_guide(event):
    user_guide_dialog.Close()


def on_exit(event):
    if questions_list_box.GetCount() > 0:
        exit_confirmation_dialog = wx.MessageDialog(panel, "يوجد اختبار معروض حاليا. هل تريد الخروج والتخلي عنه؟", "تحذير", wx.YES_NO | wx.ICON_WARNING)
        result = exit_confirmation_dialog.ShowModal()
        exit_confirmation_dialog.Destroy()

        if result == wx.ID_NO:
            return
        else:
            sys.exit()

    else:
        sys.exit()


from_surah_cb.Bind(wx.EVT_COMBOBOX, lambda event: functions.on_from_surah_changed(event, from_ayah_1_cb, to_ayah_1_cb, from_surah_ayahs_numbers, surahs_ayahs_numbers, from_surah_cb.GetSelection()))
to_surah_cb.Bind(wx.EVT_COMBOBOX, lambda event: functions.on_to_surah_changed(event, from_ayah_2_cb, to_ayah_2_cb, to_surah_ayahs_numbers, surahs_ayahs_numbers, to_surah_cb.GetSelection()))
from_ayah_1_cb.Bind(wx.EVT_COMBOBOX, lambda event: functions.on_from_ayah_1_changed(event, from_ayah_1_cb, to_ayah_1_cb))
to_ayah_1_cb.Bind(wx.EVT_COMBOBOX, lambda event: functions.on_to_ayah_1_changed(event, from_ayah_1_cb, to_ayah_1_cb))
from_ayah_2_cb.Bind(wx.EVT_COMBOBOX, lambda event: functions.on_from_ayah_2_changed(event, from_ayah_2_cb, to_ayah_2_cb))
to_ayah_2_cb.Bind(wx.EVT_COMBOBOX, lambda event: functions.on_to_ayah_2_changed(event, from_ayah_2_cb, to_ayah_2_cb))
questions_number_edit.Bind(wx.EVT_TEXT, lambda event: functions.on_questions_number_changed(event, questions_number_edit, create_test_button, add_questions_button, questions_list_box))
create_test_button.Bind(wx.EVT_BUTTON, create_test)
add_questions_button.Bind(wx.EVT_BUTTON, add_questions)
questions_list_box.Bind(wx.EVT_LISTBOX, lambda event: functions.show_delete_current_question_button(event, questions_list_box, delete_current_question_button))
delete_current_question_button.Bind(wx.EVT_BUTTON, delete_current_question)
save_test_button.Bind(wx.EVT_BUTTON, save_test)
show_user_guide_button.Bind(wx.EVT_BUTTON, show_user_guide)
check_for_updates_button.Bind(wx.EVT_BUTTON, lambda event: functions.check_for_updates(event, panel))
about_app_button.Bind(wx.EVT_BUTTON, functions.show_about_app_dialog)
frame.Bind(wx.EVT_CLOSE, on_exit)


frame.Show()

functions.check_for_updates_on_startup(panel)

app.MainLoop()