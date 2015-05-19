VER = 4.0.0
TAROPTS = -h --exclude Makefile --exclude .\*

all: ../packages/xtdesktop-$(VER).gz

../packages/xtdesktop-$(VER).gz: FORCE
	[ `uname -s` = Linux ]
	cd .. && tar czf packages/xtdesktop-$(VER).gz $(TAROPTS) resources

FORCE:
