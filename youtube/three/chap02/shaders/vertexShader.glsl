void main(){
   vec3 newPosition = position;
   // newPosition.z += newPosition.x + newPosition.y;
   newPosition.z += sin(newPosition.x * 10.0);
   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}