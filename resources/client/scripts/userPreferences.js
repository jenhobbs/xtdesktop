/*
 * This file is part of the xtdesktop package for xTuple ERP: PostBooks edition, a free and
 * open source Enterprise Resource Planning software suite,
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the Common Public Attribution License
 * version 1.0, the full text of which (including xTuple-specific Exhibits)
 * is available at www.xtuple.com/CPAL.  By using this software, you agree
 * to be bound by its terms.
 */

(function () {
  var _buttonBox      = mywindow.findChild("_buttonBox"),
      _interfaceWorkspace = mywindow.findChild("_interfaceWorkspace"),
      _layout         = toolbox.widgetGetLayout(_interfaceWorkspace),
      _useNativeStyle = toolbox.createWidget("QCheckBox", mywindow, "_useNativeStyle"),
      _prefs          = preferences
  ;

  _buttonBox.accepted.connect(save);
  _interfaceWorkspace.toggled.connect(desktopNotice);
  if (_prefs.value("xtdesktop/useNativeStyle").length) {
    _useNativeStyle.checked = _prefs.boolean("xtdesktop/useNativeStyle");
  }
  
  _layout.addWidget(_useNativeStyle, 2, 1);
  _useNativeStyle.text = qsTr("Use Native Application Styling");

  function desktopNotice()
  {
    if (_interfaceWorkspace.checked &&
        !preferences.boolean("NoDesktopNotice"))
      toolbox.openWindow("desktopNotice", mywindow, Qt.WindowModal, Qt.Dialog);
  }

  function save()
  {
    _prefs.set("xtdesktop/useNativeStyle", _useNativeStyle.checked);
  }

})();
