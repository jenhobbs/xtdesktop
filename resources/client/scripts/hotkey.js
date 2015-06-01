var _save = mywindow.findChild("_save");

function refreshShortcuts() {
  mainwindow.sEmitSignal("xtdesktop", "refreshShortcuts");
}

_save.clicked.connect(refreshShortcuts);