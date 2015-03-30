/*
 * This file is part of the xTuple ERP: PostBooks Edition, a free and
 * open source Enterprise Resource Planning software suite,
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the Common Public Attribution License
 * version 1.0, the full text of which (including xTuple-specific Exhibits)
 * is available at www.xtuple.com/CPAL.  By using this software, you agree
 * to be bound by its terms.
 */

debugger;

// Import code from related scripts
include("dockBankBal");
include("dockExtensions");
include("dockGLAccounts");
include("dockMessageHistory");
include("dockMfgActive");
include("dockMfgHist");
include("dockMfgOpen");
include("dockMyAccounts");
include("dockMyContacts");
include("dockMyTodo");
include("dockPayables");
include("dockPurchActive");
include("dockPurchHist");
include("dockPurchOpen");
include("dockReceivables");
include("dockSalesActive");
include("dockSalesHistory");
include("dockSalesOpen");
include("dockSendMessage");
include("dockUserOnline");
include("desktopMenuBar");

// ================================================
// xtDesktop global stylesheet can be maintained from this string
var _globalStyle = 'font: 75 bold 10pt "Verdana"; color: rgb(138, 138, 138); selection-color: rgb(36, 146, 222); background-color: rgb(255, 255, 255);';
// ================================================

var _desktopStack;
var _open = qsTr("Open...");
var _dtTimer;
var _leftAreaDocks = new Array();
var _bottomAreaDocks = new Array();
var _windows = new Array();
var _hasSavedState = settingsValue("hasSavedState").length > 0;
var _vToolBar = new Object;
var _vToolBarActions = new Array();
var showDashboardAnything = false;

var _mainMenu;
var _shortcuts;
var _employeeImage;
var _employee;

var _menuDesktop = new QMenu(qsTr("Desktop"),mainwindow);
var _menuToolBar = new QMenu(mainwindow);
var _menuWindow = mainwindow.findChild("menu.window");

// Create Menu items for setup windows
var _menuSetup = new QMenu(qsTr("Setup"),mainwindow);

// Add desktop to main window
addAction("sys.currencies","currencies","CreateNewCurrency","CreateNewCurrency");
addAction("sys.exchangeRates","currencyConversions","MaintainCurrencyRates","ViewCurrencyRates");

// Set up refresh timer
_dtTimer = new QTimer(mainwindow);
_dtTimer.setInterval(metrics.value("desktop/timer"));
_dtTimer.start();

// Setup the desktop layout
_desktopWidget = toolbox.createWidget("QWidget", mainwindow, "_desktopWidget");
_desktopLayout = toolbox.createLayout("QHBoxLayout", mainwindow, "_desktopLayout");
_desktopMenu = toolbox.loadUi("desktopMenuBar", mainwindow);
_desktopMenu.maximumWidth = 200;
_desktopStack = toolbox.createWidget("QStackedWidget", mainwindow, "_desktopStack");
_desktopLayout.addWidget(_desktopMenu);
_desktopLayout.addWidget(_desktopStack);
_desktopWidget.setLayout(_desktopLayout);
var _desktopParent;

// only show desktop when in free floating mode
if (mainwindow.showTopLevel())
  _desktopParent = mainwindow;

if (_desktopParent)
{
  _desktopParent.setCentralWidget(_desktopWidget);
  _vToolBar = new QToolBar(_desktopParent);
  _desktopParent.addToolBar(Qt.LeftToolBarArea, _vToolBar);

  // Initialise Menu Bar items
  setupDesktopMenu();

  // Intialize the left toolbar (as of xtDesktop 4.0.0 no longer visible but the toolbar actions are still used)
  _vToolBar.objectName = "_vToolBar";
  _vToolBar.windowTitle = "Desktop Toolbar";
  _vToolBar.floatable = false;
  _vToolBar.movable = false;
  _vToolBar.visible = false;  // Turn off left toolbar and replace with menus
  _vToolBar.toolButtonStyle = Qt.ToolButtonTextOnly;

  // Initialize Desktop
  // Set up browser for Welcome Page
  var _welcome = new QWebView(mainwindow);
  var welcomeUrl = (function () {
    var databaseURL  = mainwindow.databaseURL(),
        string       = databaseURL.split("/"),
        hostName     = string[2].substring(0, string[2].indexOf(":")),
        databaseName = string[3],
        urlString = metrics.value("desktop/welcome")
                  + "?client=desktop" + "&hostname=" + hostName
                  + "&organization=" + databaseName
                  + "&edition=" + metrics.value("Application")
                  + "&version=" + metrics.value("ServerVersion")
    ;
    return new QUrl(urlString);
  })();
  _welcome.objectName = "_welcome";
  _welcome["loadFinished(bool)"].connect(loadLocalHtml);
  _welcome["linkClicked(const QUrl &)"].connect(openUrl);
  _welcome.load(welcomeUrl);
  _welcome.page().linkDelegationPolicy = QWebPage.DelegateAllLinks;
  _desktopStack.addWidget(_welcome);
  addToolBarAction(qsTr("Welcome"), "home_32");
  _vToolBarActions[0].checked = true;

  if (showDashboardAnything) {
    var _home = new QWebView(mainwindow);
    _home["loadFinished(bool)"].connect(missingxTupleServer);
    _home["linkClicked(const QUrl &)"].connect(openUrl);
    var homeURL = "https://" + metrics.value("WebappHostname")
                + ":" + metrics.value("WebappPort")
                + "/" + mainwindow.databaseURL().split("/")[3];
                + "/npm/xtuple-dashboard-anything/public/index.html";
    _home.load(new QUrl(homeURL));
    _home.page().linkDelegationPolicy = QWebPage.DelegateAllLinks;
    _desktopStack.addWidget(_home);
    addToolBarAction(qsTr("Dashboard"), "home_32");
  }

  // Initialize additional desktop UIs and Dock Widgets
  // (Init functions come from the code pulled in by the include statements)
  addDesktop("desktopCRM", "clients_32", "ViewCRMDesktop");
  initDockTodo();
  initDockAccounts();
  initDockMyCntcts();

  addDesktop("desktopSales", "reward_32", "ViewSalesDesktop");
  initDockSalesAct();
  initDockSalesHist();
  initDockSalesOpen();

  addDesktop("desktopAccounting", "accounting_32", "ViewAccountingDesktop");
  initDockPayables();
  initDockReceivables();
  initDockBankBal();
  initDockGLAccounts();

  addDesktop("desktopPurchase", "order_32", "ViewPurchaseDesktop");
  initDockPurchAct();
  initDockPurchHist();
  initDockPurchOpen();

  addDesktop("desktopManufacture", "industry_32", "ViewManufactureDesktop");
  initDockMfgAct();
  initDockMfgHist();
  initDockMfgOpen();

  addDesktop("desktopSocial", "social", "viewSocialDesktop");
  initDockUserOnline();
  initDockMessageHistory();
  initDockSendMessage();

  var maintWin = addDesktop("desktopMaintenance", "gear_32", "ViewMaintenanceDesktop");
  initDockExtensions();

  // Hack to fix icon size problem until next core release
  var maintToolbar = maintWin.findChild("_toolbar");
  _vToolBar.iconSize = maintToolbar.iconSize;
  maintWin.removeToolBar(maintToolbar);

  // Handle window actions
  _menuWindow.aboutToShow.connect(prepareWindowMenu);

  // Change behavior of item site button if commercial edition
  if (metrics.boolean("MultiWhs"))
  {
    var button = mainwindow.findChild("_sites");
    button.label = qsTr("Sites");
    button.actionName = "im.warehouses";
  }
}
else
{
  if (!preferences.boolean("NoDesktopNotice"))
    toolbox.openWindow("desktopNotice",mainwindow, Qt.WindowModal, Qt.Dialog);
}

/*!
  Adds screen with name of @a uiName to the desktop stack so long as the user has
  been granted the privilege @a privName. The @a windowTitle of the UI object is 
  added to the Desktop Dock so that when it is clicked, the associated window is 
  selected on the Desktop.
*/
function addDesktop(uiName, imageName, privilege)
{
  // Get the UI and add to desktop stack
  var desktop = toolbox.loadUi(uiName);
  if (desktop) {
    desktop.setStyleSheet(_globalStyle);
    _desktopStack.addWidget(desktop);
    _windows[_windows.length] = desktop;
    addToolBarAction(desktop.windowTitle, imageName, privilege);
    desktop.restoreState();
  }
  else {
    print('xtdesktop.initMenu could not addDesktop(' + uiName + ')');
  }
  return desktop;
}

