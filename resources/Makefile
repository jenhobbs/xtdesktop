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

	rm client/dict/translations.xml
	echo '<qm>' >> client/dict/translations.xml

	for TRANSLATION in $$(find client/dict -name *.qm | sort) ; do \
	 if ! expr $$TRANSLATION : '.*base.*' ; then \
	   echo '  <loadqm file="'$$TRANSLATION'"/>' >> client/dict/translations.xml ; \
	  fi \
	done

	echo '</qm>' >> client/dict/translations.xml

	cp package.xml ../package.xml
	xsltproc -o package.xml client/dict/build.xsl package.xml

	cd .. && tar czf packages/$(PKG)-$(VER).gz $(TAROPTS) $(EXCLUDE) $(DIR)

	rm client/dict/*.qm
	mv ../package.xml .

FORCE:
