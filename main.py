# Import the necessary libraries
import datetime
import json
import random
import requests
import sys
import webbrowser
import wx

# Initialize the wxPython application
app = wx.App()

# Create the main frame and panel
frame = wx.Frame(None, title = "مختبر القرآن الكريم")
panel = wx.Panel(frame)

# Try to open the surahs data file in read mode.
try:
    with open("files/surahs_data.json", "r", encoding="utf-8") as surahs_data_file:
        # Load surahs data from the JSON file.
        surahs_data = json.load(surahs_data_file)
except FileNotFoundError:
    # If the file is not found, show an error message.
    wx.MessageBox("لم يتم العثور على ملف بيانات السور؛ لعرضها في واجهة المستخدم، لذلك سيتم إيقاف البرنامج.", "خطأ")
    sys.exit()

# Create a list of surahs names by extracting the dictionary keys from the loaded surahs data.
surahs_names = list(surahs_data.keys())

# Create user interface widgets.
from_surah_label = wx.StaticText(panel, label = "من سورة: ")
from_surah_cb = wx.ComboBox(panel, choices = surahs_names, style = wx.TE_READONLY)
from_surah_cb.SetSelection(0)
to_surah_label = wx.StaticText(panel, label = "إلى سورة: ")
to_surah_cb = wx.ComboBox(panel, choices = surahs_names, style = wx.TE_READONLY)
to_surah_cb.SetSelection(113)
questions_number_label = wx.StaticText(panel, label = "عدد الأسئلة:")
questions_number_edit = wx.TextCtrl(panel)
student_name_label = wx.StaticText(panel, label = "اسم الطالب:")
student_name_edit = wx.TextCtrl(panel)
create_test_button = wx.Button(panel, label = "إنشاء الاختبار")
test_text_label = wx.StaticText(panel, label = "نص الاختبار:")
test_text_edit = wx.TextCtrl(panel, style = wx.TE_MULTILINE | wx.TE_READONLY)
save_test_button = wx.Button(panel, label = "حفظ الاختبار")
show_user_guide_button = wx.Button(panel, label = "دليل المستخدم")
check_for_updates_button = wx.Button(panel, label = "البحث عن تحديثات")
about_app_button = wx.Button(panel, label = "حول البرنامج")

