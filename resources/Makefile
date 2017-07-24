# extract version number from the package.xml
VER = $(shell awk '/version *=/ { split($$0, ary, "[\"= ]*");	\
                                  for (i in ary) {		\
				    if (ary[i] == "version") {	\
				      print ary[i + 1] ; exit;	\
				    } } }' package.xml)
PKG = $(shell awk '/name *=/ { split($$0, ary, "[\"= ]*");	\
                                  for (i in ary) {		\
				    if (ary[i] == "name") {	\
				      print ary[i + 1] ; exit;	\
				    } } }' package.xml)

DIR = $(shell awk '/id *=/   { split($$0, ary, "[\"= ]*");	\
                                  for (i in ary) {		\
				    if (ary[i] == "id") {	\
				      print ary[i + 1] ; exit;	\
				    } } }' package.xml)

EXCLUDE = --exclude Makefile --exclude .\*
TAROPTS = -h

all: FORCE
	if [ ! -e client/dict/$(PKG)_ts.pro ] ; then \
	  cd client ; \
	  find * -name *.ui -printf '        ../%p \\\n' | sort | \
	   sed -e '1 s/        /FORMS = /' -e '$$ s/ \\//' >> \
	   dict/$(PKG)_ts.pro ; \
	  echo "" >> dict/$(PKG)_ts.pro ; \
	  find * -name *.js -printf '          ../%p \\\n' | sort | \
	   sed -e '1 s/          /SOURCES = /' -e '$$ s/ \\//' >> \
	   dict/$(PKG)_ts.pro ; \
	  echo "" >> dict/$(PKG)_ts.pro ; \
	  find * -name *.ts -printf '               %f \\\n' | sort | \
	   sed -e '1 s/               /TRANSLATIONS = /' -e '$$ s/ \\//' >> \
	   dict/$(PKG)_ts.pro ; \
	fi

	lupdate -no-obsolete client/dict/$(PKG)_ts.pro
	lrelease client/dict/$(PKG)_ts.pro

	sed -i '/loadqm/d' package.xml
	sed -i '/<\/package>/d' package.xml

	for TRANSLATION in $$(find client/dict -name *.qm | sort) ; do \
	 if ! echo $$TRANSLATION | grep -q 'base' ; then \
	   echo '  <loadqm file="'$$TRANSLATION'"/>' >> package.xml ; \
	  fi \
	done

	echo '</package>' >> package.xml

	cd .. && tar czf packages/$(PKG)-$(VER).gz $(TAROPTS) $(EXCLUDE) $(DIR)

	rm client/dict/*.qm

FORCE:
