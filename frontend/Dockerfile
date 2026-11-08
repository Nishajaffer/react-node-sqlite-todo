FROM nginx:alpine
# Copy the compiled production folder from your Mac directly into Nginx
COPY ./dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