# Define the create_test() function, which is called when the Create Test button is clicked
def create_test(event):
    # Check if the selected starting surah is greater than the selected ending surah.
    if from_surah_cb.GetSelection() > to_surah_cb.GetSelection():
        # Display an error message if the starting surah is greater than the ending surah.
        wx.MessageBox("يجب أن تكون سورة بداية الاختبار أقل أو تساوي سورة النهاية", "خطأ")
        return

    # Check if the input for the number of questions is a valid positive integer and doesn't start with "0".
    if not questions_number_edit.GetValue().isdigit() or questions_number_edit.GetValue().startswith("0"):
        # Display an error message if the input for the number of questions is not a valid positive integer or starts with '0'.
        wx.MessageBox("يجب أن يكون عدد الأسئلة رقما صحيحا فقط لا يبدأ بـ 0", "خطأ")
        return

    try:
        # Try to open the "quran.json" file in read mode with UTF-8 encoding.
        with open("files/quran.json", "r", encoding="utf-8") as quran_json_file:
            # Load the Quran data from the JSON file into a global variable "quran".
            global quran
            quran = json.load(quran_json_file)

    except FileNotFoundError:
        # If the file is not found, show an error message using a message box and exit the function.
        wx.MessageBox("لم يتم العثور على ملف بيانات القرآن الكريم.", "خطأ")
        return

    # Get the index of the selected starting surah from the combobox.
    from_surah_selected = from_surah_cb.GetSelection()

    # Get the index of the selected ending surah from the combobox.
    to_surah_selected = to_surah_cb.GetSelection()

    # Create an empty list to store randomly generated surahs numbers.
    random_surahs_numbers = []

    # Generate random surah numbers between the selected starting and ending surahs.
    for random_number in range(int(questions_number_edit.GetValue())):
        random_surah_number = random.randint(from_surah_selected + 1, to_surah_selected + 1)
        random_surahs_numbers.append(random_surah_number)

    # Create an empty list to store surah names corresponding to the randomly generated surahs numbers.
    random_surahs_names = []

    # Retrieve surahs names based on the randomly generated surahs numbers and store them in the list.
    for random_surah_number in random_surahs_numbers:
        random_surah_name = surahs_names[random_surah_number - 1]
        random_surahs_names.append(random_surah_name)

    # Initialize variables to keep track of the question number and the test question text.
    test_question_number = 0
    test_question_text = ""

    # Iterate through the randomly selected surahs to generate test questions.
    for random_surah_name in random_surahs_names:
        # Increment the test question number.
        test_question_number += 1

        # Retrieve the total number of ayahs in the current surah.
        question_surah_ayahs_number = surahs_data[random_surah_name]

        # Generate a random ayah number between 1 and the total ayahs number in the surah.
        question_ayah_number = random.randint(1, question_surah_ayahs_number)

        # Get the surah number based on its name and increment it by 1 to match the Quran indexing.
        question_surah_number = surahs_names.index(random_surah_name) + 1

    # Check if the current question number equals the total number of questions specified by the user.
        if test_question_number == int(questions_number_edit.GetValue()):
            # If all questions have been generated, add a concluding message to the test.
            test_end_text = "\nنهاية الاختبار، وبالله التوفيق."

        # Iterate through the Quran data to find the text of the generated question.
        for ayah_data in quran:
            # Check if the current ayah data matches the generated surah and ayah numbers.
            if ayah_data["sura_no"] == question_surah_number and ayah_data["aya_no"] == question_ayah_number:
                # Extract surah name, ayah text, and split the ayah text into words.
                question_surah_name = ayah_data["sura_name_ar"]
                question_ayah_text = ayah_data["aya_text_emlaey"]
                question_ayah_words = question_ayah_text.split()

        # Construct the text for the current question and append it to the test question text.
        test_question_text += f"س{test_question_number}:\nسورة {question_surah_name}\nآية {question_ayah_number}\nقال تعالى:\n\"{' '.join(question_ayah_words[0:5])}\"\n\n"

    # Get the student's name from the input field or set a default value if no name is provided.
    global student_name
    student_name = student_name_edit.GetValue()
    if student_name_edit.GetValue() == "":
        student_name = "لم يتم إدخاله"

    # Get the total number of questions specified by the user.
    test_questions_number = questions_number_edit.GetValue()

    # Retrieve the names of the starting and ending surahs based on their selected indices.
    for ayah_data in quran:
        if ayah_data["sura_no"] == from_surah_selected + 1:
            from_surah_name = ayah_data["sura_name_ar"]
        if ayah_data["sura_no"] == to_surah_selected + 1:
            to_surah_name = ayah_data["sura_name_ar"]

    # Get the current date to include it in the test information.
    global test_date
    test_date = str(datetime.date.today())

    # Create a formatted string containing test information and set it as the text in the test_text_edit field.
    test_info = f"معلومات الاختبار\n\n\nاسم الطالب:\n{student_name}\n\nمن سورة:\n{from_surah_name}\n\nإلى سورة:\n{to_surah_name}\n\nعدد الأسئلة:\n{test_questions_number}\n\nتاريخ الاختبار:\n{test_date}\n\n\n"
    test_text_edit.SetValue(test_info + test_question_text + test_end_text)
    wx.MessageBox("تم إنشاء الاختبار بنجاح، وعرضه في مربع \"نص الاختبار\".", "نجح")




def save_test(event):
    # Check if there is any test to save.
    if test_text_edit.GetValue() == "":
        wx.MessageBox("ما من اختبار حالي ليتم حفظه.", "خطأ")
        return

    # Generate a default file name based on the student's name and the test date.
    default_file_name = f"{student_name} {test_date}"

    # Open a file dialog to allow the user to choose the file path and name for saving the test.
    save_test_dialog = wx.FileDialog(panel, "حفظ الاختبار", defaultFile=default_file_name, wildcard="ملفات نصية (*.txt)|*.txt", style=wx.FD_SAVE | wx.FD_OVERWRITE_PROMPT)

    # Show the file dialog and check if the user cancels the operation.
    if save_test_dialog.ShowModal() == wx.ID_CANCEL:
        wx.MessageBox("تم إلغاء عملية حفظ الاختبار.", "خطأ")
        return

    # Get the selected file path from the file dialog.
    file_path = save_test_dialog.GetPath()

    # Open the selected file in write mode and save the test text.
    with open(file_path, "w", encoding="utf-8"):
        file.write(test_text_edit.GetValue())

    # Display a success message indicating that the test has been saved successfully.
    wx.MessageBox(f"تم حفظ الاختبار في ملف نصي في المسار: {file_path} بنجاح", "تم حفظ الاختبار بنجاح")

