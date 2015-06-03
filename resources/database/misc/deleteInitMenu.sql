/* avoid confusion from changing script_order.
   bug 25900 says xtdesktop.initMenu must run after te.initDesktop
 */
delete from xtdesktop.pkgscript where script_name = 'initMenu';
