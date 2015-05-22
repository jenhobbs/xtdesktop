/*
 * This file is part of the xTuple ERP: PostBooks Edition, a free and
 * open source Enterprise Resource Planning software suite,
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the Common Public Attribution License
 * version 1.0, the full text of which (including xTuple-specific Exhibits)
 * is available at www.xtuple.com/CPAL.  By using this software, you agree
 * to be bound by its terms.
 */

function setupDesktopMenu() {

  _mainMenu = mainwindow.findChild("_mainMenu");
  _shortcutMenu = mainwindow.findChild("_shortcutMenu");
  _employeeImage = mainwindow.findChild("_employeeImage");
  _employee = mainwindow.findChild("_employee");

  _mainMenu.addColumn(qsTr("MAIN MENU"), -1, Qt.AlignLeft, true, "menuItem");

  _mainMenu.setStyleSheet(desktopStyle);
  _shortcutMenu.setStyleSheet(desktopStyle);
  _mainMenu.alternatingRowColors = false;
  _shortcutMenu.alternatingRowColors = false;
  _shortcutMenu.maximumHeight = 150;
  _shortcutMenu.addColumn(qsTr("SHORTCUTS"), -1, Qt.AlignLeft, true, "menuShortcuts");

  shortcutsMenuPopulateList();

  var _employeeSql = "SELECT 0 as sort, crmacct_name, crmacct_usr_username, emp.emp_image_id "
                + "FROM emp JOIN crmacct ON (emp_id=crmacct_emp_id) "
                + "WHERE crmacct_usr_username = geteffectivextuser() "
                + "UNION SELECT 1 as sort, geteffectivextuser(), usr_propername, null "
                + "FROM usr WHERE usr_username = geteffectivextuser() "
                + "ORDER BY 1 ASC LIMIT 1;       ";
  var _employeeData = toolbox.executeQuery(_employeeSql);
  if (_employeeData.first()){
    _employeeImage.setId(_employeeData.value("emp_image_id"));
    _employee.text = _employeeData.value("crmacct_name");
    _employee.wordWrap = true;
  }

_employeeImage.setStyleSheet(imageStyle);
_employee.setStyleSheet(imageStyle);


  _mainMenu["itemClicked(XTreeWidgetItem*, int)"].connect(mainMenuClicked);
  _shortcutMenu["itemClicked(XTreeWidgetItem*, int)"].connect(shortcutMenuClicked);
  mainwindow["emitSignal(QString, QString)"].connect(refreshShortcuts);

  // Populate Shortcuts Right Click menu
  _shortcutMenu["populateMenu(QMenu *,XTreeWidgetItem *, int)"].connect(shortcutsPopulateMenu);

}

function refreshShortcuts(source, type) {
  if (source == "xtdesktop")
    shortcutsMenuPopulateList();
}

function shortcutsMenuPopulateList() {
  _shortcutMenu.clear();
  var _sc = toolbox.executeDbQuery("desktop", "userShortcuts", new Object);

// Populate shortcuts menu per Treeview item so it matches Main Menu visually
  _shortcutMenu.populate(_sc); {
    var menuItem = new XTreeWidgetItem(_shortcutMenu, _sc.value("usrpref_id"), _sc.value("usrpref_id"), _sc.value("menuShortcuts"));
  }
}

function shortcutsPopulateMenu(pMenu, pItem, pCol){
  var mCode;
  var currentItem = _shortcutMenu.currentItem();
  if(currentItem != null) {
    mCode = pMenu.addAction(qsTr("Edit Shortcuts..."));
    mCode.enabled = privileges.check("MaintainPreferencesSelf");
    mCode.triggered.connect(shortcutsMenuOpenPrefs);
  }
}

function shortcutsMenuOpenPrefs() {
  var hotkeys = toolbox.openWindow("hotkeys", mainwindow, 0, 1);
  var params = new Object;
  params.currentUser = true;
  toolbox.lastWindow().set(params);
  if (hotkeys.exec() > 0)
    shortcutsMenuPopulateList();
}
  
function mainMenuClicked(wdgt, item) {
  _shortcutMenu.setCurrentItem(-1);
  _desktopStack.currentIndex = (wdgt.id() - 1);
}

function shortcutMenuClicked(wdgt, item) {
  _mainMenu.setCurrentItem(-1);
  var param = new Object;
  param.action = wdgt.id();

  var _actionSQL = "SELECT usrpref_value FROM usrpref "
		+ " WHERE (usrpref_username = geteffectivextuser() "
                 + " and usrpref_id = <? value('action') ?>);";
  var _scAction = toolbox.executeQuery(_actionSQL, param);
  if (_scAction.first()){
    var priv = mainwindow.findChild(_scAction.value("usrpref_value"));
    if (priv && priv.enabled)
      mainwindow.findChild(_scAction.value("usrpref_value")).trigger();
    else
      QMessageBox.information(mainwindow, qsTr("Insufficient Privileges"), qsTr("You have insufficient permissions for this action"));
  } else {
    QMessageBox.critical(mainwindow, qsTr("Error"), qsTr("Could not find the shortcut action"));
    return false;
  }
}
