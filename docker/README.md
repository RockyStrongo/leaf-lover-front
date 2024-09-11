### **Build the Docker image**

From the root folder:  

`docker build --build-arg NUXT_PUBLIC_API_BASE="https://backenddomain.com/api/v1" -t leaf_lover_front . -f ./docker/Dockerfile`

### **Run the container**

`docker run -p 3000:3000 leaf_lover_front`