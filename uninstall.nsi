Outfile "uninstall.exe"
RequestExecutionLevel admin

Section
RMDir /r $PROGRAMFILES\QuranTester
DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\QuranTester"
SectionEnd
