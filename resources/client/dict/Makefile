all:
	find .. -name '*.ui' -printf 'FORMS+=%p\n' >> ts.pro
	find .. -name '*.js' -printf 'SOURCES+=%p\n' >> ts.pro
	find * -name '*.ts' -printf 'TRANSLATIONS+=%p\n' >> ts.pro

	lupdate -no-obsolete ts.pro
	lrelease ts.pro
	rm ts.pro

	echo '<qm>' >> translations.xml

	for TRANSLATION in $$(find * -name '*.qm' | sort) ; do \
	  if ! expr $$TRANSLATION : '.*base.*' ; then \
	    echo '  <loadqm file="client/dict/'$$TRANSLATION'"/>' >> translations.xml ; \
	  fi \
	done

	echo '</qm>' >> translations.xml
