TEMPLATE = app
TARGET = xtdesktop_ts
DEPENDPATH += ../../../resources . ../uiforms
INCLUDEPATH += .

# Input
FORMS = \
         ../uiforms/desktop.ui                  \
         ../uiforms/desktopAccounting.ui        \
         ../uiforms/desktopCRM.ui               \
         ../uiforms/desktopMaintenance.ui       \
         ../uiforms/desktopManufacture.ui       \
         ../uiforms/desktopMenuBar.ui           \
         ../uiforms/desktopNotice.ui            \
         ../uiforms/desktopPurchase.ui          \
         ../uiforms/desktopSales.ui             \
         ../uiforms/desktopSocial.ui            \
         ../uiforms/preferencesComment.ui       \
         ../uiforms/preferencesHistory.ui       \
         ../uiforms/preferencesNumber.ui        \
         ../uiforms/preferencesSelections.ui    \
         ../uiforms/sendMessageToUser.ui

SOURCES = \
        ../scripts/contact.js                   \
        ../scripts/desktopMenuBar.js            \
        ../scripts/desktopNotice.js             \
        ../scripts/dockBankBal.js               \
        ../scripts/dockExtensions.js            \
        ../scripts/dockGLAccounts.js            \
        ../scripts/dockMessageHistory.js        \
        ../scripts/dockMfgActive.js             \
        ../scripts/dockMfgHist.js               \
        ../scripts/dockMfgOpen.js               \
        ../scripts/dockMyAccounts.js            \
        ../scripts/dockMyContacts.js            \
        ../scripts/dockMyTodo.js                \
        ../scripts/dockPayables.js              \
        ../scripts/dockPurchActive.js           \
        ../scripts/dockPurchHist.js             \
        ../scripts/dockPurchOpen.js             \
        ../scripts/dockReceivables.js           \
        ../scripts/dockSalesActive.js           \
        ../scripts/dockSalesHistory.js          \
        ../scripts/dockSalesOpen.js             \
        ../scripts/dockSendMessage.js           \
        ../scripts/dockUserOnline.js            \
        ../scripts/hotkey.js                    \
        ../scripts/incident.js                  \
        ../scripts/initMenu.js                  \
        ../scripts/preferencesComment.js        \
        ../scripts/preferencesHistory.js        \
        ../scripts/preferencesNumber.js         \
        ../scripts/preferencesSelections.js     \
        ../scripts/project.js                   \
        ../scripts/sendMessageToUser.js         \
        ../scripts/stylesheets.js               \
        ../scripts/systemMessage.js             \
        ../scripts/task.js                      \
        ../scripts/todoItem.js                  \
        ../scripts/userPreferences.js

TRANSLATIONS += xtdesktop.base.ts   \
                xtdesktop.ar_eg.ts  \
                xtdesktop.bg.ts     \
                xtdesktop.cn.ts     \
                xtdesktop.cs.ts     \
                xtdesktop.de.ts     \
                xtdesktop.de_at.ts  \
                xtdesktop.de_ch.ts  \
                xtdesktop.en_ca.ts  \
                xtdesktop.es.ts     \
                xtdesktop.es_ar.ts  \
                xtdesktop.es_mx.ts  \
                xtdesktop.et_ee.ts  \
                xtdesktop.fr.ts     \
                xtdesktop.fr_ca.ts  \
                xtdesktop.hr.ts     \
                xtdesktop.it.ts     \
                xtdesktop.jp.ts     \
                xtdesktop.nl.ts     \
                xtdesktop.no.ts     \
                xtdesktop.pl.ts     \
                xtdesktop.pt.ts     \
                xtdesktop.pt_br.ts  \
                xtdesktop.ru.ts     \
                xtdesktop.sk.ts     \
                xtdesktop.tr.ts     \
                xtdesktop.ua.ts     \
                xtdesktop.zh_hk.ts  \
                xtdesktop.zh_tw.ts
