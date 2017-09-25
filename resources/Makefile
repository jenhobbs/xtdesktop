# extract version number from the package.xml
EXTRACT = awk '/XXX *=/ { split($$0, ary, "[\"= ]*");	\
                          for (i in ary) {		\
			    if (ary[i] == "XXX") {	\
			      print ary[i + 1] ; exit;	\
			   } } }' package.xml
VER = $(shell $(subst XXX,version,$(EXTRACT)))
PKG = $(shell $(subst XXX,name,   $(EXTRACT)))
DIR = $(shell $(subst XXX,id,     $(EXTRACT)))

SED_I = $(shell sed -i "" -e "s/Z/Z/" Makefile 2>/dev/null || echo failed)
ifeq ($(SED_I),failed)
  SED_I = sed -i
else
  SED_I = sed -i ""
endif

EXCLUDE = --exclude Makefile --exclude client/dict/build.xsl
TAROPTS = -h

all:
	cd client/dict && make

	cp package.xml ../package.xml
	xsltproc -o package.xml client/dict/build.xsl package.xml
	rm client/dict/translations.xml

	cd .. && tar czf packages/$(PKG)-$(VER).gz $(TAROPTS) $(EXCLUDE) $(DIR)

	rm client/dict/*.qm
	mv ../package.xml .

no-translations:
	cp package.xml ../package.xml
	$(SED_I) \
	    -e 's/\(updater[ 	]*=[ 	]*\)"2.5.0Beta"/\1"2.4.0Beta"/' \
	    -e '/<translations\/>/d' package.xml

	cd .. && tar czf packages/$(PKG)-$(VER).gz $(TAROPTS) $(EXCLUDE) $(DIR)

	mv ../package.xml package.xml
