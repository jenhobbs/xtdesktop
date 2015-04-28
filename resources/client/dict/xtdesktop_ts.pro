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
        ../scripts/incident.js                  \
        ../scripts/initMenu.js                  \
        ../scripts/preferencesComment.js        \
        ../scripts/preferencesHistory.js        \
        ../scripts/preferencesNumber.js         \
        ../scripts/preferencesSelections.js     \
        ../scripts/project.js                   \
        ../scripts/sendMessageToUser.js         \
        ../scripts/systemMessage.js             \
        ../scripts/task.js                      \
        ../scripts/todoItem.js                  \
        ../scripts/userPreferences.js

TRANSLATIONS += xtdesktop.base.ts
