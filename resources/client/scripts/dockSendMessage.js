var _dockSendMessage;
var _usr;
var _message;
var _send;
var _sendMessageIsDirty = true;
var _periodId = -1;
var _b1CommentConsole;
var _b2CommentConsole;
var _commentConsole;
var _commentConsoleIsDirty = true;
var _periodId = -1;

function initDockSendMessage()
{
  // Set up objects
  _dockSendMessage = mainwindow.findChild("_dockSendMessage");
  _usr             = mainwindow.findChild("_usr");
  _message         = mainwindow.findChild("_message");
  _send            = mainwindow.findChild("_send");

  _commentConsole   = mainwindow.findChild("_commentConsole");

  _b1CommentConsole = mainwindow.findChild("_button1");
  _b2CommentConsole = mainwindow.findChild("_button2");

  // Set icons
  var iReload = new QIcon;
  iReload.addDbImage("reload_16");
  _b1CommentConsole.icon = iReload;
  _b1CommentConsole.text = "";
  _b1CommentConsole.toolTip = qsTr("Reload");

  var iGear = new QIcon();
  iGear.addDbImage("gear_16");
  _b2CommentConsole.icon = iGear;
  _b2CommentConsole.text = "";
  _b2CommentConsole.toolTip = qsTr("Preferences...");

  // Set columns on list
  _commentConsole.addColumn("Date",           75,  1, true, "comment_date");
  _commentConsole.addColumn("Comment Type",   115, 1, true, "cmnttype_name");
  _commentConsole.addColumn("Text",           90,  1, true, "comment_text");
  _commentConsole.addColumn("Source",         115, 1, true, "comment_source")
  _commentConsole.addColumn("User",           65,  1, true, "comment_user")
  _commentConsole.addColumn("Detail",         -1,  1, true, "info");
  _commentConsole.addColumn("Points",         40,  3, true, "points");

  mainwindow.itemsitesUpdated.connect(refreshCommentConsole);
  mainwindow.warehousesUpdated.connect(refreshCommentConsole);
  mainwindow.customersUpdated.connect(refreshCommentConsole)
  mainwindow.employeeUpdated.connect(refreshCommentConsole);
  mainwindow.vendorsUpdated.connect(refreshCommentConsole);
  mainwindow.returnAuthorizationsUpdated.connect(refreshCommentConsole);
  mainwindow.salesOrdersUpdated.connect(refreshCommentConsole)
  mainwindow.quotesUpdated.connect(refreshCommentConsole);
  mainwindow.workOrdersUpdated.connect(refreshCommentConsole);
  mainwindow.purchaseOrdersUpdated.connect(refreshCommentConsole);
  mainwindow.bomsUpdated.connect(refreshCommentConsole)
  mainwindow.bbomsUpdated.connect(refreshCommentConsole);
  mainwindow.boosUpdated.connect(refreshCommentConsole);
  mainwindow.projectsUpdated.connect(refreshCommentConsole);
  mainwindow.crmAccountsUpdated.connect(refreshCommentConsole)
  mainwindow.transferOrdersUpdated.connect(refreshCommentConsole);

  _b1CommentConsole.clicked.connect(refreshCommentConsole);
  _b2CommentConsole.clicked.connect(preferencesCommentConsole);

  _commentConsole["populateMenu(QMenu*,XTreeWidgetItem*,int)"]
    .connect(populateMenuCommentConsole);

  mainwindow["tick()"].connect(refreshCommentConsole);

  var act = _dockSendMessage.toggleViewAction();
  if (!privileges.check("viewSendMsgDock"))
  {
    _dockSendMessage.hide();
    act.enabled = false;
  }
  else
  {
    _dockSendMessage.show();
    act.enabled = true;
  }

  // Allow rescan to let them show if privs granted
  act.setData("viewSendMsgDock");
  _menuDesktop.appendAction(act);

  _usr["newId(int)"].connect(sHandleButtons);
  _send.clicked.connect(send);

  fillListCommentConsole();
}

function getParams()
{
  var params = new Object;

  params.message = _message.plainText;
  if (_usr.id() > 0)
    params.usr_id = _usr.id();

  return params;
}

function sHandleButtons()
{
  var qry = "SELECT usr_id FROM usr WHERE usr_username = current_user;";
  var data = toolbox.executeQuery(qry, -1);
  if (data.first())
    var currenttUsr_id = data.value("usr_id");

  if (currenttUsr_id == _usr.id())
  {
    if (QMessageBox.information(mainwindow, qsTr("Send Message?"),
                            qsTr("You are trying to Send Message to Yourself."
                              +" Are you sure that you really want to Continue?."),
           QMessageBox.Yes | QMessageBox.No, QMessageBox.Yes) == QMessageBox.No)
    {
      _usr.clear();
      return;
    }
  }

  _send.enabled = (_usr.id() >= 0);
}

