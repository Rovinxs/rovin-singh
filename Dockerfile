FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy only the public website into the web root.
RUN rm -rf /usr/share/nginx/html/*
COPY index.html /usr/share/nginx/html/index.html
COPY 404.html /usr/share/nginx/html/404.html
COPY favicon.ico /usr/share/nginx/html/favicon.ico
COPY robots.txt /usr/share/nginx/html/robots.txt
COPY sitemap.xml /usr/share/nginx/html/sitemap.xml
COPY css/ /usr/share/nginx/html/css/
COPY images/ /usr/share/nginx/html/images/
COPY blog/ /usr/share/nginx/html/blog/

RUN nginx -t

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