# Function to display the user guide window.
def show_user_guide(event):
    try:
        # Try to open the user guide file in read mode.
        with open("files/user_guide.txt", "r", encoding="utf-8") as user_guide_file:
            # Read the content of the user guide file.
            user_guide_text = user_guide_file.read()
    except FileNotFoundError:
        # If the file is not found, show an error message and return.
        wx.MessageBox("لم يتم العثور على ملف دليل المستخدم.", "خطأ")
        return

    # Create a global variable for the user guide window.
    global user_guide_window
    # Create a new wxPython frame for the user guide window.
    user_guide_window = wx.Frame(None, title="دليل المستخدم")
    # Create a panel inside the user guide window.
    user_guide_panel = wx.Panel(user_guide_window)
    # Create a text control widget for displaying the user guide text.
    user_guide_text_ctrl = wx.TextCtrl(user_guide_panel, style=wx.TE_MULTILINE | wx.TE_READONLY)
    # Set the content of the text control to the user guide text.
    user_guide_text_ctrl.SetValue(user_guide_text)
    # Create a button for closing the user guide window.
    close_user_guide_button = wx.Button(user_guide_panel, label="إغلاق")
    # Bind the button click event to the close_user_guide function.
    close_user_guide_button.Bind(wx.EVT_BUTTON, close_user_guide)
    # Show the user guide window.
    user_guide_window.Show()

# Function to close the user guide window.
def close_user_guide(event):
    # Close the user guide window.
    user_guide_window.Close()

# Function to check internet connection by making a GET request to "https://www.google.com".
# Returns True if there is internet connection, else returns False.
def has_internet_connection():
    try:
        response = requests.get("https://www.google.com", timeout=5)
        return True
    except requests.ConnectionError:
        return False

# Function to check for updates in the GitHub repository of the application.
def check_for_updates(event):
    # Check if there is an internet connection
    if not has_internet_connection():
        # If no internet connection, display an error message.
        wx.MessageBox("تأكد من اتصالك بالإنترنت وحاول مرة أخرى.", "خطأ في الاتصال بالإنترنت")
        return

    # URL of the latest release in the GitHub repository.
    url = "https://api.github.com/repos/ibrahim-ashraf/QuranTester/releases/latest"

    # Make a GET request to the GitHub API to fetch the latest release information.
    response = requests.get(url)

    # If the request is successful (status code 200).
    if response.status_code == 200:
        # Parse the JSON response to get the latest version tag_name
        latest_release = response.json()
        latest_version = latest_release["tag_name"]

        # Check if the latest version is "v1.0"
        if latest_version == "v1.0":
            # If no update is available, display a message indicating no update is available
            wx.MessageBox("لا يوجد تحديث متاح.", "لا يوجد تحديث")
        else:
            # If an update is available, prompt the user with a dialog box to download the update
            update_available_dialog = wx.MessageDialog(panel, f"يتوفر تحديث جديد برقم {latest_version[1:]}. هل تريد تنزيله؟", "يتوفر تحديث جديد", wx.YES_NO)
            result = update_available_dialog.ShowModal()
            update_available_dialog.Destroy()

            # If the user chooses to download the update, open the browser to the release URL
            if result == wx.ID_YES:
                wx.MessageBox("اضغط \"موافق\" لفتح المتصفح وتنزيل التحديث.", "رسالة")
                release_url = f"https://github.com/ibrahim-ashraf/QuranTester/releases/download/{latest_version}/{latest_release['assets'][0]['name']}"
                webbrowser.open(release_url)
            else:
                return
    else:
        # If there is an error in fetching updates, display an error message
        wx.MessageBox("خطأ في البحث عن التحديثات. حاول مرة أخرى لاحقًا.", "خطأ")

# Function to display the about app dialog.
def show_about_app_dialog(event):
    # Show a message box with information about the application.
    wx.MessageBox("الاسم: مختبر القرآن الكريم\nالإصدار: 1.0\nالمطور: Ibrahim Ashraf\nتاريخ الإصدار الأولي: الأحد، 5 نوفمبر 2023 م\n21 ربيع الثاني 1445ه\n\nحقوق الطبع والنشر: ©2023 Ibrahim Ashraf. كافة الحقوق محفوظة.", "حول البرنامج")

# Bind button click events to corresponding functions.
create_test_button.Bind(wx.EVT_BUTTON, create_test)
save_test_button.Bind(wx.EVT_BUTTON, save_test)
show_user_guide_button.Bind(wx.EVT_BUTTON, show_user_guide)
check_for_updates_button.Bind(wx.EVT_BUTTON, check_for_updates)
about_app_button.Bind(wx.EVT_BUTTON, show_about_app_dialog)

# Show the main frame.
frame.Show()
# Start the wxPython main event loop.
app.MainLoop()