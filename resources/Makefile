VER = 4.0.0
EXCLUDE = --exclude Makefile --exclude .\*
TAROPTS = -h

all: FORCE
	cd .. && tar czf packages/xtdesktop-$(VER).gz $(TAROPTS) $(EXCLUDE) resources

FORCE:
