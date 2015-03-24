var titleStyle = [ "* {",
    "font-weight: bold;",
"}"
].join(" ");

var imageStyle = [ "* {",
    "border: none;",
    "font: 14px;",
"}"
].join(" ");

var generalStyle = [ "* {",
    "font-family: Helvetica, Verdana, sans-serif;", 
    "font-size:   10pt;",
    "font-weight: regular;",
    "color: rgb(138, 138, 138);",
    "background-color: rgb(255, 255, 255);",
    "selection-color: rgb(1, 119, 255);",
    "selection-background-color: rgb(255, 255, 255);",
"}",
"QStatusBar {",
 //"background-color: rgb(1, 119, 255);",
"}",
"#desktopCollaborateLit, #desktopAccountingLit, #desktopManufactureLit, #_notice, #desktopPurchaseLit, #desktopSalesLit, #desktopSociallit {",
 "text-transform: lowercase;",
 "font-size: 18px;",
 "color: #0177ff;",
 "font-weight: 200;",
"}",
"QGroupBox {",
 "text-transform: uppercase;",
 "border-top: 1px solid #e8e8e8;",
 "border-left: 1px solid qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,stop: 0 #e8e8e8, stop: 0.05 #e8e8e8, stop: 0.06 #FFFFFF, stop: 1 #FFFFFF);",
"border-right: 1px solid qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,stop: 0 #e8e8e8, stop: 0.05 #e8e8e8, stop: 0.06 #FFFFFF, stop: 1 #FFFFFF);",
 "margin-top: 1ex;",
"}",
"QGroupBox::title {",
 "subcontrol-origin: margin;",
 "subcontrol-position: top center;",
 "padding: 0 3px;",
"}",
"MenuButton::label {",
 "max-width: 90%;",
"}"
].join(" ");

var desktopMenuStyle = [ "* {",
    "selection-color: rgb(1, 119, 255);",
    "selection-background-color: rgb(255,255,255);",
//  "XTreeWidget::branch { border-image-source: none;};",
    "border-style: none;",
"}"
].join(" ");

