
CREATE OR REPLACE FUNCTION xtdesktop.fetchWelcomeHtml() RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _html TEXT;

BEGIN

  _html := '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"> 
<HTML> 
<HEAD> 
	<META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"> 
	<TITLE></TITLE> 
	<META NAME="GENERATOR" CONTENT="OpenOffice.org 3.0  (Unix)"> 
	<META NAME="CREATED" CONTENT="20100422;16091500"> 
	<META NAME="CHANGED" CONTENT="20100422;16095800"> 
	<META NAME="Info 1" CONTENT=""> 
	<META NAME="Info 2" CONTENT=""> 
	<META NAME="Info 3" CONTENT=""> 
	<META NAME="Info 4" CONTENT=""> 
	<STYLE TYPE="text/css"> 
	<!--
		@page { margin: 0.79in }
		P { margin-bottom: 0.08in }
	--> 
	</STYLE> 
</HEAD> 
<BODY LANG="en-US" DIR="LTR"> 
<P STYLE="margin-bottom: 0in"><B>Welcome to xTuple</B></P> 
<P STYLE="margin-bottom: 0in"><BR> 
</P> 
<P STYLE="margin-bottom: 0in">You are not connected to the internet
at this time</P> 
</BODY> 
</HTML>';

  RETURN _html;

END;
$$ LANGUAGE 'plpgsql';

