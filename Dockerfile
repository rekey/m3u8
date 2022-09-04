FROM  alpine
LABEL maintainer="Rekey <rekey@me.com>"

WORKDIR /app/
ENV TZ=Asia/Shanghai
ADD ./src /app/

RUN sed -i "s/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g" /etc/apk/repositories && \
    apk update && \
    apk add nodejs npm curl && \
    node -v && \
    npm --verb i

# ENTRYPOINT [ "./docker-entrypoint.sh" ]

VOLUME /app/store
VOLUME /app/media
EXPOSE 61001

CMD ["node", "app.js"]
