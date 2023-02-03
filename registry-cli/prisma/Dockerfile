FROM mysql:5.7
COPY seed-data.sql /docker-entrypoint-initdb.d/
RUN chown -R mysql:mysql /docker-entrypoint-initdb.d/
EXPOSE 3306
