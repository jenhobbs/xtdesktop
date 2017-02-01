/*
 * This file is part of the xtdesktop package for xTuple ERP: PostBooks edition, a free and
 * open source Enterprise Resource Planning software suite,
 * Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
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
      _manualRefresh  = toolbox.createWidget("QCheckBox", mywindow, "_manualRefresh"),
      _prefs          = preferences,
      _selectedUser   = mywindow.findChild("_selectedUser"),
      _user           = mywindow.findChild("_user")
  ;

  _buttonBox.accepted.connect(save);
  _interfaceWorkspace.toggled.connect(desktopNotice);
  _user["newID(int)"].connect(sUserChanged);

  if (_prefs.value("xtdesktop/useNativeStyle").length) {
    _useNativeStyle.checked = _prefs.boolean("xtdesktop/useNativeStyle");
  }
  if (_prefs.value("xtdesktop/manualConsoleRefresh").length) {
    _manualRefresh.checked = _prefs.boolean("xtdesktop/manualConsoleRefresh");
  }
  
  _layout.addWidget(_useNativeStyle, 2, 1);
  _useNativeStyle.text = qsTr("Use Native Application Styling");

  _layout.addWidget(_manualRefresh, 3, 1);
  _manualRefresh.text = qsTr("Manual Refresh Comment Console");

  function desktopNotice()
  {
    if (_interfaceWorkspace.checked &&
        !preferences.boolean("NoDesktopNotice"))
      toolbox.openWindow("desktopNotice", mywindow, Qt.WindowModal, Qt.Dialog);
  }

  function save()
  {
    if (_selectedUser.checked) {
      toolbox.executeQuery("select setUserPreference(<? value('user') ?>,"
                                               + " 'xtdesktop/useNativeStyle',"
                                               + " <? value('bool') ?>);",
                          { user: _user.text,
                            bool: (_useNativeStyle.checked ? 't' : 'f') });
      toolbox.executeQuery("select setUserPreference(<? value('user') ?>,"
                                               + " 'xtdesktop/manualConsoleRefresh',"
                                               + " <? value('bool') ?>);",
                          { user: _user.text,
                            bool: (_manualRefresh.checked ? 't' : 'f') });
    } else {
      _prefs.set("xtdesktop/useNativeStyle",       _useNativeStyle.checked);
      _prefs.set("xtdesktop/manualConsoleRefresh", _manualRefresh.checked);
    }
  }

  function sUserChanged(id)
  {
    var q;
    if (_selectedUser.checked && _user.isValid()) {
      q = toolbox.executeQuery("select usrpref_value from usrpref"
                             + " where usrpref_name = 'xtdesktop/useNativeStyle'"
                             + "   and usrpref_username = <? value('user') ?>;",
                               { user: _user.text });
      if (q.first()) {
        _useNativeStyle.checked = (q.value("usrpref_value") == 't');
      } else if (q.lastError().type != QSqlError.NoError) {
        QMessageBox.critical(mywindow, qsTr("Error"), q.lastError().text);
      } else {
        _useNativeStyle.checked = false;
      }

      q = toolbox.executeQuery("select usrpref_value from usrpref"
                             + " where usrpref_name = 'xtdesktop/manualConsoleRefresh'"
                             + "   and usrpref_username = <? value('user') ?>;",
                               { user: _user.text });
      if (q.first()) {
        _manualRefresh.checked = (q.value("usrpref_value") == 't');
      } else if (q.lastError().type != QSqlError.NoError) {
        QMessageBox.critical(mywindow, qsTr("Error"), q.lastError().text);
      } else {
        _manualRefresh.checked = false;
      }
    }
  }

})();
