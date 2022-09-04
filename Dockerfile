FROM  itisfoundation/puppeteer
LABEL maintainer="Rekey <rekey@me.com>"

WORKDIR /app/
ENV TZ=Asia/Shanghai
ADD ./app /app/

# ENTRYPOINT [ "./docker-entrypoint.sh" ]

VOLUME /app/store
VOLUME /app/media
EXPOSE 61001

CMD ["node", "app.js"]
