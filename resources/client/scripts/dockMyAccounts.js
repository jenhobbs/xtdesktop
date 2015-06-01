/*
 * This file is part of the xTuple ERP: PostBooks Edition, a free and
 * open source Enterprise Resource Planning software suite,
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the Common Public Attribution License
 * version 1.0, the full text of which (including xTuple-specific Exhibits)
 * is available at www.xtuple.com/CPAL.  By using this software, you agree
 * to be bound by its terms.
 */

var _dockMyaccounts;
var _accountList;

/*!
  Initializes the My Accounts dock widget and places it in the main window.
*/
function initDockAccounts()
{
  var _accountListIsDirty = true;
  _dockMyaccounts = mainwindow.findChild("_dockMyaccounts");
  _accountList = mainwindow.findChild("_accountList");

  _accountList.addColumn(qsTr("Number"), XTreeWidget.itemColumn, Qt.AlignLeft,  false, "crmacct_number");
  _accountList.addColumn(qsTr("Name"), -1, Qt.AlignLeft,  true, "crmacct_name");
  _accountList.addColumn(qsTr("Contact"), -1, Qt.AlignLeft  , false, "cntct_name" );
  _accountList.addColumn(qsTr("Phone"), -1, Qt.AlignLeft, false, "cntct_phone" );
  _accountList.addColumn(qsTr("Email"), -1, Qt.AlignLeft, false, "cntct_email" );
  _accountList.addColumn(qsTr("Address"), -1, Qt.AlignLeft  , false, "addr_line1" );
  _accountList.addColumn(qsTr("City"), XTreeWidget.docTypeColumn, Qt.AlignLeft  , false, "addr_city" );
  _accountList.addColumn(qsTr("State"), XTreeWidget.orderColumn, Qt.AlignLeft  , false, "addr_state" );
  _accountList.addColumn(qsTr("Country"), XTreeWidget.orderColumn, Qt.AlignLeft  , false, "addr_country" );
  _accountList.addColumn(qsTr("Postal Code"), XTreeWidget.docTypeColumn, Qt.AlignLeft  , false, "addr_postalcode" );

  mainwindow.crmAccountsUpdated.connect(refreshMyAccts);
  mainwindow.customersUpdated.connect(refreshMyAccts);
  mainwindow.vendorsUpdated.connect(refreshMyAccts);

  _accountList.itemSelected.connect(openWindowMyAccts);
  _accountList["populateMenu(QMenu*,XTreeWidgetItem*,int)"]
    .connect(populateMenuMyAccts);

  _dockMyaccounts.visibilityChanged.connect(fillListMyAccts);

  // Handle privilege control
  var act = _dockMyaccounts.toggleViewAction();

  // Don't show if no privs
  if (!privileges.check("ViewMyAccountsDock"))
  {
    _dockMyaccounts.hide();
    act.enabled = false;
  }

  // Allow rescan to let them show if privs granted
  act.setData("ViewMyAccountsDock");
  _menuDesktop.appendAction(act);

  fillListMyAccts();

  function fillListMyAccts()
  {
    if (! _dockMyaccounts || ! _accountList || !_dockMyaccounts.visible || !_accountListIsDirty)
      return;

    _accountList.populate(toolbox.executeDbQuery("desktop", "crmaccounts",
                                                 { owner_username: mainwindow.username()} ));

    _accountListIsDirty = false;
  }

  function openWindowMyAccts()
  {
    if (!privilegeCheckMyAccts())
      return;

    params = { crmacct_id: _accountList.id() };
    if (privileges.check("MaintainAllCRMAccounts") || privileges.check("MaintainPersonalCRMAccounts"))
      params.mode = "edit"
    else
      params.mode = "view"

    // Open the window and perform any special handling required
    var win = toolbox.openWindow("crmaccount");
    win.set(params);
  }

  function populateMenuMyAccts(pMenu)
  {
    var menuItem;

    menuItem = pMenu.addAction(_open);
    menuItem.enabled = privilegeCheckMyAccts();
    menuItem.triggered.connect(openWindowMyAccts);
  }

  function privilegeCheckMyAccts()
  {
    return privileges.check("MaintainAllCRMAccounts") || privileges.check("MaintainPersonalAccounts") ||
           privileges.check("ViewAllCRMAccounts") || privileges.check("ViewPersonalCRMAccounts");
  }

  function refreshMyAccts()
  {
    _accountListIsDirty = true;
    fillListMyAccts();
  }
}
