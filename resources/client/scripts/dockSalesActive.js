/*
 * This file is part of the xTuple ERP: PostBooks Edition, a free and
 * open source Enterprise Resource Planning software suite,
 * Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the Common Public Attribution License
 * version 1.0, the full text of which (including xTuple-specific Exhibits)
 * is available at www.xtuple.com/CPAL.  By using this software, you agree
 * to be bound by its terms.
 */

var _dockSalesAct;
var _salesAct;

/*!
  Initializes Sales Activity dock widget and places it in the main window.
*/
function initDockSalesAct()
{
  var _salesActIsDirty = true;

  _dockSalesAct = mainwindow.findChild("_dockSalesAct");
  _salesAct = mainwindow.findChild("_salesAct");

  _salesAct.addColumn(qsTr("Type"), -1,  Qt.AlignLeft,   true, "activity");
  _salesAct.addColumn(qsTr("#"), 40,  Qt.AlignRight,  true, "count");
  _salesAct.addColumn(qsTr("Amount"), -1,  Qt.AlignRight,  true, "amount");

  _dtTimer.timeout.connect(refreshSalesAct);
  mainwindow.billingSelectionUpdated.connect(refreshSalesAct);
  mainwindow.invoicesUpdated.connect(refreshSalesAct);
  mainwindow.quotesUpdated.connect(refreshSalesAct)
  mainwindow.salesOrdersUpdated.connect(refreshSalesAct);

  _salesAct.itemSelected.connect(openWindowSalesAct);
  _salesAct["populateMenu(QMenu*,XTreeWidgetItem*,int)"]
    .connect(populateMenuSalesAct);

  _dockSalesAct.visibilityChanged.connect(fillListSalesAct);

  // Handle privilege control
  var act = _dockSalesAct.toggleViewAction();

  if (!privileges.check("ViewSalesActivitiesDock"))
  {
    _dockSalesAct.hide();
    act.enabled = false;
  }

  // Allow rescan to let them show if privs granted
  act.setData("ViewSalesActivitiesDock");
  _menuDesktop.appendAction(act);
  fillListSalesAct();

  function fillListSalesAct()
  {
    if (! _dockSalesAct || !_dockSalesAct.visible || !_salesActIsDirty)
      return;

    var params = {
      quotes:   qsTr("Quotes"),
      open:     qsTr("Orders"),
      print:    qsTr("To Print"),
      pick:     qsTr("Pick"),
      ship:     qsTr("At Shipping"),
      bill:     qsTr("Shipped"),
      invoice:  qsTr("To Bill"),
      post:     qsTr("Invoiced"),
    };

    _salesAct.populate(toolbox.executeDbQuery("desktop", "salesAct", params));
    _salesActIsDirty = false;
  }

  function openWindowSalesAct()
  {
    var ui;
    var run = false;
    var act = _salesAct.currentItem().rawValue("activity");
    
    // Make sure we can open the window for this activity
    if (!privilegeCheckSalesAct(act))
      return;

    // Determine which window to open
    if (act == "Q")
    {
      ui = "quotes";
      run = true;
    }
    else if (act == "O")
    {
      ui = "openSalesOrders";
      run = true;
    }
    else if (act == "P")
      ui = "packingListBatch";
    else if (act == "S")
    {
      ui = "maintainShipping";
      run = true;
    }
    else if (act == "B")
      ui = "uninvoicedShipments";
    else if (act == "I")
      ui = "dspBillingSelections";
    else if (act == "T")
      ui = "unpostedInvoices";

    // Open the window and perform any handling required
    toolbox.openWindow(ui);
    if (run)
      toolbox.lastWindow().sFillList();
  }

  function populateMenuSalesAct(pMenu, pItem)
  {
    var menuItem;
    var act = pItem.rawValue("activity");
    var enable = privilegeCheckSalesAct(act);

    menuItem = pMenu.addAction(_open);
    menuItem.enabled = enable;
    menuItem.triggered.connect(openWindowSalesAct);
  }

  function privilegeCheckSalesAct(act)
  {
    if (act == "Q") // Quote
      return privileges.check("ViewQuotes") || 
             privileges.check("MaintainQuotes")
    else if (act == "O") // Open Sales Orders
      return privileges.check("ViewSalesOrders") || 
             privileges.check("MaintainSalesOrders");
    else if (act == "P") // Packlist Batch
      return privileges.check("ViewPackingListBatch") || 
             privileges.check("MaintainPackingListBatch");
    else if (act == "S") // Shipping
      return privileges.check("ViewShipping");
    else if (act == "B" || 
             act == "I" || 
             act == "T") // Billing, Invoicing
      return privileges.check("SelectBilling");

    return false;
  }

  function refreshSalesAct()
  {
    _salesActIsDirty = true;
    fillListSalesAct();
  }
}
