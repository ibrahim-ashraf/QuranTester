Outfile "QuranTester.exe"
Section
SetOutPath $PROGRAMFILES\QuranTester
File /r "dist\QuranTester\"
File uninstall.exe
WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\QuranTester" "DisplayName" "Quran Tester"
WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\QuranTester" "DisplayVersion" "1.0"
WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\QuranTester" "InstallLocation" "$PROGRAMFILES\QuranTester"
WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\QuranTester" "Publisher" "Ibrahim Ashraf"
WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\QuranTester" "EstimatedSize" 50000
WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\QuranTester" "UninstallString" "$PROGRAMFILES\QuranTester\uninstall.exe"

SectionEnd