/*!
  Add a button with @a label and @a imageName to the left desktop toolbar
*/
function addToolBarAction(label, imageName, privilege)
{
  // Get the icon
  var icn = new QIcon();
  icn.addDbImage(imageName);

  // Create the action (add to menu not seen to ensure priv rescans work)
  var act = _menuToolBar.addAction(icn, label);
  if (act) {
    act.checkable = true;
    if (privilege)
    {
      act.setEnabled(privileges.check(privilege));
      act.setData(privilege);
    }

    _vToolBar.addAction(act);
    _vToolBarActions[_vToolBarActions.length] = act;
    _vToolBar["actionTriggered(QAction*)"].connect(toolbarActionTriggered);

    if (!privilege || privileges.check(privilege))
      var menuItem = new XTreeWidgetItem(_mainMenu, _vToolBarActions.length, _vToolBarActions.length, qsTr(label));
  }
  else {
    print('addToolbarAction() could not add ' + label);
  }
}

/*!
  Loads a local HTML page from the database if the xTuple welcome page
  fails to load.
*/
function loadLocalHtml(ok)
{
  if (!ok)
  {
    // Page didn't load, so load internal HTML saying we aren't connected
    var q = toolbox.executeQuery("SELECT xtdesktop.fetchWelcomeHtml() AS html");
    q.first();
    _welcome.setHtml(q.value("html"));
  }
  // We don't want to deal with loading any more web pages.  Let OS do it
  _welcome.page().linkDelegationPolicy = QWebPage.DelegateAllLinks;;
}

function missingxTupleServer(ok)
{
  if (!ok)
  {
    // xTuple Server is not available or didn't load, so load internal HTML saying we aren't connected
    var q = toolbox.executeQuery("SELECT xtdesktop.fetchxTupleServerHtml() AS html");
    q.first();
    _home.setHtml(q.value("html"));
  }
  // We don't want to deal with loading any more web pages.  Let OS do it
  _home.page().linkDelegationPolicy = QWebPage.DelegateAllLinks;;
}

/*!
  Launches links clicked on home page into new local browser window
*/
function openUrl(url)
{
  toolbox.openUrl(new QUrl(url).toString());
}

/*!
  Adds desktop to the window menu
*/
function prepareWindowMenu()
{
  // TO DO: Make this more modular
  var idx = _desktopStack.currentIndex;
  _dockMycontacts.toggleViewAction().visible = (idx == 2);
  _dockMyaccounts.toggleViewAction().visible = (idx == 2);
  _dockMytodo.toggleViewAction().visible = (idx == 2);
  _dockSalesAct.toggleViewAction().visible = (idx == 3);
  _dockSalesHist.toggleViewAction().visible = (idx == 3);
  _dockSalesOpen.toggleViewAction().visible = (idx == 3);
  _dockBankBal.toggleViewAction().visible = (idx == 4);
  _dockPayables.toggleViewAction().visible = (idx == 4);
  _dockReceivables.toggleViewAction().visible = (idx == 4);
  _dockGLAccounts.toggleViewAction().visible = (idx == 4);
  _dockPurchAct.toggleViewAction().visible = (idx == 5);
  _dockPurchHist.toggleViewAction().visible = (idx == 5);
  _dockPurchOpen.toggleViewAction().visible = (idx == 5);
  _dockMfgAct.toggleViewAction().visible = (idx == 6);
  _dockMfgHist.toggleViewAction().visible = (idx == 6);
  _dockMfgOpen.toggleViewAction().visible = (idx == 6);
  _dockSendMessage.toggleViewAction().visible = (idx == 7);
  _dockMessageHistory.toggleViewAction().visible = (idx == 7);
  _dockUserOnline.toggleViewAction().visible = (idx == 7);
  _dockExtensions.toggleViewAction().visible = (idx == 8);
//  _dockUserOnline.toggleViewAction().visible = (idx == 7);
  _menuWindow.addSeparator();
  _menuWindow.addMenu(_menuDesktop);
}

function toolbarActionTriggered(action)
{
  // Move to the desktop page specified
  for (i in _vToolBarActions)
  {
    if (_vToolBarActions[i] == action)
      _desktopStack.currentIndex = i
    else
      _vToolBarActions[i].checked = false;
  }
}

function addAction(actionName, slotName, editPriv, viewPriv)
{
  var tempaction;
  tmpaction = new QAction(mainwindow);
  tmpaction.enabled = privileges.value(editPriv) || privileges.value(viewPriv);
  tmpaction.setData(editPriv + " " + viewPriv);
  tmpaction.objectName = actionName;
  tmpaction.triggered.connect(this, slotName);
  _menuSetup.appendAction(tmpaction);
}

function openSetup(uiName)
{
  var params = new Object;
  params.uiName = uiName;
  var wnd = toolbox.openWindow("setup", mainwindow);
  toolbox.lastWindow().set(params);
  wnd.exec();
}

function currencies()
{
  openSetup("currencies");
}

function currencyConversions()
{
  openSetup("currencyConversions");
}