function send()
{
  var params = getParams();
  var qry = toolbox.executeDbQuery("desktop", "sendMessageToUser", params);
  QMessageBox.information(mainwindow,'Sent','Message Sent');
  clear();
}

function set(input)
{
  if ("user" in input)
    _usr.setUsername(input.user);
  else
   QMessageBox.warning(mywindow, "Message", "Could not set username");
}

function clear()
{
  _usr.clear();
  _message.clear();
}

function fillListCommentConsole()
{
  _commentConsole = mainwindow.findChild("_commentConsole");

  var cmmntTypeList = preferences.value("MonitoredCommentTypes");
  var cmmntSrcList = preferences.value("MonitoredCommentSrcs");
  var cmmntUsrList = preferences.value("MonitoredCommentUsrs");

  var params = new Object;

  //Checking whether xtmfg package exists in the database or not
  var checkxtmfg = "SELECT pkghead_id "
                 + "FROM pkghead "
                 + "WHERE (pkghead_name = 'xtmfg');";
  var datacheckxtmfg = toolbox.executeQuery(checkxtmfg, params);
  if (datacheckxtmfg.first())
    params.xtmfg_exist = datacheckxtmfg.value("pkghead_id");
  else if (datacheckxtmfg.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mainwindow, qsTr("Database Error"),
                         datacheckxtmfg.lastError().text);
    return;
  }

  var getDate = "SELECT CURRENT_DATE + CAST(<? literal('offSet') ?> AS INTEGER) AS datevalue;";

  params.offSet = ((preferences.value("MonitoredCommentStrtDate") != '')?preferences.value("MonitoredCommentStrtDate"):-1);
  var data = toolbox.executeQuery(getDate, params);
  if (data.first())
    params.startDate = data.value("datevalue");
  else if (data.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mainwindow, qsTr("Database Error"),
                         data.lastError().text);
    return;
  }

  params.offSet = ((preferences.value("MonitoredCommentEndDate") != '')?preferences.value("MonitoredCommentEndDate"):0);
  var data = toolbox.executeQuery(getDate, params);
  if (data.first())
    params.endDate = data.value("datevalue");
  else if (data.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mainwindow, qsTr("Database Error"),
                         data.lastError().text);
    return;
  }

  _commentConsole.clear();

  if (cmmntTypeList.length)
    params.commenttype_id = cmmntTypeList;

  if (cmmntSrcList.length)
  {
    params.sourceidlist = cmmntSrcList;
    var sourceList = new Array();
    var data = toolbox.executeDbQuery("desktop","cmmntPrefSrc", params);
    var i = 0;
    while (data.next())
      sourceList.push(data.value("cmntsource_name"));
    params.source = sourceList;
  }

  if(cmmntUsrList.length)
    params.usr_id = cmmntUsrList;

  _commentConsole.populate(toolbox.executeDbQuery("desktop","commentConsole", params));
  _commentConsoleIsDirty = false;
}

