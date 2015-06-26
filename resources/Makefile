# extract version number from the package.xml
VER = $(shell awk '/version *=/ { split($$0, ary, "[\"= ]*");	\
                                  for (i in ary) {		\
				    if (ary[i] == "version") {	\
				      print ary[i + 1] ; exit;	\
				    } } }' package.xml)

TAROPTS = -h --exclude Makefile --exclude .\*

all: ../packages/xtdesktop-$(VER).gz

../packages/xtdesktop-$(VER).gz: FORCE
	[ `uname -s` = Linux ]
	cd .. && tar czf packages/xtdesktop-$(VER).gz $(TAROPTS) resources

FORCE:
