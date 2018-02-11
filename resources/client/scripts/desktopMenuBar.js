/*
 * This file is part of the xTuple ERP: PostBooks Edition, a free and
 * open source Enterprise Resource Planning software suite,
 * Copyright (c) 1999-2018 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the Common Public Attribution License
 * version 1.0, the full text of which (including xTuple-specific Exhibits)
 * is available at www.xtuple.com/CPAL.  By using this software, you agree
 * to be bound by its terms.
 */

function setupDesktopMenu() {

  _mainMenu = mainwindow.findChild("_mainMenu");
  _shortcutMenu = mainwindow.findChild("_shortcutMenu");
  _employee = mainwindow.findChild("_employee");

  _mainMenu.addColumn(qsTr("MAIN MENU"), -1, Qt.AlignLeft, true, "menuItem");

  _mainMenu.setStyleSheet(desktopStyle);
  _shortcutMenu.setStyleSheet(desktopStyle);
  _mainMenu.alternatingRowColors = false;
  _shortcutMenu.alternatingRowColors = false;
  _shortcutMenu.maximumHeight = 400;
  _shortcutMenu.addColumn(qsTr("SHORTCUTS"), -1, Qt.AlignLeft, true, "menuAction");

  shortcutsMenuPopulateList();

  var params = {};
  var _ver = metrics.value("ServerVersion").substring(0, 1);
  if (_ver > 4)
    params.version = true;

  var _employeeSql = "SELECT 0 as sort, crmacct_name, crmacct_usr_username "
                +    " <? if exists('version') ?> "
                + "FROM emp JOIN crmacct ON (emp_crmacct_id=crmacct_id) "
                 + "<? else ?> "
                + "FROM emp JOIN crmacct ON (emp_id=crmacct_emp_id) "
                + "<? endif ?> "
                + "WHERE crmacct_usr_username = geteffectivextuser() "
                + "UNION SELECT 1 as sort, geteffectivextuser(), usr_propername "
                + "FROM usr WHERE usr_username = geteffectivextuser() "
                + "ORDER BY 1 ASC LIMIT 1;       ";
  var _employeeData = toolbox.executeQuery(_employeeSql, params);
  if (_employeeData.first()){
    _employee.text = _employeeData.value("crmacct_name");
    _employee.wordWrap = true;
  }

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

  var menu = [ "menu.prod",  "menu.im",    "menu.sched",
               "menu.purch", "menu.manu",  "menu.crm",
               "menu.sales", "menu.accnt", "menu.sys" ],
     scMaxLength = 25,
     sep = qsTr(" > "),
     scq, column, idx, item, i, j, path, longText;

  function getPath(objName, menu) {
    var actions, item, i, submenu;
    if (! menu) {
      return; // menu.sched is only defined if xtmfg is installed
    } else if (menu.objectName === objName) {
      return [ menu ];
    } else if (menu.menu || menu.actions) {
      if (menu.menu) {
        submenu = menu.menu();
        actions = (submenu && submenu.actions) ? submenu.actions() : [];
      } else
        actions = menu.actions();
      for (i = 0; i < actions.length; i++) {
        item = getPath(objName, actions[i]);
        if (item) {
          item.unshift(menu);
          return item;
        }
      }
    }
  }
  
  _shortcutMenu.clear();
  scq = toolbox.executeDbQuery("desktop", "userShortcuts", new Object);

  _shortcutMenu.populate(scq);
  
  column = _shortcutMenu.column('menuAction');
  for (idx = _shortcutMenu.topLevelItemCount - 1; idx >= 0; idx--) {
    item = _shortcutMenu.topLevelItem(idx);
    for (i = 0; i < menu.length; i++) {
      path = getPath(item.rawValue('menuAction'), mainwindow.findChild(menu[i]));
      if (path && path.length) {
        longText = path.map(function (elem) { return elem.text ? elem.text : "" })
                       .filter(function (elem) { return elem; })
                       .join(sep);
        longText = longText.replace(/(\.\.\.|&)/g, "");
        break;
      }
    }
    if (longText) {
      if (longText.length < scMaxLength)
        item.setData(column, Qt.DisplayRole, longText);
      else {
        // shorten the shortcut to a '>' boundary if it looks too long
        for (j = i = longText.indexOf(sep);
             longText.length - j > scMaxLength && j > 0;
             j = longText.indexOf(sep, j + 1)) {
          i = j;
        }
        item.setData(column, Qt.DisplayRole, "..." + longText.substring(i));
      }
      item.setData(column, Qt.ToolTipRole, longText);
    }
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