function populateMenuCommentConsole(pMenu, pItem, pCol)
{
  try
  {
    var doctype = pItem.text("comment_source");

    // undo oddities in the desktop-commentConsole mql
    if (doctype == 'T-Contact')
      doctype = 'T';
    else if (doctype == 'OPP-Opportunity')
      doctype = 'OPP';

    var lookup = {},
        editAct,
        viewAct
    ;

    // TODO: put more detail in the source table then use that instead
    lookup['ADDR']  = { editPriv: "MaintainAddresses", viewPriv: "ViewAddresses",
                        id: "addr_id", uiform: "address",                  wflags: Qt.Dialog };
    lookup['BBH']   = { editPriv: "MaintainBBOMs",     viewPriv: "ViewBBOMs",
                        id: "bbomhead_id", uiform: "bbom",                     wflags: Qt.Window };
    lookup['BBI']   = { editPriv: "MaintainBBOMs",     viewPriv: "ViewBBOMs",
                        id: "bbomitem_id", uiform: "bbomItem",             wflags: Qt.Dialog };
    lookup['BMH']   = { editPriv: "MaintainBOMs",      viewPriv: "ViewBOMs",
                        id: "bomhead_id", uiform: "BOM",                   wflags: Qt.Window };
    lookup['BIM']   = { editPriv: "MaintainBOMs",      viewPriv: "ViewBOMs",
                        id: "bomitem_id", uiform: "bomItem",               wflags: Qt.Dialog };
    lookup['BOH']   = { editPriv: "MaintainBOOs",      viewPriv: "ViewBOOs",
                        id: "boohead_id", uiform: "boo",                      wflags: Qt.Dialog };
    lookup['BOI']   = { editPriv: "MaintainBOOs",      viewPriv: "ViewBOOs",
                        id: "booitem_id", uiform: "booItem",               wflags: Qt.Dialog };
    lookup['CRMA']  = { editPriv: "MaintainPersonalCRMAccounts MaintainAllCRMAccounts",
                        viewPriv: "ViewPersonalCRMAccounts     ViewAllCRMAccounts",
                        id: "crmacct_id", uiform: "crmaccount",            wflags: Qt.Window };
    lookup['T']     = { editPriv: "MaintainPersonalContacts    MaintainAllContacts",
                        viewPriv: "ViewPersonalContacts        ViewAllContacts",
                        id: "cntct_id", uiform: "contact",                 wflags: Qt.Dialog };
    lookup['C']     = { editPriv: "MaintainCustomerMasters", viewPriv: "ViewCustomerMasters",
                        id: "cust_id", uiform: "customer",                 wflags: Qt.Window };
    lookup['EMP']   = { editPriv: "MaintainEmployees",       viewPriv: "ViewEmployees",
                        id: "emp_id", uiform: "employee",                  wflags: Qt.Dialog };
    lookup['INCDT'] = { editPriv: "MaintainPersonalIncidents   MaintainAllIncidents",
                        viewPriv: "ViewPersonalIncidents       ViewAllIncidents",
                        id: "incdt_id", uiform: "incident",                wflags: Qt.Window };
    lookup['I']     = { editPriv: "MaintainItemMasters",    viewPriv: "ViewItemMasters",
                        id: "item_id", uiform: "item",                     wflags: Qt.Window };
    lookup['IS']    = { editPriv: "MaintainItemSites",      viewPriv: "ViewItemSites",
                        id: "itemsite_id", uiform: "itemSite",             wflags: Qt.Dialog };
    lookup['IR']    = { editPriv: "MaintainItemSources",    viewPriv: "ViewItemSources",
                        id: "itemsrc_id", uiform: "itemSource",            wflags: Qt.Dialog };
    lookup['L']     = { editPriv: "MaintainLocations",      viewPriv: "ViewLocations",
                        id: "location_id", uiform: "location",             wflags: Qt.Dialog };
    lookup['LS']    = { editPriv: "",                       viewPriv: "",
                        id: "ls_id", uiform: "lotSerial",                  wflags: Qt.Dialog };
    lookup['OPP']   = { editPriv: "MaintainPersonalOpportunities MaintainAllOpportunities",
                        viewPriv: "ViewPersonalOpportunities     ViewAllOpportunities",
                        id: "ophead_id", uiform: "opportunity",            wflags: Qt.Dialog };
    lookup['J']     = { editPriv: "MaintainPersonalProjects      MaintainAllProjects",
                        viewPriv: "ViewPersonalProjects          ViewAllProjects",
                        id: "prj_id", uiform: "project",                   wflags: Qt.Dialog };
    lookup['P']     = { editPriv: "MaintainPurchaseOrders", viewPriv: "ViewPurchaseOrders",
                        id: "pohead_id", uiform: "purchaseOrder",          wflags: Qt.Window };
    lookup['PI']    = { editPriv: "MaintainPurchaseOrders", viewPriv: "ViewPurchaseOrders",
                        id: "poitem_id", uiform: "purchaseOrderItem",      wflags: Qt.Dialog };
    lookup['RA']    = { editPriv: "MaintainReturns",        viewPriv: "ViewReturns",
                        id: "rahead_id", uiform: "returnAuthorization",    wflags: Qt.Window };
    lookup['RI']    = { editPriv: "MaintainReturns",        viewPriv: "ViewReturns",
                        id: "raitem_id", uiform: "returnAuthorizationItem",wflags: Qt.Dialog };
    lookup['Q']     = { editPriv: "MaintainQuotes",         viewPriv: "ViewQuotes",
                        id: "quhead_id", uiform: "salesOrder",             wflags: Qt.Window };
    lookup['QI']    = { editPriv: "MaintainQuotes",         viewPriv: "ViewQuotes",
                        id: "soitem_id", uiform: "salesOrderItem",         wflags: Qt.Dialog };
    lookup['S']     = { editPriv: "MaintainSalesOrders",    viewPriv: "ViewSalesOrders",
                        id: "sohead_id", uiform: "salesOrder",             wflags: Qt.Window };
    lookup['SI']    = { editPriv: "MaintainSalesOrders",    viewPriv: "ViewSalesOrders",
                        id: "soitem_id", uiform: "salesOrderItem",         wflags: Qt.Dialog };
    lookup['TA']    = { editPriv: "MaintainPersonalProjects  MaintainAllProjects",
                        viewPriv: "ViewPersonalProjects      ViewAllProjects",
                        id: "prjtask_id", uiform: "task",                  wflags: Qt.Dialog };
    lookup['TD']    = { editPriv: "MaintainPersonalToDoItems MaintainAllToDoItems",
                        viewPriv: "ViewPersonalToDoItems     ViewAllToDoItems",
                        id: "todoitem_id", uiform: "todoItem",             wflags: Qt.Dialog };
    lookup['TO']    = { editPriv: "MaintainTransferOrders", viewPriv: "ViewTransferOrders",
                        id: "tohead_id", uiform: "transferOrder",          wflags: Qt.Window };
    lookup['TI']    = { editPriv: "MaintainTransferOrders", viewPriv: "ViewTransferOrders",
                        id: "toitem_id", uiform: "transferOrderItem",      wflags: Qt.Dialog };
    lookup['V']     = { editPriv: "MaintainVendors",        viewPriv: "ViewVendors",
                        id: "vend_id", uiform: "vendor",                   wflags: Qt.Window };
    lookup['WH']    = { editPriv: "MaintainWarehouses",     viewPriv: "ViewWarehouses",
                        id: "warehous_id", uiform: "warehouse",            wflags: Qt.Dialog };
    lookup['W']     = { editPriv: "MaintainWorkOrders",     viewPriv: "MaintainWorkOrders",
                        id: "wo_id", uiform: "workOrder",                  wflags: Qt.Window };

    _commentConsole = mainwindow.findChild("_commentConsole");

    if(pMenu == null)
      pMenu = _commentConsole.findChild("_menu");
    if(pMenu != null)
    {
      editAct = pMenu.addAction(qsTr("Edit"));
      editAct.enabled = privileges.check(lookup[doctype].editPriv);
      editAct.triggered.connect(editDoctype);

      viewAct = pMenu.addAction(qsTr("View"));
      viewAct.enabled = privileges.check(lookup[doctype].editPriv + " " + lookup[doctype].viewPriv);
      viewAct.triggered.connect(viewDoctype);
    }

    function editDoctype() {
      var mode = "edit";
      if (doctype == "Q" || doctype == "QI")
        mode = "editQuote";

      openDoctype(mode);
    }

    function viewDoctype() {
      var mode = "view";
      if (doctype == "Q" || doctype == "QI")
        mode = "viewQuote";
      openDoctype(mode);
    }

    function openDoctype(mode) {
      try {
        var params  = { mode: mode },
            docdesc = lookup[doctype],
            q;
        params[docdesc.id] = _commentConsole.id();

        // BOM window takes an item_id, not a bomhead_id!
        if (doctype == "BMH") {
          q = toolbox.executeQuery("SELECT bomhead_item_id, bomhead_rev_id"
                                 + "  FROM bomhead"
                                 + " WHERE bomhead_id = <? value('bomhead_id') ?>;",
                                   params);
          if (q.first()) {
            params.item_id = q.value("bomhead_item_id");
            params.revision_id = q.value("bomhead_rev_id");
          } else if (q.lastError() != QSqlError.NoError) {
            throw q.lastError().text;
          }
        }

        var newdlg = toolbox.openWindow(docdesc.uiform, mainwindow,
                                        (docdesc.wflags == Qt.Dialog) ? Qt.ApplicationModal : Qt.NonModal,
                                        docdesc.wflags);
        newdlg.set(params);
        if (newdlg.exec) {
          newdlg.exec();
        }
      } catch (e) {
        QMessageBox.critical(mainwindow, "dockSendMessage",
                             "Could not open a window for source " + doctype + ": " + e);

      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mainwindow, "dockSendMessage",
                         "populateMenuCommentConsole exception: " + e);
  }
}

function preferencesCommentConsole()
{
  try
  {
  	params = new Object;
    var newdlg = toolbox.openWindow("preferencesComment", mainwindow,
                                  Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    if (newdlg.exec())
      refreshCommentConsole();
  }
  catch (e)
  {
    QMessageBox.critical(mainwindow, "dockSendMessage",
                         "preferencesCommentConsole exception: " + e);
  }
}

/*!
  Refreshes data if the window is visible, or the next time it becomes visible
*/
function refreshCommentConsole()
{
  try
  {
  	_commentConsoleIsDirty = true;
    fillListCommentConsole();
  }
  catch (e)
  {
    QMessageBox.critical(mainwindow, "dockSendMessage",
                         "refreshCommentConsole exception: " + e);
  }
}
