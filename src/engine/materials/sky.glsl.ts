// Night sky dome: horizon → mid → zenith gradient with a moon glow lobe. Raw output (no colour-space chunk, as in r128).
export const skyVertex = /* glsl */ `varying vec3 d;
void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

export const skyFragment = /* glsl */ `uniform vec3 md;varying vec3 d;
void main(){float h=clamp(d.y,-.2,1.);
  vec3 hor=vec3(.42,.27,.38),mid=vec3(.11,.11,.29),zen=vec3(.015,.02,.075);
  vec3 c=mix(hor,mid,smoothstep(-.02,.22,h));c=mix(c,zen,smoothstep(.2,.75,h));
  float m=max(dot(d,md),0.);c+=vec3(1.,.9,.75)*(pow(m,60.)*.35+pow(m,8.)*.08);
  if(h<0.)c=mix(c,vec3(.13,.1,.2),smoothstep(0.,-.1,h));gl_FragColor=vec4(c,1.);}`;
