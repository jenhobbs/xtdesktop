# xtdesktop

This repository holds xtdesktop, a supplemental extension package for
xTuple ERP that provides a graphical presentation of commonly used
menu items and quick reference lists of critical data.  The following
items are prerequisites for using this extension:

 * xTuple Updater version 2.2.4
 * xTuple ERP 4.9.0 or later

xtdesktop is included on the xTuple reference databases built with
each release, but it can be obtained independently from either
[SourceForge](https://sourceforge.net/projects/postbooks/files/12%20PostBooks-packages/)
or [github](https://github.com/xtuple/xtdesktop/releases).

The package is installed with xTuple Updater, an application for
xTuple ERP (PostBooks, Standard, and Manufacturing Editions) which
helps you update your databases from one release to the next,
to upgrade from one xTuple ERP edition to another, such as from
PostBooks to Standard Edition, and to load supplemental extensions
into your xTuple database. The Updater reads and processes upgrade
scripts or packages, which are collections of files bundled together
into .gz files.  A fuller description of xTuple Updater may be found
on the [Updater wiki](https://github.com/xtuple/updater/wiki).

## How to install xtdesktop

Before performing any updates to a database, you should first make
a backup copy of the database you are updating. Having a backup
ensures you can always go back to the original database if errors
occur during the upgrade.

Download the Updater from
[SourceForge](https://sourceforge.net/projects/postbooks/files/06%20PostBooks-updater/), the perform the following steps:

- Run the Updater application.
- From within Updater go to File > Open and select the xtdesktop package.
- Click Start.
- Close the Updater and re-start your xTuple ERP application. You
should find the Desktop installed on the xTuple main window.

Note:  To access all Desktop functionality, users must be configured as follows:

- User preferences must be set "Show windows as Free-floating." 
  (You must close and restart the application after changing this setting)
- Be sure also to grant privileges to users who want to use the
  Desktop in System > Maintain Users.
  The Desktop is listed there as its own module.
