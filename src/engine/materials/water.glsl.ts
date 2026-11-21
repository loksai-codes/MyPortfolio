// Koi pond surface: procedural ripples, Fresnel sky reflection, moon + lantern glints.
export const waterVertex = /* glsl */ `varying vec3 vW;
void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;

export const waterFragment = /* glsl */ `uniform float t;uniform vec3 moon,l1,l2,l3;varying vec3 vW;
void main(){vec2 p=vW.xz;
  float nx=(sin(p.x*3.1+t*1.2)+sin(p.y*4.3-t*.9)*.8+sin((p.x+p.y)*7.3+t*1.9)*.5+sin(length(p-vec2(-2.4,5.3))*12.-t*3.)*.35)*.035;
  float nz=(cos(p.y*3.3+t*1.1)+cos(p.x*4.9-t*.8)*.8+cos((p.x-p.y)*6.7+t*1.6)*.5)*.035;
  vec3 n=normalize(vec3(nx,1.,nz));vec3 v=normalize(cameraPosition-vW);vec3 r=reflect(-v,n);
  float fr=pow(1.-max(dot(v,n),0.),2.5);
  vec3 sky=mix(vec3(.36,.24,.36),vec3(.05,.05,.14),smoothstep(0.,.35,r.y));
  vec3 deep=vec3(.02,.05,.06);
  vec3 c=mix(deep,sky,.25+.75*fr);
  c+=vec3(1.,.93,.78)*pow(max(dot(r,normalize(moon-vW)),0.),700.)*4.;
  c+=vec3(1.,.6,.28)*(pow(max(dot(r,normalize(l1-vW)),0.),90.)*1.4+pow(max(dot(r,normalize(l2-vW)),0.),60.)*1.2+pow(max(dot(r,normalize(l3-vW)),0.),40.)*.6);
  gl_FragColor=vec4(c,.82);}`;
